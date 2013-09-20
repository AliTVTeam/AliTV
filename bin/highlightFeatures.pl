#!/usr/bin/env perl

use warnings;
use strict;
use Getopt::Long;
use Data::Dumper;
use Cwd;
$|++;

=head1 USAGE

  perl highlightFeatures.pl --query=<FILE> --reference=<FILE> --prefix=<STRING>

=cut

GetOptions(
	'query=s' => \(my $query_file),
	'reference=s' => \(my $reference_file),
	'prefix=s' => \(my $prefix),
	'n-stretch=s' => \(my $n_stretch),
	'ir' => \(my $ir),
	'wanted_ids=s' => \(my $wanted_ids)
) or pod2usage(2);

pod2usage(2) unless $query_file && $reference_file && $prefix;

my %wanted_ids = {};
if($wanted_ids){
	open (IDS, '<', $wanted_ids) or die $!;
	while(<IDS>){
		chomp;
		$wanted_ids{$_} = 1;
	}
	close IDS or die $!;
}

open (my $REF, $reference_file) or die $!;
open (my $QRY, $query_file) or die $!;
open (my $HIG, '>', $prefix.'.high') or die $!;

my $FEATURES = {};

scan_for_features($REF, 'R_');
scan_for_features($QRY, 'Q_');

do{
	local $^I = ''; # if you want a backup file;
	local @ARGV=($prefix.'.circos.conf');
	while(<>){
		if(/show = no/){ # replace this line
			print "show = yes\n";
			print "file = ".getcwd."/$prefix.high\n";
		}else{
			print;
		}
	}
};

if ($n_stretch){
	for(@{$FEATURES->{n_stretch}}){
		printf $HIG ("%s\t%d\t%d\tfill_color=%s\n", @{$_}, $n_stretch) if exists $wanted_ids{$_->[0]};
	}
}

if($ir){
	open(QRY, "<", "query_IR.high") or die "Can't open file query_IR.high\n$!";
	while(<QRY>){
		print $HIG $_ if(exists $wanted_ids{(split(/\t/, $_))[0]});
	}
	close QRY or die "$!";
	unlink "query_IR.high";
	open(REF, "<", "reference_IR.high") or die "Can't open file reference_IR.high\n$!";
	while(<REF>){
		print $HIG $_ if(exists $wanted_ids{(split(/\t/, $_))[0]});
	}
	close REF or die "$!";
	unlink "reference_IR.high";
}

close $REF or die "$!";
close $QRY or die "$!";
close $HIG or die "$!";



sub scan_for_features{
	my $fh = shift;
	my $pre= shift;
	local $/ = "\n>";  # read by FASTA record
	while(my $fr = <$fh>){
		return unless defined $fr;
		chomp($fr);
		my ($id, $desc, $seq) = $fr =~ m/
			(?:>?(\S+))			# id, >? for records
			(?:\s([^\n]+))?\n	# desc, optional
			(.+)				# seq
		/xs;					# . includes \n
		
		# n_stretches;
		while($seq =~ /(N{10,})/ig){
			push (@{$FEATURES->{n_stretch}}, [$pre.$id, pos($seq) - length($1), pos($seq)]);
		}
	};
}

=head1 AUTHORS

Thomas Hackl <thomas.hackl@lim4.de>



