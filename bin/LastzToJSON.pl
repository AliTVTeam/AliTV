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

##### 
### @author Markus Ankenbrand
### @date 14.03.2012
### @version 1
### This script parses the general-output file provided by LASTZ 
### into a karyotype and a link file
### Also a circos config file derived from a template is generated
#####


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
    # The input file has to contains the alignments made by dnadiff in columns 
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
make_path("$out.d3/js", "$out.d3/data", "$out.d3/css");
cp("$FindBin::RealBin/../d3_test/js/d3.v3.min.js","$out.d3/js/") or die "Copy failed: $!";
cp("$FindBin::RealBin/../d3_test/js/jquery.min.js","$out.d3/js/") or die "Copy failed: $!";
cp("$FindBin::RealBin/../d3_test/js/jquery-ui.min.js","$out.d3/js/") or die "Copy failed: $!";
cp("$FindBin::RealBin/../d3_test/js/wgaPipeline_linear.js","$out.d3/js/") or die "Copy failed: $!";
cp("$FindBin::RealBin/../d3_test/js/wgaPipeline_circular.js","$out.d3/js/") or die "Copy failed: $!";
cp("$FindBin::RealBin/../d3_test/css/jquery-ui.min.css","$out.d3/css/") or die "Copy failed: $!";
cp("$FindBin::RealBin/../d3_test/d3.html","$out.d3/") or die "Copy failed: $!";
open(LINK, '>', "$out.d3/data/link.json") or die "$!";
print LINK encode_json \@links;
close LINK or die "$!";

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
open(KARYO,'>',"$out.d3/data/karyo.json") or die "$!";
print KARYO encode_json \%karyo;
close KARYO or die "$!";


__END__

=pod

=head1 NAME

    LastzCircosParser

=head1 USAGE

    perl LastzCircosParser.pl [Options] --in INPUTFILE --out OUTPUTFILE

=head1 DESCRIPTION

    This script parses the general-output file provided by LASTZ into a karyotype and a link file, for visualization with circos. Also a circos config file, derived from a template, is generated. See the --in parameter description for restrictions for the general-output file.


=head1 REQUIRED ARGUMENTS

=over 8

=item B<--in>

    The path to the general-output file provided by lastz.
    The general-output file has to have the fields [TAGR][S1][E1][SIZE1][TAGQ][S2][E2][STRAND][SIZE2][IDY_FRACT][IDY%][SCORE][LENQ]... with arbitrary additional fields at the end. 
    Call lastz with the option --format=general:name1,zstart1,end1,size1,name2,zstart2+,end2+,strand2,size2,identity,score,length2

=item B<--out>
    
    The prefix for the desired output .karyo and .link files for circos (txt format)

=back

=head1 OPTIONS

=over 8

=item B<--help>
    
    Show this help screen

=item B<--man>
    
    Show a detailed documentation

=item B<--self>
    
    Flag to indicate that reference and query are the same genome.
    
=item B<--minlen MIN>
    
    Only alignments with a minimum length of MIN bp are included. Default=100bp

=item B<--minidy MIN>
    
    Only alignments with a minimum identity of MIN % are included. Default=50
    
=item B<--step STEP>
    
    The color scheme goes in ten steps from dark green (100% identity) to dark red (100%-10*STEP% identity). So STEP specifies the resolution of the color scheme)

=item B<--template>
    
    Use another than the default template to generate the circos.conf file. 
    Default is "circos_template_full.conf" in the same directory as the script. 
    CAUTION: The config file has to follow some conventions. See the default file and its comments.

=back

=head1 BUGS AND LIMITATIONS

    The general-output file from LASTZ has some restrictions, see the --in paramteter description for details.
    If you encounter a bug, please drop me a line markus.ankenbrand@stud-mail.uni-wuerzburg.de

=head1 AUTHOR

    Markus Ankenbrand

=head1 DISCLAIMER OF WARRANTY

    This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY

=cut
