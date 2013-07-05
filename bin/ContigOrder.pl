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

my $SETS;
my @LINKS;
my @CONTIGS;
my $REF;
my $QRY;


parse_links();						# read the link file
choose_reference();					# fewer contigs
reorder_links_by_weight();
group_query_by_primary_target();	
sort_group_query_contigs();
write_contigs_to_tpl();

#n_stretches();

sub reorder_links_by_weight{
	
	$REF->{links} = [sort {$b->{length} <=> $a->{length}}@{$REF->{links}}];
	
	open(LINKS, '>', $link_file) or die $!;
	print LINKS map{ $_->{string}.$_->{target}{string} }@{$REF->{links}};
	close LINKS;
}

sub write_contigs_to_tpl{
	my @chroms_rev = keys %{$QRY->{groups_hash}};
	my @chroms_qry; 
	foreach my $rev_id (@chroms_rev){
		push (@chroms_qry, map{ $_->{id} }@{$QRY->{groups_hash}{$rev_id}});
	}
	
	my $chroms = join(",", reverse @chroms_rev).",".join(",", @chroms_qry);

	my @reverse = ((map{$_->{id}}@{$REF->{contigs}}), (map{$_->{id}}grep{$_->{reverse} < 0}@{$QRY->{contigs}}));
	

	# using a little bit of inplace edit magic :D
	do{
		local $^I = ''; # .bak if you want a backup file;
		local @ARGV=($tpl_file);
		while(<>){
			if(/^chromosomes_order/){ # replace this line
				print "chromosomes_order = $chroms\n";
			}elsif(/^chromosomes_reverse/){
				print @reverse ? "chromosomes_reverse = ".join(",", @reverse)."\n" : "chromosomes_reverse = \n";
			}else{
				print;
			}
		}
	};
	
}  

sub parse_links{
	
	my %tmp_links;
	
	open (LF, '<', $link_file) or die $!;
	
	# read links
	while(<LF>){
		
		my ($link_id, $contig_id, $start, $end) = (split(/\s+/, $_))[0..3];
		my $set = substr($contig_id, 0, 1);
		my $link = {
			link	=> $link_id,
			id		=> substr($contig_id, 0, 2).$link_id,
			center	=> ($start+$end)/2,
			start	=> $start,
			end		=> $end,
			length	=> abs($start-$end),
			reverse	=> $end > $start ? 1 : -1,
			set		=> $set,
			contig	=> $contig_id,
			target	=> undef,
			string	=> $_
		};
		push @LINKS, $link;

		# add link to sets
		push (@{$SETS->{$set}{links}}, $link);

		# connect links
		if( exists($tmp_links{$link_id}) ){
			$tmp_links{$link_id}->{target} = $link; $link->{target} = $tmp_links{$link_id}
		}else{
			$tmp_links{$link_id} = $link;
		}

		# create contig or add link to contig
		if( exists($SETS->{$set}{contigs_hash}{$contig_id}) ){
			push (@{$SETS->{$set}{contigs_hash}{$contig_id}{links}}, $link);
			$SETS->{$set}{contigs_hash}{$contig_id}{reverse} += ($link->{reverse} * $link->{length});
		}else{
			my $contig = {
				id		=> $contig_id,
				set		=> $set,
				group	=> undef,
				primary_target => undef,
				links	=> [$link]
			};
			
			$SETS->{$set}{contigs_hash}{$contig_id} = $contig;
			push @CONTIGS, $contig;
			
		}
	}
	
	foreach my $set (values %$SETS){
		$set->{contigs} = [values %{$set->{contigs_hash}}];
	}
	
	close LF;

}

sub choose_reference{
		
	if( @{$SETS->{Q}{contigs}} < @{$SETS->{R}{contigs}} ){
		$REF = $SETS->{Q}; 
		$QRY = $SETS->{R}; 
	}else{
		$REF = $SETS->{R};
		$QRY = $SETS->{Q};  
	} 
}

sub group_query_by_primary_target{
	foreach my $contig ( @{$QRY->{contigs}} ){
		my %targets;
		foreach my $link ( @{$contig->{links}} ){
			$targets{ $link->{target}->{contig} } += $link->{length};
			$contig->{reverse} += $link->{reverse} == $link->{target}{reverse} ? $link->{length} : -$link->{length};
		}
		my @targets = sort { $targets{$b} <=> $targets{$a} } keys %targets; 
		$contig->{primary_target} = $targets[0];
		$contig->{minor_targets} = @targets[1..$#targets];

		# create group or add contig to group
		push (@{$QRY->{groups_hash}{$targets[0]}}, $contig);
	}
}

sub sort_group_query_contigs{
	while (my ($group_id, $group) = each %{$QRY->{groups_hash}} ){
		$QRY->{groups_hash}{$group_id} = [sort by_minimized_crosslink_weights @$group];
	}
}

sub by_minimized_crosslink_weights{
	my $order = 0;
	#print Dumper($ref);
	#my $main_target = $qrys->{$a}
	
	foreach my $la (@{$a->{links}}){
		foreach my $lb (@{$b->{links}}){
			$order+= ($la->{target}{center} <=> $lb->{target}{center}) * abs($la->{length} - $lb->{length});
		}
	}
	
	my $re = $order > 0 ? 1 : $order < 0 ? -1 : 0;
	#print $re,"\n";
	return $re;
	
}
