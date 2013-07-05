#!/usr/bin/env perl

use warnings;
use strict;
use Getopt::Long;
use Pod::Usage;
use Data::Dumper;
$|++;

=head1 USAGE

  perl ContigOrder.pl --link-file=<FILE> --template-file=<FILE>

=cut

GetOptions(
	'link-file=s' => \(my $link_file),
	'template-file=s' => \(my $tpl_file),
) or pod2usage(2);

pod2usage(1) unless ($link_file && $tpl_file);

=head1 CODE

=cut

my %queryInfo;
my %queryLen;
my %queryReverse;
my %refOrder;
my $refCounter=0;
my %idToReference;
open(IN, '<', $link_file) or die "Can't open file $link_file\n$!";
while(<IN>){
	my ($link_id, $contig_id, $start, $end) = (split(/\s+/, $_))[0..3];
	my $set = substr($contig_id, 0, 1);
	if($set eq "Q"){
		next if(exists $queryLen{$contig_id} and $queryLen{$contig_id}>abs($start-$end));
		$queryInfo{$contig_id} = {'link_id'=>$link_id, 'start'=>$start, 'end'=>$end};
		$queryLen{$contig_id} = abs($start-$end);
	}
	else{
		$idToReference{$link_id} = {'contig_id'=>$contig_id, 'start'=>$start, 'end'=>$end};
		unless(exists $refOrder{$contig_id}){
			$refOrder{$contig_id} = $refCounter++;
		}
	}
}
close IN or die "$!";

foreach my $query (keys %queryInfo){
	my $qstart = $queryInfo{$query}{'start'};
	my $qend = $queryInfo{$query}{'end'};
	my $link_id = $queryInfo{$query}{'link_id'};
	my $rstart = $idToReference{$link_id}{'start'};
	my $rend = $idToReference{$link_id}{'end'};
	$queryReverse{$query} = 1;
	if($rstart > $rend){
		$queryReverse{$query} = 0;
		$idToReference{$link_id}{'start'} = $rend;
		$idToReference{$link_id}{'end'} = $rstart;
	}
	if($qstart > $qend){
		$queryReverse{$query} = 1-$queryReverse{$query};
	}
}

write_contigs_to_tpl();

sub write_contigs_to_tpl{
	my @chroms_rev;
	foreach my $query (keys %queryReverse){
		push(@chroms_rev, $query) if($queryReverse{$query});
	}
	my @chroms_qry; 
	foreach my $query (sort sort_by_longest_hit keys %queryInfo){
		push(@chroms_qry, $query);
	}
	my @chroms_ref;
	foreach my $ref (sort {$refOrder{$a} <=> $refOrder{$b}} keys %refOrder){
		push(@chroms_ref, $ref);
	}
	
	my $chroms = join(",", @chroms_ref, reverse @chroms_qry);
	my $reverse = join(",", @chroms_rev);

	# using a little bit of inplace edit magic :D
	do{
		local $^I = ''; # .bak if you want a backup file;
		local @ARGV=($tpl_file);
		while(<>){
			if(/^chromosomes_order/){ # replace this line
				print "chromosomes_order = $chroms\n";
			}elsif(/^chromosomes_reverse/){
				print $reverse ? "chromosomes_reverse = ".$reverse."\n" : "chromosomes_reverse = \n";
			}else{
				print;
			}
		}
	};
} 

sub sort_by_longest_hit{
	my $aRef = $idToReference{$queryInfo{$a}{'link_id'}}{'contig_id'};
	my $aRank = $refOrder{$aRef};
	my $aPos = $idToReference{$queryInfo{$a}{'link_id'}}{'start'};
	my $bRef = $idToReference{$queryInfo{$b}{'link_id'}}{'contig_id'};
	my $bRank = $refOrder{$bRef};
	my $bPos = $idToReference{$queryInfo{$b}{'link_id'}}{'start'};
	my $rank_comp = $aRank <=> $bRank;
	return $rank_comp if($rank_comp);
	return ($aPos <=> $bPos);
}
