#!/usr/bin/env python
# encoding: utf-8
# original version from https://gist.github.com/brantfaircloth/893580
"""
gb_to_bed.py file.gb file.bed genome_name

grab the gene records from a genbank file (edit for other record types).

- requires:  biopython

"""
 
from Bio import SeqIO
from pprint import pprint

import sys
import pdb
 
def main():
    outf = open(sys.argv[2], 'w')
    genome = sys.argv[3]
    for record in SeqIO.parse(open(sys.argv[1], "rU"), "genbank") :
        for feature in record.features:
            if feature.type == 'gene':
                counter = 0;
                for part in feature.location.parts:
                    start = part.start.position
                    stop = part.end.position
                    try:
                        name = feature.qualifiers['gene'][0] + "_" + str(counter)
                        counter += 1
                    except:
                        # some features only have a locus tag
                        name = feature.qualifiers['locus_tag'][0] + "_" + str(counter)
                        counter += 1
                        if feature.strand < 0:
                            tmp = start
                            start = stop
                            stop = tmp
                            bed_line = "{0}_gi\t{1}\t{2}\t{0}_{3}\n".format(genome, start, stop, name)
                            sys.stdout.write("\"{0}_{3}\":{{\"karyo\":\"{0}_gi\",\"start\":{1},\"end\":{2},\"group\":\"gen\"}},".format(genome, start, stop, name));
                            outf.write(bed_line)
    outf.close()
 
if __name__ == '__main__':
    main()
