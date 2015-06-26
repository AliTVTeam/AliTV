#!/usr/bin/perl
use strict;
use warnings;
use Getopt::Long;
use Pod::Usage;
use Log::Log4perl qw(:no_extra_logdie_message);

my %options;

=head1 NAME

AliTV.pl

=head1 DESCRIPTION

Wrapper to produce whole genome alignments and visualizations.

=head1 USAGE

  $ perl AliTV.pl --fasta human=>human.fa --fasta mouse=>mouse.fa [options]

=head1 OPTIONS

=over 25

=item --fasta <GENOME>=<FASTA> [--fasta <GENOME>=><FASTA> ..]

Multiple pairs of genome and fasta file paths

=cut

$options{'fasta|f=s%'} = \( my $opt_fasta );

=item [--annotation <GENOME>=<TYPE>,<BED>[,<TYPE>,<BED>..] [--annotation <GENOME>=<TYPE>,<BED>[,..]..]

Multiple genome, annotation pairs. 
Each annotation consists of a comma separated list of alterating annotation type and path to the according bed file.
Only GENOMEs present in --fasta option are allowed.

=cut

$options{'annotation=s%'} = \( my $opt_annotation );

=item [--aligner <TOOL>]

Name of the tool to use for the alignment. Possible values are: lastz (default)

=cut

$options{'aligner=s'} = \( my $opt_aligner="lastz" );

=item [--tree <FILE>]

Path to a tree file in newick format. 
Leaves must correspond to the GENOMEs in --fasta option.

=cut

$options{'tree=s'} = \( my $opt_tree );

=item [--output <TYPE>[,<TYPE>] or --output <TYPE> --output <TYPE>]

Type of the desired output (comma separated list). 
Possible values are: files, json (default)

=cut

$options{'output=s@'} = \( my $opt_output=["json"] );

=item [--[no]force]

Force execution over problems such as non unique IDs (default: noforce).

=cut

$options{'force!'} = \( my $opt_force=0 );

=item [--prefix <STRING>]

prefix for the generated output files (default: alitv)

=cut

$options{'prefix=s'} = \( my $opt_prefix="alitv" );

=item [--help] 

show help

=cut

$options{'help|?'} = \( my $opt_help );

=back


=head1 CODE

=cut

GetOptions(%options) or pod2usage(1);
$opt_output = [split(",",join(",", @{$opt_output}))];
pod2usage(1) if ($opt_help);

# init a root logger in exec mode
Log::Log4perl->init(
	\q(
                log4perl.rootLogger                     = DEBUG, Screen
                log4perl.appender.Screen                = Log::Log4perl::Appender::Screen
                log4perl.appender.Screen.stderr         = 1
                log4perl.appender.Screen.layout         = PatternLayout
                log4perl.appender.Screen.layout.ConversionPattern = [%d{MM-dd HH:mm:ss}] [%C] %m%n
        )
);

my $L = Log::Log4perl::get_logger();


=head1 AUTHORS

=over

=item * Markus Ankenbrand, markus.ankenbrand@uni-wuerzburg.de

=back

