#!/bin/bash

perl -ne 'BEGIN{print "{\n";} next unless(/^chr/); chomp; @F=split;print "\"$F[2]\": $F[5],\n"; END{print "}\n"}' chromosome2_-_NC_011988.fna_-_lastz.karyo >karyo.json

# Remove "," in the second-last line manually
