#!/bin/bash

for i in *.fa
do
    for j in *.fa
    do
        if [[ ! "$i" < "$j" ]]
            then lastz $i"[multiple,unmask]" $j"[unmask]" --format=general:name1,zstart1,end1,size1,name2,zstart2+,end2+,strand2,size2,identity,score,length2 --noytrim --ambiguous=iupac --gapped | sed 's/gi/'$(echo $i | sed 's/^\(.....\).*/\1/')'gi/;s/\([[:space:]]\)gi/\1'$(echo $j | sed 's/^\(.....\).*/\1/')'gi/' >$i"_vs_"$j".txt"
	fi
    done
done

cat *.txt | perl -F"\t" -ane 'BEGIN{$f=0;}next if(/^#/);print STDERR "$F[0]\t$F[1]\t$F[2]\tf$f\n"; $f++; ($F[5],$F[6])=($F[6],$F[5]) if($F[7] eq "-"); print STDERR "$F[4]\t$F[5]\t$F[6]\tf$f\n"; $f++; printf("f%i\tf%i\t%.2f\n", $f-2, $f-1, $F[10])' >link.tsv 2>link.bed
