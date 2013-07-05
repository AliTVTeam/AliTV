package Verbose;

use warnings;
use strict;
use Data::Dumper;

=head1 NAME 

Verbose

=head1 DESCRIPTION

Collection of generic function to create verbose messages.

=head1 SYNOPSIS

=head1 TODO

=head1 Constructor METHOD

=cut

sub new{
	my $class = shift;
	
	# defaults=
	my $self = {
		fh => \*STDERR,
		level => 1,
		report_level => 1,
		format => "{MESSAGE}\n",	# default template is class template
		start_time => time(),	# safe time() of creation for elapsed templates
		line_delim => "\n",
		line_width => undef,
		@_	# overwrite
	};
	
	if ($self->{file}){
		my $fh;
		open ( $fh , $self->{file}) or die "$class->new(): '".$self->{file}."', $!";
		$self->{fh} = $fh;
	}
	
	bless $self, $class;
}


=head1 Class ATTRIBUTES

=head2 Verbose::Templates

Collection of standart verbose templates.

=cut

our $Templates = {
	MESSAGE => sub{
		sprintf ("%s", $_[0]->{message})
	},
	CALLER => sub{
		sprintf ("%s", $_[0]->{caller} , $_[0]->{message})
	},
	LINE => sub{
		sprintf ("#%d", $_[0]->{caller}, $_[0]->{line}, $_[0]->{message})
	},
	TIME_SHORT => sub{
		sprintf("%02d:%02d:%02d", (localtime)[2,1,0], $_[0]->{message})
	},
	TIME_FULL => sub{
		sprintf("%s", scalar(localtime), $_[0]->{message})
	},
	TIME_ELAPSED => sub{
		sprintf("%02d:%02d:%02d", (gmtime(time() - $_[0]->{start_time} ))[2,1,0], $_[0]->{message})
	}, 
	HLINE => sub{
		return '#'.('-'x($_[0]->{line_width} ? $_[0]->{line_width} -2 : 78))."#\n" ;
	},
};

=head1 Object METHODS

=head2 verbose

Print verbose message according to specified level.

=cut

sub verbose{
	my $self = shift;
	my $p = {
		%$self,
		caller => (caller(0))[0],
		line => (caller(0))[2],
		@_%2 ? (message => shift, @_) : @_	# overwrite + odd number of params -> first is message
	}; 
	
	$p->{message} = '' unless defined ($p->{message});
	
	if ( $p->{level} <= $p->{report_level} ){
		
		# call format function with self and params, overwrite self
		(my $string = $p->{format}) =~ s/{(.+?)}/
			(exists ($Verbose::Templates->{$1}) && defined ($Verbose::Templates->{$1}))
				? &{$Verbose::Templates->{$1}}({%$self, %$p})
				: "{$1 - undefined replacement}";
		/gxe;
		
		# line width
		if(my $lw = $p->{line_width}){
			my $ndl = length($p->{line_delim}) || 0;
			$string = join ("\n", map{ 
				my $o=-$ndl; 
				substr($_, $o, 0, $p->{line_delim}) while (($o+=$lw+$ndl) < length($_)-1 );
				$_;
			}(split (/\n/, $string, -1)));
		}
		
		print {$self->{fh}} $string;
	}
}


=head2 hline

Print horizontal line.

=cut

sub hline{
	my $self = shift;
	
	my $p = {
		%$self,
		@_%2 ? (message => shift, @_) : @_	# overwrite + odd number of params -> first is message
	}; 
	
	if ( $p->{level} <= $p->{report_level} ){
		print {$self->{fh}} &{$Verbose::Templates->{HLINE}}($p); 
	}
}

=head2 hline

Print horizontal line.

=cut

sub nline{
	my $self = shift;
	
	my $p = {
		%$self,
		@_%2 ? (message => shift, @_) : @_	# overwrite + odd number of params -> first is message
	}; 
	
	if ( $p->{level} <= $p->{report_level} ){
		print {$self->{fh}} "\n"; 
	}
}


=head2 exit

Print critical verbose message and exit.

=cut

sub exit{
	my $self = shift;
	$self->verbose(@_, level => 0);
	exit 1;
}


=head1 Accessor METHODS

=cut

sub fh{
	my $self = shift;
	$self->{fh} = shift if @_ ;
	return $self->{fh};	
}

sub file{
	my $self = shift;
	$self->{file} = shift if @_ ;
	return $self->{file};	
}


=head1 AUTHOR

Thomas Hackl S<thomas.hackl@uni-wuerzburg.de>

=cut


1;