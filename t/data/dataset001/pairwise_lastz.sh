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
