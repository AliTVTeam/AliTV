#!/usr/bin/perl
use strict;
use warnings;
use Getopt::Long;
use Pod::Usage;
use File::Basename;
use FindBin;
use lib $FindBin::Bin;
use Verbose;
use Data::Dumper;

my %options;

=head1 NAME 

wgaDrawingPipeline.pl

=head1 DESCRIPTION

Wrapper to visualize existing whole genome alignments.

=head1 USAGE

  $ perl wgaDrawingPipeline.pl --alignment=<FILE> [options]

=head1 OPTIONS

=over 25

=item --alignment=<FILE>

path to the alignment file. 


=cut

$options{'alignment=s'} = \(my $opt_alignment);


=item [--prefix=<STRING>] 

prefix for the output files. Default is current directory and a prefix
 <alignmentfile>.

=cut

$options{'prefix=s'} = \(my $opt_prefix);
	  
=item [--promer / --nucmer]

use PROmer or NUCmer instead of LASTZ for the alignment 

=cut

$options{'promer'} = \(my $opt_promer);	
$options{'nucmer'} = \(my $opt_nucmer);

=item [--lastz]

use LASTZ for the alignment (default)

=cut

# Not necessary but prevents an error message if someone explicitly specifies lastz
$options{'lastz'} = \(my $opt_lastz);	

=item [--circos-bin=<FILE>] 

Path to the Circos binary file. Default tries if Circos is in PATH;

=cut

$options{'circos-bin=s'} = \(my $opt_circos_bin = `which circos 2>/dev/null`);

=item [--circos-template=<FILE>] 

Path to the customized circos template file.

=cut

$options{'circos-template=s'} = \(my $opt_template = $FindBin::Bin.'/circos_template_full.conf');

=item [--[no]verbose] 

verbose is default.

=cut

$options{'verbose!'} = \(my $opt_verbose = 1);

=item [--help] 

show help

=cut

$options{'help|?'} = \(my $opt_help);

=item [--man] 

show man page

=cut

$options{'man'} = \(my $opt_man);

=back






=head1 CODE

=cut


GetOptions(%options) or pod2usage(1);

chomp($opt_circos_bin);


my $vwga = Verbose->new(
	report_level => $opt_verbose // 0, #/
	format => "[{TIME_ELAPSED}] {MESSAGE}\n",
	line_width => 70
);

my $vbash = Verbose->new(
	report_level => $opt_verbose // 0, #/
	line_width => 70,
	line_delim => "\\\n",
);

my $vplain = Verbose->new(
	report_level => $opt_verbose // 0, #/
	line_width => 70,
);

pod2usage(1) if($opt_help);
pod2usage(-verbose => 99, -sections => "NAME|DESCRIPTION|USAGE|OPTIONS|AUTHORS") if($opt_man);

$vwga->verbose('Checking parameter');
pod2usage(-msg => "Missing alignment file", -verbose => 0) unless ($opt_alignment);
pod2usage(-msg => 'Circos not in $PATH and binary not specified', -verbose => 0) unless ($opt_circos_bin);

$opt_prefix = get_prefix() unless $opt_prefix;
my ($prefix_name,$prefix_dir) = fileparse($opt_prefix);

$vwga->verbose('Parsing results');
$vwga->hline();
my $parser_cmd = parser_command();
$vbash->verbose( $parser_cmd );
my $parser_re = qx($parser_cmd);
$vwga->nline();
$vplain->verbose($parser_re) if $parser_re;
$vwga->exit('ERROR: Parsing failed') if $?>> 8;


	$vwga->verbose('Optimizing contig order');
	$vwga->hline();
	my $order_cmd = order_command();
	$vbash->verbose( $order_cmd );
	my $order_re = qx($order_cmd);
	$vwga->nline();
	$vplain->verbose($order_re) if $order_re;
	$vwga->exit('ERROR: Optimizing contig order failed') if $?>> 8;


$vwga->verbose('Running Circos');
$vwga->hline();
my $circos_cmd = circos_command();
$vbash->verbose( $circos_cmd );
my $circos_re = qx($circos_cmd);
$vwga->nline();
$vplain->verbose($circos_re) if $circos_re;
$vwga->exit('ERROR: Running Circos failed') if $?>> 8;

$vwga->verbose('wgaPipeline finished');

=head2 parser_command

Returns the command to call the parser script.

=cut

sub parser_command{
	if($opt_promer || $opt_nucmer){
		my $cmd= "perl ".$FindBin::Bin."/DnadiffCircosParser.pl --in $opt_prefix --out $opt_prefix --template $opt_template 2>&1";
		$cmd .= " --promer" if ($opt_promer);
		return $cmd;		
	}else{
		return "perl ".$FindBin::Bin."/LastzCircosParser.pl --in $opt_alignment --out $opt_prefix --template $opt_template 2>&1";		
	}
}

=head2 circos_command

Returns the command to call circos.

=cut

sub circos_command{
	return "$opt_circos_bin -conf $opt_prefix.circos.conf -outputdir $prefix_dir -outputfile $prefix_name 2>&1";
}

=head2 order_commmand

Returns the command to call ContigOrder.pl

=cut

sub order_command{
	return "perl ".$FindBin::Bin."/ContigOrder.pl --link=$opt_prefix.link --template=$opt_prefix.circos.conf 2>&1";
}

=head2 get_prefix

Returns a default prefix if none is specified by the user. Style: <query_file>_-_<reference_file>_-_<aligner>

=cut

sub get_prefix{
	my ($ref_name,$ref_path,$ref_suffix) = fileparse($opt_alignment, qw(.txt));
	my $aligner = 'lastz';
	if($opt_promer || $opt_nucmer){
		$aligner = ($opt_promer ? 'promer' : 'nucmer');
	}
	return './'.$ref_name.'_-_'.$aligner;
}

=head1 LIMITATIONS

This pipeline is meant to give a quick and easy to use possibility to generate and visualize whole genome alignments.
It is not meant for extensive analyses of whole genomes. For this purpose see the documentation of the alignment programs
and consider using them.  

=head1 AUTHORS

=over

=item * Markus Ankenbrand, markus.ankenbrand@stud-mail.uni-wuerzburg.de

=item * Thomas Hackl, thomas.hackl@uni-wuerzburg.de

=back


