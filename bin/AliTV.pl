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

  $ perl AliTV.pl --fasta human=>human.fa,mouse=>mouse.fa

=head1 OPTIONS

=over 25

=item --fasta <GENOME>=><FASTA>[,<GENOME>=><FASTA>...]

A comma separated list of genome, fasta pairs. Each genome is separated from its fasta file path by =>

=cut

$options{'fasta|f=s'} = \( my $opt_fasta );

=item [--aligner <TOOL>]

Name of the tool to use for the alignment. Possible values are: lastz (default)

=cut

$options{'aligner=s'} = \( my $opt_aligner="lastz" );

=back


=head1 CODE

=cut

GetOptions(%options) or pod2usage(1);

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

