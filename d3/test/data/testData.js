var karyo = {
		'chromosomes': {
			'c1': {'genome_id': 0, 'length': 2000, 'seq': null},
			'c2': {'genome_id': 1, 'length': 1000, 'seq': null}
		}
};
var filters = {'karyo': {
		'order': ['c1', 'c2'],
		'genome_order': [0, 1],
		'chromosomes': {
			'c1': {'reverse': false, 'visible': true},
			'c2': {'reverse': false, 'visible': true}
		}
	}
}
var karyo2 = {
		'chromosomes': {
			'c1': {'genome_id': 0, 'length': 2000, 'seq': null},
			'c2': {'genome_id': 1, 'length': 1000, 'seq': null},
			'c3': {'genome_id': 1, 'length': 1000, 'seq': null}
		}
};
var filters2 = {'karyo': {
		'order': ['c1', 'c2', 'c3'],
		'genome_order': [0, 1],
		'chromosomes': {
			'c1': {'reverse': false, 'visible': true},
			'c2': {'reverse': false, 'visible': true},
			'c3': {'reverse': false, 'visible': true}
		}
	}
}
var karyo3 = {
		'chromosomes': {
			'c1': {'genome_id': 0, 'length': 2000, 'seq': null},
			'c2': {'genome_id': 1, 'length': 1000, 'seq': null},
			'c3': {'genome_id': 2, 'length': 1000, 'seq': null}
		}
};
var filters3 = {'karyo': {
		'order': ['c1', 'c2', 'c3'],
		'genome_order': [0, 1, 2],
		'chromosomes': {
			'c1': {'reverse': false, 'visible': true},
			'c2': {'reverse': false, 'visible': true},
			'c3': {'reverse': false, 'visible': true}
		}
	}
};
var karyo4 = {
		'chromosomes': {
			'c1': {'genome_id': 0, 'length': 2000, 'seq': null},
			'c2': {'genome_id': 1, 'length': 1000, 'seq': null},
			'c3': {'genome_id': 1, 'length': 1000, 'seq': null},
			'c4': {'genome_id': 2, 'length': 1000, 'seq': null}
		}
};
var karyo5 = {
		'chromosomes': {
			'c1': {'genome_id': 0, 'length': 2000, 'seq': null},
			'c2': {'genome_id': 1, 'length': 1000, 'seq': null},
			'c4': {'genome_id': 2, 'length': 1000, 'seq': null}
		}
};
var karyo6 = {
		'chromosomes': {
			'c1': {'genome_id': 0, 'length': 2000, 'seq': null}
		}
};
var filters4 = {'karyo': {
		'order': ['c1', 'c2', 'c3', 'c4'],
		'genome_order': [0, 1, 2],
		'chromosomes': {
			'c1': {'reverse': false, 'visible': null},
			'c2': {'reverse': false, 'visible': null},
			'c3': {'reverse': false, 'visible': null},
			'c4': {'reverse': false, 'visible': null}
		}
	}
};
var filters5 = {'karyo': {
	'order': ['c1', 'c2', 'c4'],
	'genome_order': [0, 1, 2],
	'chromosomes': {
		'c1': {'reverse': false, 'visible': null},
		'c2': {'reverse': false, 'visible': null},
		'c4': {'reverse': false, 'visible': null}
	}
}
};
var filters4_reverse = {'karyo': {
	'order': ['c1', 'c2', 'c3', 'c4'],
	'genome_order': [0, 1, 2],
	'chromosomes': {
		'c1': {'reverse': false, 'visible': null},
		'c2': {'reverse': true, 'visible': null},
		'c3': {'reverse': false, 'visible': null},
		'c4': {'reverse': true, 'visible': null}
	}
}
};
var filters6 = {'karyo': {
	'order': ['c1'],
	'genome_order': [0],
	'chromosomes': {
		'c1': {'reverse': false, 'visible': true}
	}
}
}
var features = {
		'f1': {'karyo': 'c1', 'start': 300, 'end': 800},
		'f2': {'karyo': 'c2', 'start': 100, 'end': 600}
};
var features2 = {
		'f1': {'karyo': 'c1', 'start': 300, 'end': 800},
		'f2': {'karyo': 'c2', 'start': 100, 'end': 600},
		'f3': {'karyo': 'c4', 'start': 400, 'end': 900},
		'f4': {'karyo': 'c3', 'start': 900, 'end': 800},
		'f5': {'karyo': 'c1', 'start': 1800, 'end': 1900}
};
var features3 = {
		'f1': {'karyo': 'c1', 'start': 300, 'end': 800},
		'f2': {'karyo': 'c2', 'start': 100, 'end': 600},
		'f3': {'karyo': 'c4', 'start': 400, 'end': 900}
};
var features4 = {
		'f1': {'karyo': 'c1', 'start': 300, 'end': 800},
		'f2': {'karyo': 'c2', 'start': 100, 'end': 600},
		'f3': {'karyo': 'c4', 'start': 400, 'end': 900},
		'f4': {'karyo': 'c1', 'start': 1800, 'end': 1900}	
}
var links = {
            	 "l1": {'source': 'f1', 'target': 'f2', 'identity': 90}
			 };
var links2 = {
            	 "l1": {'source': 'f1', 'target': 'f2', 'identity': 90},
				 "l2": {'source': 'f3', 'target': 'f2', 'identity': 86}
			 };
var links3 = {
             	 "l1": {'source': 'f1', 'target': 'f2', 'identity': 90},
 				 "l2": {'source': 'f5', 'target': 'f4', 'identity': 86}
 			 };
var links4 = {
             	 "l1": {'source': 'f1', 'target': 'f2', 'identity': 90},
 				 "l2": {'source': 'f2', 'target': 'f3', 'identity': 86},
 				 "l3": {'source': 'f1', 'target': 'f3', 'identity': 94}
 			 };
var links5 = {
		"l1": {'source': 'f1', 'target': 'f2', 'identity': 90},
		"l2": {'source': 'f2', 'target': 'f3', 'identity': 86}
};
var links6 = {
		"l3": {'source': 'f1', 'target': 'f3', 'identity': 90},
		"l5": {'source': 'f4', 'target': 'f2', 'identity': 86}
};

var data = {'karyo': karyo, 'features': features, 'links': links};
var data2 = {'karyo': karyo2, 'features': features, 'links': links};
var data3 = {'karyo': karyo3, 'features': features, 'links': links};
var data4 = {'karyo': karyo4, 'features': features, 'links': links};