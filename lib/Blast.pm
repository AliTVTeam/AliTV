package Blast;

use strict;
use warnings;
use IPC::Open3;	
use Symbol 'gensym'; 


=head1 NAME

Blast.pm - A OO Perl Blast Module.

=head1 SYNOPSIS

  use Blast;

=head1 DESCRIPTION

This Module provides you with a interface for Blast searches. 
It's easy extendable to support different versions and implementations
of the Blast algorithm using easy createable additional config packages. 


=head1 CONSTRUCTOR new

Blast Class constructor. Should be called via a configuration package for a specific blast implentation.
Creates and returns a blast object based on defaults from L<config packages | Config Packages> and given parameters. 

The constructor does not actually start the blast search, see L</run> for that. 

  my $blast = Blast::NCBI_plus::Blastp->new({_stdin => $some_sequence});
  
  $blast->command();    # returns the concatenated shell command
  
  $blast->run->result->output();     # returns the output of the search 

=cut

=head2 blast parameter

The blast method accepts configuration parameters to complement and/or overwrite the configuration package defaults.
They can be passed as HASHREF with the same syntax as the config package 
or as STRING with the blank separated syntax of the according blast implentation.

  my $blast = Blast::NCBI_plus::Blastp->blast({_stdin => $some_sequence})
  
  my $blast = Blast::NCBI_plus::Blastp->blast("-num_descriptions 100 -ungapped -num_threads 2");

=head2 blast object

The returned blast object keeps the structure of the config/parameter objects. 
In addition it contains the output of the blast search after the corresponding methods C<run> and C<result> have been called. See L<METHODS public>.

=cut

 #to detach in a extra process
    # where STDIN, STDOUT and STDERR can be controlled and the blast run can be canceled

#-- constructor(s) ---------------------------------------------------------------------------------------------

sub new {
	my ($child, $p) = @_;

    # use defaults of called subClass 
    my $d = $child->_defaults();
    
    my $self = _do_params($d,$p);
    bless $self, $child;	
    
    $self->{_class} = $child;
	$self->_verbose('Blast');
	$self->{_status} = 'initialized';
	$self->_verbose($self->{_status});
    
    $self->_build_command();
    
    return $self;
}

=head1 CONSTRUCTOR blast

Generally the same as L<CONSTRUCTOR new> but simpler. It immediatly runs the blast search 
based on the given parameters and doesn't return until the run is finished. 
Therefore no external pid tracking is possible, which means no L<canceling|/cancel>.

  my $blast = Blast::NCBI_plus::Blastp->blast({_stdin => $some_sequence});
  
  $blast->command();    # returns the concatenated shell command
  
  $blast->output();     # returns the output of the search 

=cut

sub blast {
    my ($child, $p) = @_;
    my $self = new($child, $p);
    return $self->run->result;
}




#-- privates ---------------------------------------------------------------------------------------------

=head1 METHODS private 

=head2 _do_params

Private Method. Returns the processed and merged parameters passed to the constructor and the default config.

=cut

sub _do_params {
	my ($d, $p) =  @_;
	if (not defined $p){
		return $d;
	}else{
		# If string, split at blanks
		if(ref \$p eq 'SCALAR'){
			# add empty string to flag only values
			for my $flag (@{$d->{_flag_only}}){
				$p =~ s/($flag\s+)([^'"])/$1"" $2/;
			}
			# string to hash 
			$p = {split(/\s+/, $p)};
		# if not hash nor string	
		}elsif(ref $p ne 'HASH'){
			die("Parameter isn't HASHREF nor a blank separated string!\n");
		}
	
	    # merge (and overwrite) defaults with params
	    my $dp = {%$d, %$p};
	 
	   	# check $bin 
		unless(-x $dp->{_bin}){
			die ($dp->{_bin}. " doesn't exist or isn't executable");
		}
	    return $dp;
	}
}

=head2 _build_command

Private Method. Concatenates the blast command and stores it in the blast object.

=cut

sub _build_command {
	my ($self, $d, $p) = @_;
	
	$self->{_blast_command} = '';
	
	# builds command string from blast object
	
	while (my ($k, $v) = each %$self){
		# ignore internals
		next if ($k =~ /^_/);
		if(defined($v)){
			$self->{_blast_command} .="$k $v ";
		}	
	}
}

=head2 _run_ipc_open

Private Method. Dispatches the blast call using C<IPC::Open3>, 
stores the pid of the blast process as well as active filehandles to control
C<STDIN>, C<STDOUT> and C<STRERR> of the blast run in the blast object.

=cut

sub _run_ipc_open {
	my ($self) = @_;
	
	$self->{_command} = '"'.$self->{_bin}.'" '.$self->{_blast_command};

	# define read- / writehandle for childprocess communication   	
	my($wtr, $rdr, $err);
   	$err = gensym;
   	
   	$self->{_pid} = open3($wtr, $rdr, $err, $self->{_command});
	
	$self->{_result_reader} = $rdr;
	$self->{_error_reader} = $err;
	$self->{_status} = 'opened with IPC::Open3';
	$self->_verbose($self->{_status}.', pid : '.$self->{_pid});
	# TODO: query management. $query, _stdin -query
	unless (ref $self || ref $self !~ /^Blast/ ){
		die "Blast not initialized!\n";
	}
	
	# Pipe Query from STDIN 
	if( defined $self->{_stdin} && defined $self->{-query} ){
		die("Can't take query file and STDIN at the same time!\n");
	} 
	
	$self->{_status} = 'running';

	$self->_verbose($self->{_status});
	# actuall call via stdin
	print  $wtr $self->{_stdin} if $self->{_stdin};
   	close  $wtr;
   	return $self;
}

=head2 _run_pipe_open

Private Method. Dispatches the blast call with a C<$pid = open my $rdr, '-|', "cmd"> construct to the shell 
and stores the result reader as well as a pid to cancel the run (actually not the pid returned by the open cmd) in the blast object.
Set C<_no_ipc = 1> to prevent default L</_run_ipc_open> method. 

=cut

sub _run_pipe_open {
	my ($self) = shift;
	my $tmp_error_log = '.blast_stderr';
	
	$self->{_command} = $self->{_bin}.' '.$self->{_blast_command};

	# Pipe Query from STDIN 
	if(defined($self->{_stdin})){
		if (defined $self->{-query}){die("Can't take query file and STDIN at the same time!\n")};
		# quick'n'dirty echo "<query>" | blast
		$self->{_command} = 'echo "'.$self->{_stdin}.'" | ' . $self->{_command};
	}

	# This 'son of a bitch' construct obviously starts two processes.
	# Looks like one for the shell command with parent_pid +1
	# and one thats listening to the STOUT pipe coming back, with parent_pid +2 - ?, but as far as I know closer than +10.
	# killing the first process doesnt stop the blast, might even make the listener wait forever
	# killing the listener seams to be sufficient to end both processes, sth like waitpid in first, is parent
	
	my $open_pid = open my $rdr, '-|', $self->{_command}.' 2> '.$tmp_error_log or die $!;

	$self->{_status} = 'running';
	$self->_verbose($self->{_status});

	# little hack to verify the listeners pid
	# get the entry for the all running blast processes
	# search for entry, where open pid is parent and then take the childs id as new id
	sleep(1);
	my $ps = qx(ps -eF | grep -v grep | grep $self->{_bin});
	($self->{_pid}) = $ps  =~ /^\S+\s+(\d+)\s+$open_pid/m;

	# DEPRECATED: dispatch via qx - doesn't return pid
	# execute the command on the shell with qx
	# pipe stderr to file, otherwise not trackable
	# $self->{_raw_output} = qx/$self->{_command} 2> $tmp_error_log/;
	# read stderr from file
	
	$self->{_result_reader} = $rdr;
	$self->{_tmp_error_log} = $tmp_error_log;
	$self->{_status} = 'opened with "-|"';
	$self->_verbose(join('', $self->{_status}, ',pids :', $open_pid, '+', $self->{_pid} || 'NA'));
	return $self;
}

=head2 _verbose

Private Method. Used to print status informations of the run if C<_verbose = 1> is set. 
Takes a message string and a optional boolean value as parameters. 
If set to true, the second parameter causes C<die 'msg'> rather then print.   

=cut

sub _verbose {
	my ($self, $msg, $overwrite) = @_;
	return unless $self->{_verbose}; 
	unless($overwrite){
		print '-- '.$msg."\n"; 
	}else{
		$|=1;
		print "-- ".$msg."\r";
		$|=0;
	}
}

=head2 timeout

Private Method. Initialized by run if C<_timeout> > than 0;

=cut

sub _timeout {
	my ($self) = @_; 
	my $time = 0;
	# set sleep to default 2 seconds if not specified
	if(not defined $self->{_sleep} ){ 
		# set sleep time to never be higher than timeout, but maximal 2 seconds
		$self->{_sleep} = $self->{_timeout} < 2 ? $self->{_timeout} : 2;
	}
	$self->_verbose('timeout of '.$self->{_timeout}.'s activated');
	while(my $pid = kill ('0', $self->{ _pid}) ){ 
		if($time > $self->{_timeout}){
			$self->cancel( 'timeout '.$self->{_timeout} );
			exit(0); 
		}else{
			$self->_verbose($time."s", 1);
			$time += $self->{_sleep};	
			sleep($self->{_sleep});
		}
	}
	exit(0);
}

#-- publics ---------------------------------------------------------------------------------------------

=head1 METHODS public

=head2 run

Public Method. Runs the blast search calling L<_run_ipc_open> or L<_run_pipe_open> if C<_no_ipc = 1> is set. 
Returns the blast object.

  my $blast->run;

=cut


sub run {
	my ($self) = @_;
	
	if($self->{_no_ipc}){
		$self->_run_pipe_open();
	}else{
		#defaults to use IPC::Open3 
		$self->_run_ipc_open(); 
	}
	
	# fork timeout process to monitor the run and cancel it, if necessary
	# child
	if($self->{_timeout} && !( $self->{_timeout_pid} = fork()) ){
		# fork error
		if ( not defined $self->{_timeout_pid} ){ die "couldn't fork: $!\n"; }
		$self->_timeout(); 
		# childs exits either after timeout canceled blast or blast run has finished
	}
	# parent - simply proceeds
	
	return $self
}


=head2 cancel

Public Method. Cancels a running blast search based on a passed query process id 
or the internally stored process id of the blast object;

  my $blast->cancel;
  
  my $blast->cancel(pid);

=cut

sub cancel {
	my ($pid, $msg);
	# object method
	if(ref (my $me = shift)){
		$pid = $me ->{_pid};
		$msg = shift;
	}
	# class method
	else{
		($pid, $msg) = @_;
	}
	$msg = $msg || '';
	
	unless( kill ('1', $pid) ){
#		$pid." doesnt exist -> probably already finished\n");
	};
}



=head2 result

Public Method. Retrieves (waits) for the result/canceling of a started blast search.
Stores the result and errors in the blast object.

  my $blast->result;

=cut

sub result {
	my ($self) = @_; 
	unless (ref $self || ref $self !~ /^Blast/ ){
		die "Blast not initialized!\n";
	}
	#TODO: what if filehandles already open
	
	my $rdr = $self->{_result_reader};
	$self->{_raw_output} = join('', <$rdr>);
	close $rdr;
	
	$self->{_raw_output} =~ s/&amp;auml;/ä/; # illegal chars in author name for valid xml 
	
	my $err;
	
	# open with -|
	if($self->{_no_ipc}){
		if($self->{_tmp_error_log} && -e $self->{_tmp_error_log}){
			open(my $err, '<', $self->{_tmp_error_log});
			
			$self->{_error} = join('', <$err>);
			close $err;
			
			# delete stderr file 
			unlink $self->{_tmp_error_log};
		}
	# IPC::Open3
	}else{
		$err = $self->{_error_reader};
		$self->{_error} = join('', <$err>);
		close $err;
	}
	
	if($self->{_error} && $self->{_error} =~ /\w/){
		$self->{_status} = "internal blast error\n\t". $self->{_error};
	}else{
		# waits for child process to finish, after that $? contains exit value of the child
		# "IPC" : wait is necessary with ipc to get meaningful $?
		unless($self->{_no_ipc}){ wait; }

		if($?){
			$self->{_status} = 'canceled';
		}else{
			# set status to 
			$self->{_status} = 'done';
		}
	}
	$self->_verbose($self->{_status});
	
	return $self;
}


=head2 generic "stuff" functions

  $blast->command();
   # Returns the initial shell command.
  
  $blast->defaults()
   # Returns the defaults from the config package.
  
  $blast->output()
   # Returns the (modified) output if the result is complete.
   
  $blast->raw_output(){
   # Returns the raw output if the result is complete.

=cut

sub pid(){
	my ($self) = @_; 
	return $self->{_pid} || die "No pid, blast not running\n";
}

sub command(){
	my ($self) = @_; 
	return $self->{_command}	
}

sub defaults(){
	my ($self) = @_; 
	return $self->_defaults(); 
}

sub output(){
	my ($self) = @_; 
	
	return $self->{_mod_output} // return $self->{_raw_output}; #// just a eclipse syntax highlightning error
	
	# TODO: what if no output 
}


sub raw_output(){
	my ($self) = @_; 
	
	return $self->{_raw_output} // return $self->{_raw_output}; #// just a eclipse syntax highlightning error
}


=head2 error

Public Method. Returns true if blast run finished with errors.

  $blast->error

=cut

sub error(){
	my ($self) = @_;
	return $self->{_status} eq 'done' ? 0 : $self->{_status}."\n". $self->{_error};
}

=head2 error

Public Method. Returns true if blast run finished with errors.

  $blast->error

=cut

sub canceled(){
	my ($self) = @_;
	return $self->{_status} eq 'canceled' ? 1 : 0;
}

=head2 modify_output

Public Method. Needs a reference to a funtion as input. 
Applies this function to the raw output (accessable through C<$_[0]>)
and stores it as modified output.

  $blast->modify_output($modify_function)

=cut


sub modify_output(){
	my ($self, $fn) = @_;
	$self->{_mod_output_fn} = $fn;
	$self->{_mod_output} = &$fn($self->{_raw_output});
}

sub _defaults{
	return {}
}


# doesn't work yet
#sub watch(){
#	my ($self) = @_; 
#	
#	my $x = '.';
#	
#	print $self->{_status} ."\n";
#	print $self->{_pid}."\n";
#	
#	# while blast process is a alive
#	while( kill(0, $self->{_pid}) ){
#		$x = $x eq '.' ? '..' : '.';
#		print "\r".$x;
#		sleep(1);
#	}
#	
#	use POSIX ":sys_wait_h";
#	my $kid;
#	
#	print "\n". $self->{_status}."\n";
#	
#}


=head1 Config Packages

The requirements for a config package are simple. 

It needs a package name representing its location in the Blast package directory tree,
a call to inherit from the Blast base class and
a function C<&_defaults> that returns basic properties as HASHREF.

The properties can be devided in to classes. 

One contains of internal required parameters, 
indicated through a leading "_", e.g. the path to the binary of the blast program. 
Not having these parameter specified will cause the module to crash. 

The second class are parameters that are passed to the actual external blast program. 
There key syntax is the same as in the blast program.
If they are set, they will be used to concatenate the blast command, 
else the external blasts defaults will be used. 

  package Blast::NCBI_plus::Blastn;
  
  use warnings;
  use strict;
  # inherit from Blast Class
  use base qw(Blast);
  
  sub _defaults(){
    my ($class, $impl, $prog) = split(/::/,__PACKAGE__);
    {
        _prog                 => $prog,
        _impl                 => $impl,
        _bin                  => $Base::blastnBin,
        # boolean flags, which in the config will have a value 0 or 1 assigned
        # but have to be concatenated without value in the execution command
        _flag_only            => [qw(
               -h
               -help
               -version
               -show_gis
               -html
               -lcase_masking
               -no_greedy
               -ungapped
               -parse_deflines
               -remote
            )],
        
        # defaults for blastn with this module 
        # undef means that blasts internal defaults are used
        # The same goes for unset options
        -db                   => $Base::sequenceBlastDatabase,
        -evalue               => undef,
        -word_size            => undef,        # <Integer, >=4>
        -outfmt               => 5,            # 5 = XML
        -num_descriptions     => 100,        
        -num_alignments       => 100,
        -num_threads          => 2 ,
     };
  }


=head1 TODO

=over 6

=item *

advanced error checking

=item *

result to file, filehandle in return

=item * 

include C<qsub>


=back

=head1 AUTHOR

S<dumps  |  Thomas Hackl  |  >thomas.hackl@lim4.deS<  |  2011/01/19>

=head1 SEE ALSO

=cut

1;