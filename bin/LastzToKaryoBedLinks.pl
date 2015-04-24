#!/usr/bin/perl
use strict;
use warnings;
use Getopt::Long;
use Pod::Usage;
use FindBin;
use POSIX; # for rounding
use JSON;
use File::Copy qw(cp);
use File::Path qw(make_path);
use Data::Dumper;


# path to the input general-output file (provided by LASTZ)
# and prefix for the output .karyo and .link files (in txt format)
my ($in,$out,$help,$man) = ('','',0,0);
# get the options from the command line
GetOptions('in=s'=>\$in,
	   'out=s'=>\$out,
	   'self'=>\(my $opt_self),
           'help|?'=>\$help,
           'man'=>\$man);
pod2usage(-verbose => 99, -sections => "NAME|USAGE|DESCRIPTION|REQUIRED ARGUMENTS|OPTIONS") if($help);
pod2usage(-verbose => 2) if($man);
pod2usage("Missing inputfile or output prefix") unless ($in and $out);

# Hashs and arrays to store the reference and query names and length in the order of appearence
my %references;
my %referenceIDs;
my @referenceOrder;
my %queries;
my %queryIDs;
my @queryOrder;
my $linkCounter=0;
my @colors = ('vdred','dred','red','lred','yellow','vlred','vlgreen','lgreen','green','dgreen','vdgreen');
my $opt_transparency = 1;
my $template = 1;

my %karyo;
my @links;
open(IN,'<',$in) or die "$!";
while(<IN>){
	# skip header line
	next if(/^#/);
    # The input file has to contain the alignments made by lastz in columns 
    # [TAGR][S1][E1][SIZE1][TAGQ][S2][E2][STRAND][SIZE2][IDY_FRACT][IDY%][SCORE][LEN_AL]
    my ($tagr,$s1,$e1,$lenr,$tagq,$s2,$e2,$strand,$lenq,$idy,$lenal) = (0,1,2,3,4,5,6,7,8,10,12);
    my @items = split(/\s/,$_);
    $items[$idy] =~ s/%//;

    ($s2, $e2) = ($e2, $s2) if ($items[$strand] =~ /-/);
    # new  Referenz (hash entry still undef = false)
    unless($references{$items[$tagr]}){
		$references{$items[$tagr]} = {"length" => $items[$lenr]+0, "genome_id" => 0};
		push(@referenceOrder, $items[$tagr]);
		$referenceIDs{$items[$tagr]} = "R_$items[$tagr]";
    }
    # new Query (hash entry still undef = false)
    unless($queries{$items[$tagq]}){
		$queries{$items[$tagq]} = {"length" => $items[$lenq]+0, "genome_id" => 1};
		push(@queryOrder, $items[$tagq]);
		my $prefix = "R_";
		$prefix = "Q_" unless ($opt_self);
		$queryIDs{$items[$tagq]} = "$prefix$items[$tagq]";
    }
    # write entrys in link file
push(@links, {source => {name => $referenceIDs{$items[$tagr]}, start =>$items[$s1]+0, end =>$items[$e1]+0}, target => {name => $queryIDs{$items[$tagq]}, start => $items[$s2]+0, end =>$items[$e2]+0}, identity => $items[$idy]+0});
}
close IN or die "$!";
open(LINK, '>', "$out.links.tsv") or die "$!";
print LINK "#fida\tfidb\tidentity\n";
open(BED, '>', "$out.bed") or die "$!";
my $feature_counter = 0;
foreach my $link (@links){
	print BED "$link->{source}{name}\t$link->{source}{start}\t$link->{source}{end}\ta_$feature_counter\n";
	print BED "$link->{target}{name}\t$link->{target}{start}\t$link->{target}{end}\tb_$feature_counter\n";
	print LINK "a_$feature_counter\tb_$feature_counter\t$link->{identity}\n";
	$feature_counter++;
}
close LINK or die "$!";
close BED or die "$!";

# The karyotype file contains the information for each sequence in columns
# chr - ID LABEL START END COLOR
for(my $i = 0; $i < @referenceOrder; $i++){
    my $ref = $referenceOrder[$i];
    $karyo{$referenceIDs{$ref}} = $references{$ref};
}
unless($opt_self){
	for(my $i = 0; $i < @queryOrder; $i++){
	    my $que = $queryOrder[$i];
	    $karyo{$queryIDs{$que}} = $queries{$que};
	}
}
open(KARYO,'>',"$out.karyo.tsv") or die "$!";
foreach my $k (keys %karyo){
	print KARYO "$k\t$karyo{$k}{genome_id}\t$karyo{$k}{length}\n";
}
close KARYO or die "$!";
