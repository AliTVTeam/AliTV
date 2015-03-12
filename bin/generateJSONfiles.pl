#!/usr/bin/perl
use strict;
use warnings;
use FindBin;
use lib "$FindBin::RealBin/lib";
use Data::Dumper;
$Data::Dumper::Sortkeys = 1;
use Getopt::Long;
use Pod::Usage;
use Log::Log4perl qw(:no_extra_logdie_message);
use POSIX; # for rounding
use JSON;
use File::Copy qw(cp);
use File::Path qw(make_path);
use Scalar::Util qw(looks_like_number);


my %options = ();

=head1 NAME 

generateJSONfiles.pl

=head1 DESCRIPTION

Generates a karyo.json and a link.json file for use with the wgaPipeline - d3.js component.

=head1 USAGE

  $ perl generateJSONfiles.pl --karyo=<file> [--bed=<file> --link=<file> --prefix<string>] [options]

=cut

=head1 OPTIONS

=over 25

=item --karyo=<file>

Path to the input karyo file. Simple tab delimited file with lines like that:
ID <tab> genomeID <tab> length[ <tab> sequence]
The fourth column (sequence) is optional.

=cut

$options{'karyo=s'} = \( my $opt_karyo );

=item --bed=<file>

Path to the input bed file. This contains features with unique IDs in the fourth column.
In contrast to the BED specification this column is required.

=cut

$options{'bed=s'} = \( my $opt_bed );

=item --link=<file>

Path to the input link file. Simple tab delimited file with lines like that:
feature_id <tab> feature_id[ <tab> additional information]
The additional information is optional.

=cut

$options{'link=s'} = \( my $opt_link );

=item --prefix=<string>

prefix for the generated output files

=cut

$options{'prefix=s'} = \( my $opt_prefix = "" );

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

=head1 CODE

=cut

GetOptions(%options) or pod2usage(1);

pod2usage(1) if($opt_help);
pod2usage(-verbose => 99, -sections => "NAME|DESCRIPTION|USAGE|OPTIONS|LIMITATIONS|AUTHORS") if($opt_man);
pod2usage("Missing inputfile or output prefix") unless ($opt_karyo and $opt_prefix);

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

create_dir_structure();

my $karyo = parse_karyo($opt_karyo);
open(OUT, '>', "$opt_prefix.d3/data/karyo.json") or $L->logdie("Can not open file $opt_prefix.d3/data/karyo.json\n$!");
print OUT encode_json $karyo;
close OUT or die "$!";

if($opt_bed){	
	my $features = parse_bed($opt_bed, $karyo);
	open(OUT, '>', "$opt_prefix.d3/data/features.json") or $L->logdie("Can not open file $opt_prefix.d3/data/features.json\n$!");
	print OUT encode_json $features;
	close OUT or die "$!";
	if($opt_link){
		my $links = parse_links($opt_link, $features);
		open(OUT, '>', "$opt_prefix.d3/data/link.json") or $L->logdie("Can not open file $opt_prefix.d3/data/links.json\n$!");
		print OUT encode_json $links;
		close OUT or die "$!";
	}
}

=head2 create_dir_structure

Create directory structure with js, css and html files to provide the framework in which the .json files are read and displayed

=cut

sub create_dir_structure{
	make_path("$opt_prefix.d3/js", "$opt_prefix.d3/data", "$opt_prefix.d3/css");
	cp("$FindBin::RealBin/../d3_test/js/d3.v3.min.js","$opt_prefix.d3/js/") or $L->logdie("Copy failed: $!");
	cp("$FindBin::RealBin/../d3_test/js/jquery.min.js","$opt_prefix.d3/js/") or $L->logdie("Copy failed: $!");
	cp("$FindBin::RealBin/../d3_test/js/jquery-ui.min.js","$opt_prefix.d3/js/") or $L->logdie("Copy failed: $!");
	cp("$FindBin::RealBin/../d3_test/js/wgaPipeline_linear.js","$opt_prefix.d3/js/") or $L->logdie("Copy failed: $!");
	cp("$FindBin::RealBin/../d3_test/js/wgaPipeline_circular.js","$opt_prefix.d3/js/") or $L->logdie("Copy failed: $!");
	cp("$FindBin::RealBin/../d3_test/css/jquery-ui.min.css","$opt_prefix.d3/css/") or $L->logdie("Copy failed: $!");
	cp("$FindBin::RealBin/../d3_test/d3.html","$opt_prefix.d3/") or $L->logdie("Copy failed: $!");
	cp("$FindBin::RealBin/../d3_test/d3_linear.html","$opt_prefix.d3/") or $L->logdie("Copy failed: $!");
}


=head2 parse_karyo

Sub to parse the karyo file. Input: filename
Output: \%karyo of the form {$id => {length => $length, seq => $seq}}

=cut

sub parse_karyo{
	my $file = $_[0];
	my %karyo = ('chromosomes' => {}, 'order' => []);
	open(IN, '<', $file) or $L->logdie("Can not open file $file\n$!");
	while(<IN>){
		chomp;
		my($id, $gid, $len, $seq) = split(/\t/);
		$karyo{'chromosomes'}{$id} = {"genome_id" => $gid+0, "length" => $len+0, "seq" => $seq, 'rc' => JSON::false};
		push(@{$karyo{'order'}}, $id);
	}
	close IN or $L->logdie("Can not close file $file\n$!");
	return \%karyo;
}

=head2 parse_bed

Sub to parse the bed file. Input: filename
Output: \%features of the form {$fid => {karyo => $karyo, start => $start, end => $end}}

=cut

sub parse_bed{
	my $file = $_[0];
	my $karyo = $_[1];
	my %features = ();
	open(IN, '<', $file) or $L->logdie("Can not open file $file\n$!");
	while(<IN>){
		chomp;
		my($id, $start, $end, $fid) = split(/\t/);
		$L->warn("The sequence id $id used in the bed file is not defined in the karyo file.") unless(exists $karyo->{'chromosomes'}{$id});
		$features{$fid} = {"karyo" => $id, "start" => $start+0, "end" => $end+0}
	}
	close IN or $L->logdie("Can not close file $file\n$!");
	return \%features;
}


=head2 parse_link

Sub to parse the link file. Input: filename
Output: \@links of the form [{source => $source, target => $target, identity => $identity}]

=cut

sub parse_links{
	my $file = $_[0];
	my $features = $_[1];
	my @links = ();
	open(IN, '<', $file) or $L->logdie("Can not open file $file\n$!");
	my $line = <IN>;
	my @header = ('fida', 'type', 'fidb');
	if($line =~ /^#/){
		chomp $line;
		$line = substr($line, 1);
		@header = split(/\t/, $line);
		my $fidapresent = 0;
		my $fidbpresent = 0;
		foreach my $elem (@header){
			$fidapresent = 1 if($elem eq 'fida');
			$fidbpresent = 1 if($elem eq 'fidb');
		}
		$L->logdie("Link header is present but does not contain fida column (fida and fidb column are mandatory)") unless($fidapresent);
		$L->logdie("Link header is present but does not contain fidb column (fida and fidb column are mandatory)") unless($fidbpresent);
	} else {
		push(@links, parse_link_line($line, \@header, $features));
	}
	while(<IN>){
		push(@links, parse_link_line($_, \@header, $features));
	}
	close IN or $L->logdie("Can not close file $file\n$!");
	return \@links;
}

sub parse_link_line{
	my $line = $_[0];
	my @header = @{$_[1]};
	my %features = %{$_[2]};
	chomp($line);
	my @elements = split(/\t/, $line);
	my ($fida, $fidb);
	my %properties;
	for(my $i=0; $i<@header; $i++){
		if($header[$i] eq 'fida'){
			$fida = $elements[$i];
		} elsif ($header[$i] eq 'fidb') {
			$fidb = $elements[$i];
		} else {
			$elements[$i]+=0 if(looks_like_number($elements[$i]));
			$properties{$header[$i]} = $elements[$i];
		}
	}
	$L->warn("There is no feature id $fida in the bed file (but used in link file)") unless(exists $features{$fida});
	$properties{'source'} = {'name' => $features{$fida}{karyo}, 'start' => $features{$fida}{start}, 'end' =>$features{$fida}{end}};
	$L->warn("There is no feature id $fidb in the bed file (but used in link file)") unless(exists $features{$fidb});
	$properties{'target'} = {'name' => $features{$fidb}{karyo}, 'start' => $features{$fidb}{start}, 'end' =>$features{$fidb}{end}};
	return \%properties;
}

=head1 LIMITATIONS

If you encounter a bug, feel free to contact Markus Ankenbrand

=head1 AUTHORS

=over

=item * Markus Ankenbrand, markus.ankenbrand@uni-wuerzburg.de

=back