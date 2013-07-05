package Blast::Parser::TSV;

use warnings;
use strict;

=head1 NAME

=head1 DESCRIPTION

=head1 SYNOPSIS

=head1 Public METHODS

=head2 new (constructor)

Takes Blast output file

=cut

sub new{
	my $class = shift;
	# defaults
	my $self = {
		fh => undef,
		file => undef,
		output => '',
		iterations => [],
	};
	
	# overwrite defaults
	$self = {(%{$self}, @_)};
    bless $self, $class;	
	
	$self->_open() unless $self->{fh};
	$self->_field_map(); # initialize the field map that is used for column selection
	$self->_scan(); # preliniary output scan, detects some general settings, e.g used columns, number of iterations...
	
    return $self;
}

=head2 get_column

Returns values of a column of the output as array. Expects a column
 identifier (either column name or column index). If multiple queries where
 used, the second parameter specifies the index of the iteration (query) to 
 be scanned, if omitted, the column contains the values of alle queries
 combined. 

=cut


sub get_column{
	my $self = shift;
	my $c = shift;
	my $iter;
	@_ && ($iter = shift);
	
	my $i_c = $self->_column_index($c);

	my $fh = $self->{fh};
	my @column;
	
	defined ($iter) ? seek($fh, $self->{iterations}[$iter]{byte_position}, 0) : seek($fh, 0, 0);
	
	while(<$fh>){
		chomp();
		if(/^#/){
			defined ($iter) ? last : next;
		};
		push @column, (split ('\s+', $_))[$i_c];
	}
	seek($fh, 0, 0);
	
	return @column;
}

=head2 get_next_entry



=cut

sub get_next_row{
	my $self = shift;
	my $fh = $self->{fh};
	while(<$fh>){
		next if /^#/;
		return split ('\s+', $_) if defined;
	}
	return;
}


sub colnames{
	return @{shift->{colnames}};
}

sub output{
	return shift->{output};
}


=head1 Private METHODS

=cut


sub DESTROY{
	my $self = shift;
	close $self->{fh};
}

sub _open{
	my $self = shift;
	my $fh;
	if ($self->{file}){	
		open($fh, '<', $self->{file}) or die "Can't open File $self->{file}\n";
	}else{
		open($fh, '<', \$self->{output}) or die "Can't read output $self->{output}\n";
	}
	$self->{fh} = $fh;
}

sub _scan{
	my $self = shift;
	my $fh = $self->{fh};
	my $iterations_count = 0;
	seek($fh, 0, 0);
	while(<$fh>){
		chomp();
		
		# col names
		if(!defined($self->{colnames}) && s/^# Fields: //){
			my @fields = split(/,\s+/, $_);
			
			$self->{colnames} = [map{$self->{_field_map}{$_}}@fields];

			my %tmp;
			@tmp{$self->colnames}=(0..$self->colnames); 
			$self->{_colname_map} = \%tmp;
		}
		
		# iterations (multiple queries)
		if(/^# (\d+) hits found/){
			 $self->{iterations}[$iterations_count]{number_of_hits} = $1;
			 $self->{iterations}[$iterations_count]{byte_position} = tell($fh);
			 $iterations_count++;
		}
	}
	seek($fh, 0, 0);
}

sub _column_index{
	my $self = shift;
	my $c = shift;
	
	if($c =~ /\D/){ # assume colname if not only numbers
		return $self->{_colname_map}{$c} if exists $self->{_colname_map}{$c};
		if(exists ($self->{_field_map}{$c})){
			return $self->{_colname_map}{$self->{_field_map}{$c}} 
		}else{
			die "Unknown or undefined field/column name $c\n";
		}
	}else{ # assume actual col index
		return $c;
	}
}

sub _field_map{
	my $self = shift;
	my @blast_format_specifier_field_names = (
       #The supported format specifiers are:
            'qseqid', # means Query Seq-id
               'qgi', # means Query GI
              'qacc', # means Query accesion
           'qaccver', # means Query accesion.version
            'sseqid', # means Subject Seq-id
         'sallseqid', # means All subject Seq-id(s), separated by a ';'
               'sgi', # means Subject GI
            'sallgi', # means All subject GIs
              'sacc', # means Subject accession
           'saccver', # means Subject accession.version
           'sallacc', # means All subject accessions
            'qstart', # means Start of alignment in query
              'qend', # means End of alignment in query
            'sstart', # means Start of alignment in subject
              'send', # means End of alignment in subject
              'qseq', # means Aligned part of query sequence
              'sseq', # means Aligned part of subject sequence
            'evalue', # means Expect value
          'bitscore', # means Bit score
             'score', # means Raw score
            'length', # means Alignment length
            'pident', # means Percentage of identical matches
            'nident', # means Number of identical matches
          'mismatch', # means Number of mismatches
          'positive', # means Number of positive-scoring matches
           'gapopen', # means Number of gap openings
              'gaps', # means Total number of gaps
              'ppos', # means Percentage of positive-scoring matches
            'frames', # means Query and subject frames separated by a '/'
            'qframe', # means Query frame
            'sframe', # means Subject frame
              'btop', # means Blast traceback operations (BTOP)
	);     

	my @blast_outfmt_7_human_readable_field_names = (
     	  'query id',
          'query gi',
          'query acc.',
          'query acc.ver',
          'subject id',
          'subject ids',
          'subject gi',
          'subject gis',
          'subject acc.',
          'subject acc.ver',
          'subject accs.',
          'q. start',
          'q. end',
          's. start',
          's. end',
          'query seq',
          'subject seq',
          'evalue',
          'bit score',
          'score',
          'alignment length',
          '% identity',
          'identical',
          'mismatches',
          'positives',
          'gap opens',
          'gaps',
          '% positives',
          'query/sbjct frames',
          'query frame',
          'sbjct frame',
          'BTOP'
	);
	my %field_map;
	@field_map{@blast_outfmt_7_human_readable_field_names} = @blast_format_specifier_field_names; 
	$self->{_field_map} = \%field_map;
	
}





=head1 TODO

=cut

=head1 AUTHOR

Thomas Hackl S<thomas.hackl@uni-wuerzburg.de>

=cut

1;