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

cat *.txt | perl -F"\t" -ane 'BEGIN{$f=0;print "#fida\tfidb\tidentity\n"}next if(/^#/);print STDERR "$F[0]\t$F[1]\t$F[2]\tf$f\n"; $f++; ($F[5],$F[6])=($F[6],$F[5]) if($F[7] eq "-"); print STDERR "$F[4]\t$F[5]\t$F[6]\tf$f\n"; $f++; printf("f%i\tf%i\t%.2f\n", $f-2, $f-1, $F[10])' >link.tsv 2>link.bed

cut -f1,4 *.txt | sort -u | grep -v "^#" | perl -pe 's/^(....)_gi/$1_gi\t$1/' >karyo.tsv
# manually change Ntab to N.tabacum, etc. in genome column

perl ../../../bin/generateJSONfiles.pl --karyo karyo.tsv --bed link.bed --link link.tsv --prefix tmp

# Add manually created conf.json to data folder
# Manually set genome_order in filters.json to ["O.europaea","L.philippensis","C.phelypaea","E.virginiana","O.gracilis","S.americana","N.tabacum"]

# Add manually created tree.json to data.json -> tree

for i in *.fa; do makeblastdb -dbtype nucl -in $i; done
for i in *.fa; do genome=$(echo $i | head -c5); blastn -query $i -db $i -outfmt 6 -evalue 1e-40 | perl -pe 's/^[^\t]+\t[^\t]+/'$genome'gi\t'$genome'gi/' | perl -F"\t" -ane 'print "$F[0]\t$F[6]\t$F[7]\tirA\n$F[0]\t$F[8]\t$F[9]\tirB\n" if($F[6]<$F[9] && $F[8]>$F[9])'; done >ir.bed

perl -F"\t" -ane 'BEGIN{print "\"invertedRepeat\":[";}chomp $F[3]; print "{\"karyo\":\"$F[0]\",\"start\":$F[1],\"end\":$F[2],\"name\":\"$F[3]\"},"' ir.bed | perl -pe 's/,$/],\n/' >ir.json

for i in *.gb; do PREFIX=$(echo $i | head -c4); BASE=$(basename $i .gb); python gb_to_bed_json.py $i $BASE.bed $PREFIX >${PREFIX}_gene.json; done
(echo -n '"gene":['; cat *_gene.json | perl -pe 's/,$/],\n/') >gene.json

cat *_NC_*.bed | grep -i ndh | perl -F"\t" -ane 'BEGIN{print "\"ndh\":[";}chomp $F[3]; print "{\"karyo\":\"$F[0]\",\"start\":$F[1],\"end\":$F[2],\"name\":\"$F[3]\"},"' | perl -pe 's/,$/],\n/' >ndh.json
cat *_NC_*.bed | grep -i ycf | perl -F"\t" -ane 'BEGIN{print "\"ycf\":[";}chomp $F[3]; print "{\"karyo\":\"$F[0]\",\"start\":$F[1],\"end\":$F[2],\"name\":\"$F[3]\"},"' | perl -pe 's/,$/],\n/' >ycf.json

cat ir.json ndh.json ycf.json gene.json >features.json

# Add features.json to data.json -> features

# manually remove genes that cover up huge regions (most likely due to introns)
perl -F"\t" -ane 'print if(abs($F[1]-$F[2]) > 10000)' *_NC_*.bed
#Cphe_gi	23688	0	PS35_p01
#Cphe_gi	94380	49166	PS35_p01
#Cphe_gi	23574	77863	PS35_p34
#Ogra_gi	26534	56952	rps12

# rps12 is split in multiple exons (CDS has join region, but gene only start and end)

# For the split version of Ntab:
cat gene.json| perl -pe 's/\}/\}\n/g' | perl -pe 'if(/Ntab_gi","start":(\d+),"end":(\d+)/){if($1 > 80000 and $2 > 80000){$s=$1-80000;$e=$2-80000;s/Ntab_gi","start":\d+,"end":\d+/Ntab_gi2","start":$s,"end":$e/;}}' >gene_split.json
