#!/usr/bin/perl

use strict;
use warnings;
use Test::More;
use FindBin;

my $file = $FindBin::RealBin."/data/karyo1.tsv";
ok(-f $file, "Test file karyo1.tsv exists");

done_testing();
