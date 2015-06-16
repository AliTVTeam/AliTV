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

Generates a data.json and a filters.json file for use with the AliTV - d3.js component.

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

Path to the input link file. Simple tsv file with header line.
Mandatory columns are fida and fidb, all other columns are (named) link properties.
The header starts with a hashtag (#). 
If no header is present "#fida	type	fidb" is assumed, therefore supporting .sif format.
Example:
#fida <tab> fidb <tab> identity
feature_id_a <tab> feature_id_b <tab> 90

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

my ($karyo, $karyo_filters) = parse_karyo($opt_karyo);

my $features = {};
my $links = [];
if($opt_bed){	
	$features = parse_bed($opt_bed, $karyo);
	if($opt_link){
		$links = parse_links($opt_link, $features);
	}
}
open(OUT, '>', "$opt_prefix.d3/data/data.json") or $L->logdie("Can not open file $opt_prefix.d3/data/data.json\n$!");
print OUT encode_json {'karyo' => $karyo, 'features' => $features, 'links' => $links};
close OUT or die "$!";
open(OUT, '>', "$opt_prefix.d3/data/filters.json") or $L->logdie("Can not open file $opt_prefix.d3/data/filters.json\n$!");
print OUT encode_json $karyo_filters;
close OUT or die "$!";

=head2 create_dir_structure

Create directory structure with js, css and html files to provide the framework in which the .json files are read and displayed

=cut

sub create_dir_structure{

        # the following list contains all directories which have to be created inside the destination folder
        my @dirlist = map { $opt_prefix.".d3/".$_ } qw(
                             lib
                             data
                             js
                             css
                        );

	# the following list contains all files which have to be copied into the destination folder
	my @files2copy = qw(
                             lib/d3.v3.min.js
                             lib/jquery.min.js
                             lib/jquery-ui.min.js
                             lib/jquery-ui.min.css
                             lib/jquery-ui-1.9.2.custom.min.css
                             lib/bootstrap.min.css
                             lib/bootstrap.min.js
                             lib/colorpicker
                             lib/textures.min.js

                             js/AliTV.js
                             
                             css/AliTV.css

                             AliTV.html
                            );

	make_path(@dirlist, {error => \my $err});
	if (@$err)
	{
	    for my $diag (@$err) {
		my ($file, $message) = %$diag;
		if ($file eq '') {
		    $L->logdie("Creating folder failed with general error: $message");
		}
		else {
		    $L->logdie("Creating folder failed for folder '$file': $message");
		}
	    }
	}

	foreach my $file (@files2copy)
	{
	    cp("$FindBin::RealBin/../d3/".$file,$opt_prefix.".d3/".$file) or $L->logdie("Copy failed for file '$file': $!");
	}
}


=head2 parse_karyo

Sub to parse the karyo file. Input: filename
Output: \%karyo of the form {chromosomes => {$id => {genome_id => $genome_id, length => $length, seq => $seq}}} 
    and \%filters of the form {genome_order => \@genome_order_array, order => \@order_array, {chromosomes => {$id => {reverse => $reverse, visible => $visible}}}}

=cut

sub parse_karyo{
	my $file = $_[0];
	my %karyo = ('chromosomes' => {});
	my %filters = ('karyo' => {'chromosomes' => {}, 'order' => [], 'genome_order' => []}, 
		       'links' => {'minLinkIdentity' => 70, 'maxLinkIdentity' => 100, 'minLinkLength' => 0, 'maxLinkLength' => 1000000},
		       'onlyShowAdjacentLinks' => JSON::true,
		       'showAllChromosomes' => JSON::false,
		       'skipChromosomesWithoutLinks' => JSON::false,
		       'skipChromosomesWithoutVisibleLinks' => JSON::false,
);
	my %genome_ids = ();
	open(IN, '<', $file) or $L->logdie("Can not open file $file\n$!");
	while(<IN>){
		chomp;
		my($id, $gid, $len, $seq) = split(/\t/);
		$karyo{'chromosomes'}{$id} = {"genome_id" => $gid+0, "length" => $len+0, "seq" => $seq};
		$filters{'karyo'}{'chromosomes'}{$id} = {'reverse' => JSON::false, 'visible' => JSON::true};
		push(@{$filters{'karyo'}{'order'}}, $id);
		$genome_ids{$gid+0} = 1;
	}
	$filters{'karyo'}{'genome_order'} = [sort {$a <=> $b} map {$_+0} keys %genome_ids];
	close IN or $L->logdie("Can not close file $file\n$!");
	return (\%karyo, \%filters);
	print Dumper(\%karyo);
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
	my $features = $_[2];
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
	$L->warn("There is no feature id $fida in the bed file (but used in link file)") unless(exists $features->{$fida});
	$properties{'source'} = $fida;
	$L->warn("There is no feature id $fidb in the bed file (but used in link file)") unless(exists $features->{$fidb});
	$properties{'target'} = $fidb;
	return \%properties;
}

=head1 LIMITATIONS

If you encounter a bug, feel free to contact Markus Ankenbrand

=head1 AUTHORS

=over

=item * Markus Ankenbrand, markus.ankenbrand@uni-wuerzburg.de

=back
