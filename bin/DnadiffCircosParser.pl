#!/usr/bin/perl
use strict;
use warnings;
use Getopt::Long;
use Pod::Usage;
use FindBin;
use POSIX; # for rounding

##### 
### @author Markus Ankenbrand
### @date 15.03.2012
### @version 2
### This script parses the .[1m]coords file provided by dnadiff (MUMmer) 
### into a karyotype and a link file and the .[qr]diff files into a .high file,
### for visualization with circos. 
### Also a circos config file derived from a template is generated
#####


# path to the input .[1m]coords files (provided by dnadiff)
# and prefix for the output .karyo and .link files (in txt format)
my ($in,$out,$one,$promer,$help,$man) = ('','',0,0,0,0);
my $template = "$FindBin::Bin/circos_template_full.conf";
# get the options from the command line
GetOptions('in=s'=>\$in,
	   'out=s'=>\$out,
	   'self'=>\(my $opt_self),
	   'one'=>\$one,
	   'promer'=>\$promer,
	   'template=s'=>\$template,
	   'minlen=i'=>\(my $minlen=100),
	   'step=i'=>\(my $step=5),
	   'minidy=i'=>\(my $minidy=50),
	   'transparency=i'=>\(my $opt_transparency=1),
           'help|?'=>\$help,
           'man'=>\$man);
pod2usage(-verbose => 99, -sections => "NAME|USAGE|DESCRIPTION|REQUIRED ARGUMENTS|OPTIONS") if($help);
pod2usage(-verbose => 2) if($man);
pod2usage("Missing input or output prefix") unless ($in and $out);

# Hashs and arrays to store the reference and query names and length in the order of appearence
my %references;
my %referenceIDs;
my @referenceOrder;
my %queries;
my %queryIDs;
my @queryOrder;
my $linkCounter=0;
my @colors = ('vdred','dred','red','lred','yellow','vlred','vlgreen','lgreen','green','dgreen','vdgreen');

my $coordsfile = "$in.mcoords";
$coordsfile = "$in.1coords" if ($one);
open(IN,'<',$coordsfile) or die "$!";
open(LINK,'>',"$out.link") or die "$!";
while(<IN>){
    # The karyotype file contains the alignments made by dnadiff in columns 
    # default (dnadiff/nucmer)   
    # [S1][E1][S2][E2][LEN1][LEN2][%IDY][LENR][LENQ][COVR][COVQ][TAGR][TAGQ] 
    my ($s1,$e1,$s2,$e2,$idy,$lenr,$lenq,$tagr,$tagq,$lenal) = (0,1,2,3,6,7,8,11,12,4);
    # promer -c -r -T -l -H                                             
    # [S1][E1][S2][E2][LEN1][LEN2][%IDY][%SIM][%STP][LENR][LENQ][COVR][COVQ][FRMR][FRMQ][TAGR][TAGQ]
    ($s1,$e1,$s2,$e2,$idy,$lenr,$lenq,$tagr,$tagq,$lenal) = (0,1,2,3,6,9,10,15,16,4) if ($promer);
	my $sim = 7;
	
    my @items = split(/\s/,$_);
    next if($items[$lenal] < $minlen || $items[$idy] < $minidy);
    # new  Referenz (hash entry still undef = false)
    unless($references{$items[$tagr]}){
	$references{$items[$tagr]} = $items[$lenr];
	push(@referenceOrder, $items[$tagr]);
	$referenceIDs{$items[$tagr]} = "R_$items[$tagr]";
    }
    # new Query (hash entry still undef = false)
    unless($queries{$items[$tagq]}){
	$queries{$items[$tagq]} = $items[$lenq];
	push(@queryOrder, $items[$tagq]);
	my $prefix = "R_";
	$prefix = "Q_" unless ($opt_self);
	$queryIDs{$items[$tagq]} = "$prefix$items[$tagq]";
    }
    # calculate color from identity or similarity
    my $colorIndex = floor($items[$idy]/$step)-(100/$step-10);
    $colorIndex = floor($items[$sim]/$step)-(100/$step-10) if ($promer);
    $colorIndex = 0 if($colorIndex < 0);
    my $color = $colors[$colorIndex];
    $color .= "_a$opt_transparency" if($opt_transparency);
    # write entrys in link file
    print LINK "link$linkCounter $referenceIDs{$items[$tagr]} $items[$s1] $items[$e1] color=$color\n";
    print LINK "link$linkCounter $queryIDs{$items[$tagq]} $items[$s2] $items[$e2] color=$color\n";
    $linkCounter++;
}
close LINK or die "$!";
close IN or die "$!";

open(KARYO,'>',"$out.karyo") or die "$!";
open(WANTED,'>',"$out.wanted_ids") or die "$!";
# The karyotype file contains the information for each sequence in columns
# chr - ID LABEL START END COLOR
print KARYO "#REFERENCE SEQUENCES\n";
for(my $i = 0; $i < @referenceOrder; $i++){
    my $ref = $referenceOrder[$i];
    print KARYO "chr - $referenceIDs{$ref} $ref 0 $references{$ref} red\n";
    print WANTED "$referenceIDs{$ref}\n";
}
print KARYO "\n#QUERY SEQUENCES\n";
for(my $i = 0; $i < @queryOrder; $i++){
    my $que = $queryOrder[$i];
    print KARYO "chr - $queryIDs{$que} $que 0 $queries{$que} blue\n";
    print WANTED "$queryIDs{$que}\n";
}
close KARYO or die "$!";
close WANTED or die "$!";

# write circos.config file
open(IN,"<",$template) or die "$!";
open(CONF,">","$out.circos.conf") or die "$!";
while(<IN>){
    # Set the apropriate karyotype, link and highlight files
    if(/^karyotype/){
	my $filepath = File::Spec->rel2abs("$out.karyo");
	print CONF "karyotype = $filepath\n";
    }
    elsif(/^linkfile/){
	my $filepath = File::Spec->rel2abs("$out.link");
	print CONF "file = $filepath\n";
    }
    elsif(/^highlightfile/){
	# my $filepath = File::Spec->rel2abs("$out.high");
	# print CONF "file = $filepath\n";
    	print CONF "show = no\n";
    }
    # reverse the reference chromosomes and their order to avoid unnecessarily crossing lines
    elsif(/^chromosomes_reverse/){
	my $reverse="$referenceIDs{$referenceOrder[0]}";
	for (my $i = 1; $i<@referenceOrder; $i++){
	    $reverse .= ";$referenceIDs{$referenceOrder[$i]}";
	}
	print CONF "chromosomes_reverse = $reverse\n";
    }
    elsif(/^chromosomes_order/){
	my $order = "^";
	for (my $i = $#referenceOrder; $i>=0; $i--){
	    $order .= ",$referenceIDs{$referenceOrder[$i]}";
	}
	print CONF "chromosomes_order = $order\n";
    }
    else{
	print CONF $_;
    }
}
close IN or die "$!";
close CONF or die "$!";

__END__

=pod

=head1 NAME

    DnadiffCircosParser

=head1 USAGE

    perl DnadiffCircosParser.pl [Options] --in INPUTFILE --out OUTPUTFILE

=head1 DESCRIPTION

    This script parses the .[1m]coords file provided by dnadiff (MUMmer) into a karyotype and a link file and the .[qr]diff files into a .high file, for visualization with circos. Also a circos config file, derived from a template, is generated.

=head1 REQUIRED ARGUMENTS

=over 8

=item B<--in>

    The path to the .coords and .diff files provided by dnadiff, including the file prefix, but excluding the suffix.

=item B<--out>
    
    The prefix for the desired output .karyo, .link and .high files for circos (txt format)

=back

=head1 OPTIONS

=over 8

=item B<--self>
    
    Flag to indicate that reference and query are the same genome.

=item B<--help>
    
    Show this help screen

=item B<--man>
    
    Show a detailed documentation

=item B<--one>
    
    Flag to trigger the script to use the .1coords file of the 1-to-1 alignments instead of the default .mcoords file of the M-to-M alignments

=item B<--template>
    
    Use another than the default template to generate the circos.conf file. 
    Default is "circos_template_full.conf" in the same directory as the script. 
    CAUTION: The config file has to follow some conventions. See the default file and its comments.

=item B<--promer>

    Flag to indicate that the alignment was generated by promer rather than nucmer. For correct parsing use promer with the options -crlTH.

=back

=head1 CHANGELOG

    Changes in version 2:
    Changed the naming of the IDs in the karyotype file to be more meaningful (closer to the name of the sequence). 

=head1 BUGS AND LIMITATIONS

    None known yet

=head1 AUTHOR

    Markus Ankenbrand

=head1 DISCLAIMER OF WARRANTY

    This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY

=cut
