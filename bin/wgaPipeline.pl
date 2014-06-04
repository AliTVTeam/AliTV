#!/usr/bin/perl
use strict;
use warnings;
use Getopt::Long;
use Pod::Usage;
use File::Basename;
use FindBin;
use lib "$FindBin::Bin/../lib";
use Verbose;
use Data::Dumper;

my %options;

=head1 NAME 

wgaPipeline.pl

=head1 DESCRIPTION

Wrapper to produce whole genome alignments and visualizations.

=head1 USAGE

  $ perl wgaPipeline.pl --query=<fasta> --reference=<fasta> [options]

=head1 OPTIONS

=over 25

=item --query=<FASTA>

path to the query fasta file. 


=cut

$options{'query=s'} = \(my $opt_query);

=item --reference=<FASTA>

path to the reference fasta file

NOTE: '|' in fasta headers cannot be handled properly by the alignment
 programs

NOTE: lowercase letters are masked in lastz.

=cut

$options{'reference=s'} = \(my $opt_reference);

=item --self

Instead of reference the self flag can be set. In this case the query is aligned against itself.
Reference is ignored if self is set.

=cut

$options{'self'} = \(my $opt_self);


=item [--highlightIR] 

Trigger highlighting of Inverted Repeat regions

=cut

$options{'highlightIR'} = \(my $opt_highlightIR);

=item [--prefix=<STRING>] 

prefix for the output files. Default is current directory and a prefix
 <query_file>_-_<reference_file>_-_<aligner>.

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

=item [--contig-order-by-crosslinks]

use a script to set the contig order, that tries to minimize crosslinks
(default is a script, that orders contigs by their longest hit)

=cut

$options{'contig-order-by-crosslinks'} = \(my $opt_contig_order_by_crosslinks);

=item [--seed-length=<INT>] 

seed-length. default LASTZ:12of19, NUCmer=20, PROmer=6

=cut

$options{'seed-length=i'} = \(my $opt_seed_length);

=item [--lastz-bin=<FILE>] 

Path to lastz binary file. Default tries if LASTZ is in PATH;

=cut

$options{'lastz-bin=s'} = \(my $opt_lastz_bin = `which lastz 2>/dev/null`);

=item [--mummer-bin=<FILE>] 

Path to MUMmer binaries (PROmer, NUCmer). Default tries if MUMmer is in PATH;

=cut

$options{'mummer-bin=s'} = \(my $opt_mummer_bin = `which mummer 2>/dev/null`);

=item [--circos-bin=<FILE>] 

Path to the Circos binary file. Default tries if Circos is in PATH;

=cut

$options{'circos-bin=s'} = \(my $opt_circos_bin = `which circos 2>/dev/null`);

=item [--circos-template=<FILE>] 

Path to the customized circos template file.

=cut

$options{'circos-template=s'} = \(my $opt_template = $FindBin::Bin.'/../cfg/circos_template_full.conf');

=item [--minlength=<INT>]

Minimum length of an alignment to be parsed for Circos.

=cut

$options{'minlength=i'} = \(my $opt_minlength);

=item [--minidentity=<INT>]

Minimum identity percentage of an alignment to be parsed for Circos.

=cut

$options{'minidentity=i'} = \(my $opt_minidentity);


=item [--unmask] 

Option to make LASTZ ignore upper-/lowercase (otherwise lowercase letters are ignored)
This is now the default, the option remains for compatibility purpose

=cut

$options{'unmask'} = \(my $opt_unmask = 1);

=item [--mask] 

Option to make LASTZ consider lowercase letters as masked

=cut

$options{'mask'} = \(my $opt_mask = 0);

=item [--transparency <int>] 

Give an transparency value for the circos links between 0 and 5
(0: no transparency, 5: maximum transparency)
Default: 1

=cut

$options{'transparency'} = \(my $opt_transparency = 1);

=item [--[no]cleanheaders] 

cleanheaders is default.

=cut

$options{'cleanheaders!'} = \(my $opt_clean_headers = 1);

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


chomp($opt_lastz_bin,$opt_mummer_bin,$opt_circos_bin);
my $opt_mummer_path = dirname($opt_mummer_bin);

GetOptions(%options) or pod2usage(1);

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

$opt_unmask = 0 if($opt_mask);

$vwga->verbose('Checking parameter');
$opt_reference = $opt_query if ($opt_self);
pod2usage(-msg => "Missing reference or query", -verbose => 0) unless ($opt_reference && $opt_query);
pod2usage(-msg => 'Circos not in $PATH and binary not specified', -verbose => 0) unless ($opt_circos_bin);
if($opt_nucmer or $opt_promer){
	pod2usage(-msg => 'mummer not in $PATH and binary not specified', -verbose => 0) unless ($opt_mummer_bin);
}
else{
	pod2usage(-msg => 'lastz not in $PATH and binary not specified', -verbose => 0) unless ($opt_lastz_bin);
}

$opt_prefix = get_prefix() unless $opt_prefix;
my ($prefix_name,$prefix_dir) = fileparse($opt_prefix);

if($opt_clean_headers){
	$vwga->verbose('Cleaning fasta headers (replacing illegal symbols like | and = by _');
	$vwga->hline();
	my $clean_headers_cmd = clean_headers_command();
	$vbash->verbose($clean_headers_cmd);
	my $clean_re = qx($clean_headers_cmd);
	$vwga->nline();
	$vplain->verbose($clean_re) if $clean_re;
}
if($opt_highlightIR){
	$vwga->verbose('Highlighting IR');
	$vwga->hline();
	my $ir_highlight_cmd = ir_highlight_command();
	$vbash->verbose($ir_highlight_cmd);
	my $ir_re = qx($ir_highlight_cmd);
	$vwga->nline();
	$vplain->verbose($ir_re) if $ir_re;
}
$vwga->verbose('Calculating alignment');
$vwga->hline();
my $aln_cmd = aln_command();
$vbash->verbose( $aln_cmd );
my $aln_re = qx($aln_cmd); 
$vwga->nline();
$vplain->verbose($aln_re) if $aln_re;
$vwga->exit('ERROR: Calculating alignment failed') if $?>> 8;

$vwga->verbose('Parsing results');
$vwga->hline();
my $parser_cmd = parser_command();
$vbash->verbose( $parser_cmd );
my $parser_re = qx($parser_cmd);
$vwga->nline();
$vplain->verbose($parser_re) if $parser_re;
$vwga->exit('ERROR: Parsing failed') if $?>> 8;

unless($opt_self){
	$vwga->verbose('Optimizing contig order');
	$vwga->hline();
	my $order_cmd = order_command();
	$vbash->verbose( $order_cmd );
	my $order_re = qx($order_cmd);
	$vwga->nline();
	$vplain->verbose($order_re) if $order_re;
	$vwga->exit('ERROR: Optimizing contig order failed') if $?>> 8;
}

$vwga->verbose('Annotating features');
$vwga->hline();
my $highlight_cmd = highlight_command();
$vbash->verbose( $highlight_cmd );
my $highlight_re = qx($highlight_cmd);
$vwga->nline();
$vplain->verbose($highlight_re) if $highlight_re;
$vwga->exit('ERROR: Annotating features failed') if $?>> 8;

$vwga->verbose('Running Circos');
$vwga->hline();
my $circos_cmd = circos_command();
$vbash->verbose( $circos_cmd );
my $circos_re = qx($circos_cmd);
$vwga->nline();
$vplain->verbose($circos_re) if $circos_re;
$vwga->exit('ERROR: Running Circos failed') if $?>> 8;

#Find out the contigs total / contigs aligned ratio:
my $chromosomes_total1 = qx(grep -c "^>" $opt_query);
my $chromosomes_total2 = qx(grep -c "^>" $opt_reference);
my $chromosomes_drawn1 = qx(grep "chr - " $opt_prefix.karyo | grep -c " Q_");
my $chromosomes_drawn2 = qx(grep "chr - " $opt_prefix.karyo | grep -c " R_");
chomp($chromosomes_total1, $chromosomes_total2, $chromosomes_drawn1, $chromosomes_drawn2);
$vwga->verbose("Chromosomes aligned: ");
my $stat = "Query: $chromosomes_drawn1 of $chromosomes_total1\nReference: $chromosomes_drawn2 of $chromosomes_total2";
$vplain->verbose($stat);
$vwga->nline();
$vwga->verbose('wgaPipeline finished');

=head2 clean_headers_command

Returns the command to clean header lines of fastas.

=cut

sub clean_headers_command{
	my $cmd = 'cp '."$opt_query $opt_prefix"."_query.fasta\n";
	$opt_query = "$opt_prefix"."_query.fasta";
	$cmd .= 'cp '."$opt_reference $opt_prefix"."_reference.fasta\n";
	$opt_reference = "$opt_prefix"."_reference.fasta";
	$cmd .= 'perl -i -pe \'s/[|:=]/_/g\' '."$opt_query $opt_reference";
	return $cmd;	
}

=head2 ir_highlight_command

Returns the command to highlight inverted repeat regions.

=cut

sub ir_highlight_command{
	my $cmd = 'perl '.$FindBin::Bin."/highlight_and_mask_IR.pl --in $opt_query --seqprefix Q_ --outprefix query_IR --color black\n";
	$cmd .= 'perl '.$FindBin::Bin."/highlight_and_mask_IR.pl --in $opt_reference --seqprefix R_ --outprefix reference_IR --color black";
	return $cmd;	
}

=head2 aln_command

Returns the command to call the alignment program.

=cut

sub aln_command{
	if($opt_promer || $opt_nucmer){ #//
		my $cmd='';
		my $bin = $opt_promer ? 'promer' : 'nucmer';
	    $cmd .= "$opt_mummer_path/$bin -p $opt_prefix ".($opt_seed_length ? "--minmatch $opt_seed_length " : '')."$opt_reference $opt_query 2>&1\n";
	    $cmd .= "$opt_mummer_path/delta-filter -m $opt_prefix.delta > $opt_prefix.mdelta 2>&1\n";
	    $cmd .= "$opt_mummer_path/show-coords -THrcl $opt_prefix.mdelta > $opt_prefix.mcoords 2>&1\n";
		return $cmd;		
	}else{
		my $cmd  = "$opt_lastz_bin ";
		$cmd .= "$opt_reference"."[multiple".($opt_unmask ? ',unmask' : '')."] ";
		$cmd .= "$opt_query".($opt_unmask ? '[unmask]' : '')." ";
		$cmd .= "--format=general:name1,zstart1,end1,size1,name2,zstart2+,end2+,strand2,size2,identity,score,length2 ";
		$cmd .= "--output=$opt_prefix.txt --noytrim --ambiguous=iupac --gapped ";
		$cmd .= ($opt_seed_length ? "--seed=match$opt_seed_length " : '')."2>&1";	
		return $cmd;	
	}
}

=head2 parser_command

Returns the command to call the parser script.

=cut

sub parser_command{
	if($opt_promer || $opt_nucmer){
		my $cmd= "perl ".$FindBin::Bin."/DnadiffCircosParser.pl --in $opt_prefix --out $opt_prefix --template $opt_template 2>&1";
		$cmd .= " --promer" if ($opt_promer);
		$cmd .= " --minlen $opt_minlength" if ($opt_minlength);
		$cmd .= " --minidy $opt_minidentity" if ($opt_minidentity);
		$cmd .= " --transparency $opt_transparency";
		return $cmd;		
	}else{
		my $self_command = "";
		$self_command = "--self" if($opt_self);
		my $cmd = "perl ".$FindBin::Bin."/LastzCircosParser.pl --in $opt_prefix.txt --out $opt_prefix $self_command --template $opt_template 2>&1";		
		$cmd .= " --minlen $opt_minlength" if ($opt_minlength);
		$cmd .= " --minidy $opt_minidentity" if ($opt_minidentity);
		$cmd .= " --transparency $opt_transparency";
		return $cmd;
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
	my $order_script = 'ContigOrderByLongestHit.pl';
	$order_script = 'ContigOrder.pl' if ($opt_contig_order_by_crosslinks);
	return "perl ".$FindBin::Bin."/$order_script --link=$opt_prefix.link --template=$opt_prefix.circos.conf 2>&1";
}

=head2 highlight_commmand

Returns the command to call highlightFeatures.pl

=cut

sub highlight_command{
	my $high_cmd = "perl ".$FindBin::Bin."/highlightFeatures.pl --query=$opt_query --reference=$opt_reference "; 
	$high_cmd .= "--ir " if($opt_highlightIR);
	$high_cmd .= "--prefix=$opt_prefix --n-stretch=white --wanted_ids $opt_prefix.wanted_ids 2>&1";
	return $high_cmd;
}

=head2 get_prefix

Returns a default prefix if none is specified by the user. Style: <query_file>_-_<reference_file>_-_<aligner>

=cut

sub get_prefix{
	my ($ref_name,$ref_path,$ref_suffix) = fileparse($opt_reference, qw(.fa .fasta .fas));
	my ($query_name,$query_path,$query_suffix) = fileparse($opt_query, qw(.fa .fasta .fas));
	my $aligner = 'lastz';
	if($opt_promer || $opt_nucmer){
		$aligner = ($opt_promer ? 'promer' : 'nucmer');
	}
	return './'.$query_name.'_-_'.$ref_name.'_-_'.$aligner;
}

=head1 LIMITATIONS

This pipeline is meant to give a quick and easy to use possibility to generate and visualize whole genome alignments.
It is not meant for extensive analyses of whole genomes. For this purpose see the documentation of the alignment programs
and consider using them.  

=head1 CHANGELOG

=head2 20.09.2013

=over

=item * The --cleanheaders option is implemented and set by default, use --nocleanheaders to skip header cleaning

=item * The highlight file gets filtered at the end to remove unaligned sequences (those cause errors in circos)

=back

=head2 08.11.2012

=over

=item * The --unmask option is now set by default, there is an additional --mask flag to enforce masking by lastz

=item * There are two additional option --minidentity <INT> and --minlength <INT> that are passed through to the Circos Parsers

=item * A statistic of total and aligned contigs is returned as part of the log

=back


=head1 AUTHORS

=over

=item * Markus Ankenbrand, markus.ankenbrand@stud-mail.uni-wuerzburg.de

=item * Thomas Hackl, thomas.hackl@uni-wuerzburg.de

=back


