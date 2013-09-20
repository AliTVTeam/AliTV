#!/usr/bin/perl
use strict;
use warnings;
use Getopt::Long;
use Pod::Usage;
use FindBin;
use POSIX; # for rounding

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
my ($in,$out,$step,$help,$man) = ('','',5,0,0);
my $template = "$FindBin::Bin/circos_template_full.conf";
# get the options from the command line
GetOptions('in=s'=>\$in,
	   'out=s'=>\$out,
	   'self'=>\(my $opt_self),
	   'minlen=i'=>\(my $minlen=100),
	   'step=i'=>\$step,
	   'minidy=i'=>\(my $minidy=50),
	   'template=s'=>\$template,
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

open(IN,'<',$in) or die "$!";
open(LINK,'>',"$out.link") or die "$!";
while(<IN>){
	# skip header line
	next if(/^#/);
    # The input file has to contains the alignments made by dnadiff in columns 
    # [TAGR][S1][E1][SIZE1][TAGQ][S2][E2][STRAND][SIZE2][IDY_FRACT][IDY%][SCORE][LEN_AL]
    my ($tagr,$s1,$e1,$lenr,$tagq,$s2,$e2,$strand,$lenq,$idy,$lenal) = (0,1,2,3,4,5,6,7,8,10,12);
    my @items = split(/\s/,$_);
    $items[$idy] =~ s/%//;

    ($s2, $e2) = ($e2, $s2) if ($items[$strand] =~ /-/);
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
    # calculate color from identity
    my $colorIndex = floor($items[$idy]/$step)-(100/$step-10);
    $colorIndex = 0 if($colorIndex < 0);
    my $color = $colors[$colorIndex];
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
unless($opt_self){
	print KARYO "\n#QUERY SEQUENCES\n";
	for(my $i = 0; $i < @queryOrder; $i++){
	    my $que = $queryOrder[$i];
	    print KARYO "chr - $queryIDs{$que} $que 0 $queries{$que} blue\n";
	    print WANTED "$queryIDs{$que}\n";
	}
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
    # no highlights to draw
    elsif(/^highlightfile/){
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
