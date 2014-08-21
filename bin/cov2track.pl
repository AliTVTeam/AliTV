use strict;
use warnings;
use List::Util qw(sum);
use Statistics::Basic qw(:all);

# USAGE: perl cov2track.pl <coverage-file> <window-size> <prefix>

open(IN, "<$ARGV[0]") or die "Can't open file $ARGV[0]\n$!";
OUTER: while(<IN>){
    chomp;
    my ($id, $start, $cov) = split(/\t/);
    my $end = $start;
    my @cov = ();
    push(@cov, $cov);
    for(my $i=1; $i<$ARGV[1]; $i++){
	my ($nid, $nstart, $ncov) = split(/\t/, <IN>);
	unless($nid){
	    exit 0;
	}
	if($nid ne $id){
	    next OUTER;
	}
	push(@cov, $ncov);
	$end = $nstart;
    }
    $id =~ s/\|/_/g;
    # my $mean = sum(@cov)/@cov;
    my $median = median(@cov);
    print "$ARGV[2]$id $start $end $median\n";
}
close IN or die "$!";
