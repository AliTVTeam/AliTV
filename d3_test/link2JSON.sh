#!/bin/bash

perl -pe "s/ /\t/" chromosome2_-_NC_011988.fna_-_lastz.link | datamash -g 1 collapse 2 | perl -pe 's/,/ /' | cut -f2 | cut -f1,2,3,5,6,7 -d" " | perl -F"/\s/" -ane 'BEGIN{print "[\n"} print "{\"source\": {\"name\": \"$F[0]\", \"start\": $F[1], \"end\": $F[2]}, \"target\": {\"name\": \"$F[3]\", \"start\": $F[4], \"end\": $F[5]}},\n"; END{print "]\n"}' >link.json

# Remove the "," in the second-last line manually
