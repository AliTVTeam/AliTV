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
		}},
		"links": {"minLinkIdentity": 0, "maxLinkIdentity": 100, "minLinkLength": 100, "maxLinkLength": 10000, "invisibleLinks": {}}
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
		}},
		"links": {"minLinkIdentity": 0, "maxLinkIdentity": 100, "minLinkLength": 100, "maxLinkLength": 10000, "invisibleLinks": {}},
		  "skipChromosomesWithoutVisibleLinks": false,
		  "showAllChromosomes": true,
		  "skipChromosomesWithoutLinks": false,
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
		}},
		"links": {"minLinkIdentity": 0, "maxLinkIdentity": 100, "minLinkLength": 100, "maxLinkLength": 10000}
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
var karyo7 = {
		'chromosomes': {
			'c1': {'genome_id': 0, 'length': 2000, 'seq': null},
			'c2': {'genome_id': 1, 'length': 2000, 'seq': null},
			'c3': {'genome_id': 1, 'length': 2000, 'seq': null},
			'c4': {'genome_id': 2, 'length': 2000, 'seq': null}
		}
};
var karyo8 = {
		'chromosomes': {
			'c1': {'genome_id': 0, 'length': 1000, 'seq': null},
			'c2': {'genome_id': 0, 'length': 1000, 'seq': null},
			'c3': {'genome_id': 1, 'length': 300, 'seq': null},
			'c4': {'genome_id': 1, 'length': 300, 'seq': null},
			'c5': {'genome_id': 1, 'length': 300, 'seq': null},
			'c6': {'genome_id': 2, 'length': 1000, 'seq': null},
			'c7': {'genome_id': 2, 'length': 1000, 'seq': null}
		}
};
var karyo9 = {
		'chromosomes': {
			'c1': {'genome_id': 0, 'length': 1000, 'seq': null},
			'c2': {'genome_id': 0, 'length': 1000, 'seq': null},
			'c3': {'genome_id': 1, 'length': 1000, 'seq': null},
			'c4': {'genome_id': 1, 'length': 1000, 'seq': null},
			'c5': {'genome_id': 2, 'length': 500, 'seq': null},
			'c6': {'genome_id': 2, 'length': 250, 'seq': null}
		}
};
var karyo10 = {
		'chromosomes': {
			'c1': {'genome_id': 0, 'length': 500, 'seq': null},
			'c2': {'genome_id': 0, 'length': 500, 'seq': null},
			'c3': {'genome_id': 1, 'length': 1000, 'seq': null}
		}
};
var karyo11 = {
		'chromosomes': {
			'c1': {'genome_id': 0, 'length': 1000, 'seq': null}
		}
};
var karyo12 = {
		'chromosomes': {
			'c1': {'genome_id': 0, 'length': 2000, 'seq': null},
			'c2': {'genome_id': 1, 'length': 1000, 'seq': null},
			'c3': {'genome_id': 1, 'length': 1000, 'seq': null},
			'c4': {'genome_id': 2, 'length': 1000, 'seq': null},
			'c5': {'genome_id': 2, 'length': 500, 'seq': null}
		}
};
var karyo13 = {
		'chromosomes': {
			'c1_gi': {'genome_id': 0, 'length': 2000, 'seq': null},
			'c2_gi': {'genome_id': 1, 'length': 1000, 'seq': null}
		}
};
var karyo14 = {
		'chromosomes': {
			'c1_gi': {'genome_id': "species_2", 'length': 2000, 'seq': null},
			'c2_gi': {'genome_id': "species_1", 'length': 1000, 'seq': null}
		}
};
var karyo15 = {
		'chromosomes': {
			'c1': {'genome_id': 0, 'length': 1250, 'seq': null},
			'c2': {'genome_id': 1, 'length': 1250, 'seq': null}
		}
};
var karyo16 = {
		'chromosomes': {
			'c1': {'genome_id': 0, 'length': 2000, 'seq': null},
			'c2': {'genome_id': 1, 'length': 2000, 'seq': null}
		}
};
var filters4 = {'karyo': {
		'order': ['c1', 'c2', 'c3', 'c4'],
		'genome_order': [0, 1, 2],
		'chromosomes': {
			'c1': {'reverse': false, 'visible': true},
			'c2': {'reverse': false, 'visible': true},
			'c3': {'reverse': false, 'visible': true},
			'c4': {'reverse': false, 'visible': true}
		}},
		"links": {"minLinkIdentity": 0, "maxLinkIdentity": 100, "minLinkLength": 100, "maxLinkLength": 10000}
};
var filters4_offset = {'karyo': {
	'order': ['c1', 'c2', 'c3', 'c4'],
	'genome_order': [0, 1, 2],
	'genome_region': {
		'1': {'start': 1000}
	},
	'chromosomes': {
		'c1': {'reverse': false, 'visible': true},
		'c2': {'reverse': false, 'visible': true},
		'c3': {'reverse': false, 'visible': true},
		'c4': {'reverse': false, 'visible': true}
	}},
	"links": {"minLinkIdentity": 0, "maxLinkIdentity": 100, "minLinkLength": 100, "maxLinkLength": 10000}
};
var filters4_region = {'karyo': {
	'order': ['c1', 'c2', 'c3', 'c4'],
	'genome_order': [0, 1, 2],
	'genome_region': {
		'1': {'start': 500, 'end': 1000}
	},
	'chromosomes': {
		'c1': {'reverse': false, 'visible': true},
		'c2': {'reverse': false, 'visible': true},
		'c3': {'reverse': false, 'visible': true},
		'c4': {'reverse': false, 'visible': true}
	}},
	"links": {"minLinkIdentity": 0, "maxLinkIdentity": 100, "minLinkLength": 100, "maxLinkLength": 10000}
};
var filters5 = {'karyo': {
	'order': ['c1', 'c2', 'c4'],
	'genome_order': [0, 1, 2],
	'chromosomes': {
		'c1': {'reverse': false, 'visible': true},
		'c2': {'reverse': false, 'visible': true},
		'c4': {'reverse': false, 'visible': true}
	}},
	"links": {"minLinkIdentity": 0, "maxLinkIdentity": 100, "minLinkLength": 100, "maxLinkLength": 10000, "invisibleLinks": {}}
};
var filters4_reverse = {'karyo': {
	'order': ['c1', 'c2', 'c3', 'c4'],
	'genome_order': [0, 1, 2],
	'chromosomes': {
		'c1': {'reverse': false, 'visible': true},
		'c2': {'reverse': true, 'visible': true},
		'c3': {'reverse': false, 'visible': true},
		'c4': {'reverse': true, 'visible': true}
	}},
	"links": {"minLinkIdentity": 0, "maxLinkIdentity": 100, "minLinkLength": 100, "maxLinkLength": 10000}
};
var filters6 = {'karyo': {
	'order': ['c1'],
	'genome_order': [0],
	'chromosomes': {
		'c1': {'reverse': false, 'visible': true}
	}},
	"links": {"minLinkIdentity": 0, "maxLinkIdentity": 100, "minLinkLength": 100, "maxLinkLength": 10000}
}
var filters7 = {'karyo': {
	'order': ['c1', 'c2'],
	'genome_order': [0, 1],
	'chromosomes': {
		'c1': {'reverse': false, 'visible': true},
		'c2': {'reverse': false, 'visible': true}
	}},
	"links": {"minLinkIdentity": 0, "maxLinkIdentity": 100, "minLinkLength": 100, "maxLinkLength": 10000}
}
var filters8 = {'karyo': {
	'order': ['c1', 'c2', 'c3', 'c4'],
	'genome_order': [0, 1, 2, 3],
	'chromosomes': {
		'c1': {'reverse': false, 'visible': true},
		'c2': {'reverse': false, 'visible': true},
		'c3': {'reverse': false, 'visible': true},
		'c4': {'reverse': false, 'visible': true}
	}
}
};

var filters9 = {'karyo': {
	'order': ['c1', 'c2', 'c3'],
	'genome_order': [0, 1, 2],
	'chromosomes': {
		'c1': {'reverse': false, 'visible': true},
		'c2': {'reverse': false, 'visible': false},
		'c3': {'reverse': false, 'visible': true}
	}
}
};

var filters10 = {'karyo': {
	'order': ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7'],
	'genome_order': [0, 1, 2],
	'chromosomes': {
		'c1': {'reverse': false, 'visible': true},
		'c2': {'reverse': false, 'visible': true},
		'c3': {'reverse': false, 'visible': true},
		'c4': {'reverse': false, 'visible': true},
		'c5': {'reverse': false, 'visible': true},
		'c6': {'reverse': false, 'visible': true},
		'c7': {'reverse': false, 'visible': true}
	}},
	"links": {"minLinkIdentity": 0, "maxLinkIdentity": 100, "minLinkLength": 50, "maxLinkLength": 1000}
};

var filters11 = {'karyo': {
	'order': ['c1'],
	'genome_order': [0],
	'chromosomes': {
		'c1': {'reverse': false, 'visible': false}
	}},
	"links": {"minLinkIdentity": 0, "maxLinkIdentity": 100, "minLinkLength": 50, "maxLinkLength": 1000}
};

var filters12 = {'karyo': {
	'order': ['c1', 'c2', 'c3'],
	'genome_order': [0, 1],
	'chromosomes': {
		'c1': {'reverse': false, 'visible': true},
		'c2': {'reverse': false, 'visible': false},
		'c3': {'reverse': false, 'visible': true}
	}},
	"links": {"minLinkIdentity": 0, "maxLinkIdentity": 100, "minLinkLength": 100, "maxLinkLength": 10000}
}

var filters13 = {'karyo': {
	'order': ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7'],
	'genome_order': [0, 1, 2],
	'chromosomes': {
		'c1': {'reverse': false, 'visible': true},
		'c2': {'reverse': false, 'visible': true},
		'c3': {'reverse': false, 'visible': false},
		'c4': {'reverse': false, 'visible': true},
		'c5': {'reverse': false, 'visible': false},
		'c6': {'reverse': false, 'visible': false},
		'c7': {'reverse': false, 'visible': true}
	}},
	"links": {"minLinkIdentity": 0, "maxLinkIdentity": 100, "minLinkLength": 50, "maxLinkLength": 1000}
};

var filters14 = {'karyo': {
	'order': ['c1', 'c2', 'c3'],
	'genome_order': [0, 1],
	'chromosomes': {
		'c1': {'reverse': false, 'visible': true},
		'c2': {'reverse': false, 'visible': true},
		'c3': {'reverse': false, 'visible': false}
	}},
	"links": {"minLinkIdentity": 0, "maxLinkIdentity": 100, "minLinkLength": 100, "maxLinkLength": 10000}
}

var filters15 = {'karyo': {
	'order': ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7'],
	'genome_order': [0, 1, 2],
	'chromosomes': {
		'c1': {'reverse': false, 'visible': true},
		'c2': {'reverse': false, 'visible': true},
		'c3': {'reverse': false, 'visible': true},
		'c4': {'reverse': false, 'visible': true},
		'c5': {'reverse': false, 'visible': true},
		'c6': {'reverse': false, 'visible': true},
		'c7': {'reverse': false, 'visible': true}
	}},
	"links": {"minLinkIdentity": 0, "maxLinkIdentity": 100, "minLinkLength": 100, "maxLinkLength": 10000}
}

var filters16 = {'karyo': {
	'order': ['c1', 'c2', 'c3'],
	'genome_order': [0, 1],
	'chromosomes': {
		'c1': {'reverse': false, 'visible': true},
		'c2': {'reverse': true, 'visible': true},
		'c3': {'reverse': false, 'visible': true}
	}},
	"links": {"minLinkIdentity": 0, "maxLinkIdentity": 100, "minLinkLength": 100, "maxLinkLength": 10000}
};

var filters17 = {'karyo': {
	'order': ['c1', 'c2', 'c3', 'c4', 'c5'],
	'genome_order': [0, 1, 2],
	'chromosomes': {
		'c1': {'reverse': false, 'visible': true},
		'c2': {'reverse': false, 'visible': true},
		'c3': {'reverse': false, 'visible': true},
		'c4': {'reverse': false, 'visible': true},
		'c5': {'reverse': false, 'visible': true}
	}
}
}

var filters18 = {'karyo': {
	'order': ['c1', 'c2', 'c3', 'c4', 'c5', 'c6'],
	'genome_order': [0, 1, 2],
	'chromosomes': {
		'c1': {'reverse': false, 'visible': true},
		'c2': {'reverse': false, 'visible': true},
		'c3': {'reverse': false, 'visible': true},
		'c4': {'reverse': false, 'visible': true},
		'c5': {'reverse': false, 'visible': true},
		'c6': {'reverse': false, 'visible': true}
	}},
	"links": {"minLinkIdentity": 0, "maxLinkIdentity": 100, "minLinkLength": 100, "maxLinkLength": 10000, "invisibleLinks": {}}
}

var filters19 = {'karyo': {
	'order': ['c1_gi', 'c2_gi'],
	'genome_order': [0, 1],
	'chromosomes': {
		'c1_gi': {'reverse': false, 'visible': true},
		'c2_gi': {'reverse': false, 'visible': true}
	}},
	"links": {"minLinkIdentity": 0, "maxLinkIdentity": 100, "minLinkLength": 100, "maxLinkLength": 10000, "invisibleLinks": {}}
}

var filters20 = {'karyo': {
	'order': ['c1_gi', 'c2_gi'],
	'genome_order': ["species_1", "species_2"],
	'chromosomes': {
		'c1_gi': {'reverse': false, 'visible': true},
		'c2_gi': {'reverse': false, 'visible': true}
	}},
	"links": {"minLinkIdentity": 0, "maxLinkIdentity": 100, "minLinkLength": 100, "maxLinkLength": 10000, "invisibleLinks": {}}
}

var filters21 = {'karyo': {
	'order': ['c1', "c2"],
	'genome_order': [0, 1],
	'chromosomes': {
		'c1': {'reverse': false, 'visible': true},
		'c2': {'reverse': false, 'visible': true}
	}},
	"links": {"minLinkIdentity": 0, "maxLinkIdentity": 100, "minLinkLength": 100, "maxLinkLength": 10000}
}

var features = {
	'link':{
		'f1': {'karyo': 'c1', 'start': 300, 'end': 800},
		'f2': {'karyo': 'c2', 'start': 100, 'end': 600}
	}
};
var features2 = {
	'link':{
		'f1': {'karyo': 'c1', 'start': 300, 'end': 800},
		'f2': {'karyo': 'c2', 'start': 100, 'end': 600},
		'f3': {'karyo': 'c4', 'start': 400, 'end': 900},
		'f4': {'karyo': 'c3', 'start': 900, 'end': 800},
		'f5': {'karyo': 'c1', 'start': 1800, 'end': 1900}
	}
};
var features3 = {
	'link':{
		'f1': {'karyo': 'c1', 'start': 300, 'end': 800},
		'f2': {'karyo': 'c2', 'start': 100, 'end': 600},
		'f3': {'karyo': 'c4', 'start': 400, 'end': 900}
	}
};
var features4 = {
	'link':{
		'f1': {'karyo': 'c1', 'start': 300, 'end': 800},
		'f2': {'karyo': 'c2', 'start': 100, 'end': 600},
		'f3': {'karyo': 'c4', 'start': 400, 'end': 900},
		'f4': {'karyo': 'c1', 'start': 1800, 'end': 1900}
	}
}
var features5 = {
	'link':{
		'f1': {'karyo': 'c1', 'start': 200, 'end': 300},
		'f2': {'karyo': 'c2', 'start': 100, 'end': 700}
	}
};

var features6 = {
	'link':{
		'f1': {'karyo': 'c1', 'start': 200, 'end': 300},
		'f2': {'karyo': 'c2', 'start': 100, 'end': 700},
		'f3': {'karyo': 'c3', 'start': 600, 'end': 700}
	}
};
var features7 = {
	'link':{
		'f1': {'karyo': 'c1', 'start': 300, 'end': 800},
		'f2': {'karyo': 'c2', 'start': 100, 'end': 600},
		'f3': {'karyo': 'c3', 'start': 400, 'end': 900},
		'f4': {'karyo': 'c4', 'start': 800, 'end': 900}
	}
};
var features8 = {
	'link':{
		'f1': {'karyo': 'c1', 'start': 200, 'end': 400},
		'f2': {'karyo': 'c1', 'start': 600, 'end': 800},
		'f3': {'karyo': 'c2', 'start': 550, 'end': 600},
		'f4': {'karyo': 'c3', 'start': 100, 'end': 300},
		'f5': {'karyo': 'c4', 'start': 50, 'end': 100},
		'f6': {'karyo': 'c4', 'start': 240, 'end': 290},
		'f7': {'karyo': 'c5', 'start': 200, 'end': 300},
		'f8': {'karyo': 'c6', 'start': 800, 'end': 900},
		'f9': {'karyo': 'c7', 'start': 100, 'end': 150},
		'f10': {'karyo': 'c7', 'start': 700, 'end': 900}
	}
};
var features8 = {
	'link':{
		'f1': {'karyo': 'c1', 'start': 200, 'end': 400},
		'f2': {'karyo': 'c2', 'start': 600, 'end': 800},
		'f3': {'karyo': 'c3', 'start': 550, 'end': 600},
		'f4': {'karyo': 'c1', 'start': 600, 'end': 800}
	}
};
var features9 = {
	'link':{
		'f1': {'karyo': 'c1', 'start': 200, 'end': 400},
		'f2': {'karyo': 'c2', 'start': 600, 'end': 800},
		'f3': {'karyo': 'c1', 'start': 550, 'end': 600},
		'f4': {'karyo': 'c3', 'start': 600, 'end': 800},
		'f5': {'karyo': 'c4', 'start': 600, 'end': 800}
	}
};
var features10 = {
	'link':{
		'f1': {'karyo': 'c1', 'start': 200, 'end': 400},
		'f2': {'karyo': 'c2', 'start': 200, 'end': 400},
		'f3': {'karyo': 'c2', 'start': 600, 'end': 800},
		'f4': {'karyo': 'c3', 'start': 200, 'end': 400},
		'f5': {'karyo': 'c4', 'start': 200, 'end': 400},
		'f6': {'karyo': 'c4', 'start': 600, 'end': 800},
		'f7': {'karyo': 'c3', 'start': 600, 'end': 800},
		'f8': {'karyo': 'c4', 'start': 50, 'end': 100},
		'f9': {'karyo': 'c5', 'start': 100, 'end': 300},
		'f10': {'karyo': 'c6', 'start': 100, 'end': 150}
	}
};

var features11 = {
	'gene':[
		{'karyo': 'c1', 'start': 100, 'end': 200, 'name': "f1"},
		{'karyo': 'c2', 'start': 400, 'end': 300, 'name': "f2"},
		{'karyo': 'c3', 'start': 500, 'end': 600, 'name': "f3"}
	]
};

var features12 = {
	'gene':[
		{'karyo': 'c1', 'start': 100, 'end': 200, 'name': "f1"},
		{'karyo': 'c1', 'start': 442, 'end': 488, 'name': "f2"},
		{'karyo': 'c2', 'start': 43, 'end': 50, 'name': "f3"},
		{'karyo': 'c2', 'start': 401, 'end': 420, 'name': "f4"},
		{'karyo': 'c3', 'start': 45, 'end': 870, 'name': "f5"},
		{'karyo': 'c3', 'start': 902, 'end': 976, 'name': "f6"}
	]
};

var features13 = {
	'gene':[
		{'karyo': 'c1', 'start': 100, 'end': 200, 'name': "f1"},
		{'karyo': 'c1', 'start': 300, 'end': 400, 'name': "f2"}
	]
};

var features14 = {
	'invertedRepeat': [{'karyo': 'c1', 'start': 100, 'end': 200, 'name': "f1"}]
};

var features14r = {
	'invertedRepeat': [{'karyo': 'c1', 'start': 200, 'end': 100, 'name': "f1"}]
};

var features15 = {
	'gene': [
		{'karyo': 'c1', 'start': 100, 'end': 200, 'name': "f1"},
		{'karyo': 'c1', 'start': 488, 'end': 442, 'name': "f2"}
	],
	'invertedRepeat': [
		{'karyo': 'c2', 'start': 50, 'end': 43, 'name': "f3"},
		{'karyo': 'c2', 'start': 401, 'end': 420, 'name': "f4"}
	]
};

var features16 = {
	'gene': [
		{'karyo': 'c1', 'start': 100, 'end': 200, 'name': "f1"},
		{'karyo': 'c1', 'start': 442, 'end': 488, 'name': "f2"}
	],
	'invertedRepeat': [
		{'karyo': 'c2', 'start': 43, 'end': 50, 'name': "f3"},
		{'karyo': 'c2', 'start': 401, 'end': 420, 'name': "f4"}
	],
	'link':{
		'f5': {'karyo': 'c1', 'start': 100, 'end': 200},
		'f6': {'karyo': 'c2', 'start': 50, 'end': 250}
	}
};


var features17 = {
	'gene': [{'karyo': 'c1', 'start': 100, 'end': 200, 'name': "f1"}],
	'invertedRepeat': [{'karyo': 'c1', 'start': 300, 'end': 400, 'name': "f2"}],
	'n-stretch': [{'karyo': 'c1', 'start': 500, 'end': 600, 'name': "f3"}]
};

var features18 = {
	'repeat': [{'karyo': 'c1', 'start': 100, 'end': 200, 'name': "f1"}],
	'transposon': [{'karyo': 'c1', 'start': 300, 'end': 400, 'name': "f2"}],
	'n-stretch': [{'karyo': 'c1', 'start': 500, 'end': 600, 'name': "f3"}]
};

var features19 = {
	'gene': [{'karyo': 'c1', 'start': 1800, 'end': 2000, 'name': "f1"}],
	'invertedRepeat': [{'karyo': 'c2', 'start': 300, 'end': 400, 'name': "f2"}],
	'nStretch': [{'karyo': 'c3', 'start': 500, 'end': 600, 'name': "f3"}],
	'repeat': [{'karyo': 'c4', 'start': 500, 'end': 600, 'name': "f4"}],
	'link':{
		'f5': {'karyo': 'c5', 'start': 100, 'end': 200}
	}
};

var features20 = {
	'tRNA': [{'karyo': 'c5', 'start': 100, 'end': 200, 'name': "f6"}]
};

var features21 = {
		'gene':[
			{'karyo': 'c1_gi', 'start': 100, 'end': 200, 'name': "f1"},
			{'karyo': 'c2_gi', 'start': 300, 'end': 400, 'name': "f2"}
		]
	};

var features22 = {
		'gene':[
			{'karyo': 'c1', 'start': 100, 'end': 200, 'name': "f1", "strand": "+"},
			{'karyo': 'c2', 'start': 300, 'end': 400, 'name': "f2", "strand": "-"}
		]
};

var features23 = {
		'link':{
			'f1': {'karyo': 'c1', 'start': 500, 'end': 1000},
			'f2': {'karyo': 'c2', 'start': 500, 'end': 1000}
		}
};

var features24 = {
		'link':{
			'f1': {'karyo': 'c1', 'start': 500, 'end': 250},
			'f2': {'karyo': 'c2', 'start': 250, 'end': 500}
		}
};

var features25 = {
		'link':{
			'f1': {'karyo': 'c1', 'start': 200, 'end': 700},
			'f2': {'karyo': 'c2', 'start': 800, 'end': 300}
		}
};

var features26 = {
		'gene':[
			{'karyo': 'c1', 'start': 800, 'end': 950, 'name': "f1"}
		]
	};

var features27 = {
		'invertedRepeat': [{'karyo': 'c1', 'start': 1900, 'end': 1800, 'name': "f1"}]
	};

var features28 = {
		'invertedRepeat': [{'karyo': 'c1', 'start': 100, 'end': 200, 'name': "f1"}]
	};

var features29 = {
		'invertedRepeat': [{'karyo': 'c1', 'start': 1900, 'end': 1800, 'name': "f1"}]
	};

var links = {"0":{"1":{
            	 "l1": {'source': 'f1', 'target': 'f2', 'identity': 90}
			 }}};
var links2 = {"0":{"1":{
            	 "l1": {'source': 'f1', 'target': 'f2', 'identity': 90},
				 "l2": {'source': 'f3', 'target': 'f2', 'identity': 86}
			 }}};
var links3 = {"0":{"1":{
             	 "l1": {'source': 'f1', 'target': 'f2', 'identity': 90}}},
              "1":{"2":{
            	 "l2": {'source': 'f5', 'target': 'f4', 'identity': 86}}}
             };
var links4 = {"0":
				{"1":
					{"l1": {'source': 'f1', 'target': 'f2', 'identity': 90}
				},
				"2":
					{"l3": {'source': 'f1', 'target': 'f3', 'identity': 94}
	 			}
			  },
              "1":
              	{"2":
              		{"l2": {'source': 'f2', 'target': 'f3', 'identity': 86}
              	}
			  }
			 };
var links5 = {"0":{"1":{
		"l1": {'source': 'f1', 'target': 'f2', 'identity': 90},
		"l2": {'source': 'f2', 'target': 'f3', 'identity': 86}
}}};
var links6 = {"0":
			{"2":
				{"l3": {'source': 'f1', 'target': 'f3', 'identity': 90}}
			,
			"1":
				{"l5": {'source': 'f4', 'target': 'f2', 'identity': 86}}
			}};
var links7 = {"0":{"1":{
		"l1": {'source': 'f1', 'target': 'f3', 'identity': 40},
		"l2": {'source': 'f2', 'target': 'f3', 'identity': 50},
		"l3": {'source': 'f2', 'target': 'f4', 'identity': 60},
		"l4": {'source': 'f1', 'target': 'f4', 'identity': 70},
		"l5": {'source': 'f4', 'target': 'f2', 'identity': 90}
}}};
var links8 = {"0":{"1":{
		"l1": {'source': 'f1', 'target': 'f2', 'identity': 75}
}}};

var links9 = {"0":{"1":{
		"l1": {'source': 'f1', 'target': 'f3', 'identity': 80}
}}};

var links10 = {"0":{"1":{
		"l1": {'source': 'f1', 'target': 'f2', 'identity': 90},
		"l2": {'source': 'f2', 'target': 'f4', 'identity': 100}
}}};

var links11 = {"0":{"1":{
		"l1": {'source': 'f1', 'target': 'f4', 'identity': 75},
		"l2": {'source': 'f2', 'target': 'f5', 'identity': 100},
		"l3": {'source': 'f3', 'target': 'f6', 'identity': 88},
		"l4": {'source': 'f4', 'target': 'f9', 'identity': 77},
		"l5": {'source': 'f6', 'target': 'f10', 'identity': 99}
}}};

var links12 = {"0":{"1":{
		"l1": {'source': 'f1', 'target': 'f2', 'identity': 75},
		"l2": {'source': 'f3', 'target': 'f4', 'identity': 100}
}}};

var links13 = {"0":{"1":{
		"l1": {'source': 'f1', 'target': 'f4', 'identity': 30},
		"l2": {'source': 'f2', 'target': 'f5', 'identity': 99},
		"l3": {'source': 'f3', 'target': 'f6', 'identity': 88},
		"l4": {'source': 'f7', 'target': 'f9', 'identity': 77},
		"l5": {'source': 'f8', 'target': 'f10', 'identity': 100}
}}};

var links14 = {"0":{"1":{
   	 "l1": {'source': 'f5', 'target': 'f6', 'identity': 90}
	 }}};

var links15 = {"1":{"0":{
  	 "l1": {'source': 'f1', 'target': 'f2', 'identity': 90}
	 }}};

var links16 = {"1":{"0":{
 	 "l1": {'source': 'f1', 'target': 'f2', 'identity': 90}
	 }}};

var tree = {
		"children": [{
			"children": [{
				"children": [{
					"children": [{
						"children": [{
							"name": "Genome 1"
						}, {
							"name": "Genome 2"
						}]
					}, {
						"children": [{
							"name": "Genome 3"
						}]
					}]
				}]
			}, {
				"children": [{
					"children": [{
						"children": [{
							"name": "Genome 4"
						}]
					}]
				}]
			}]
		}, {
			"children": [{
				"children": [{
					"children": [{
						"children": [{
							"name": "Genome 5"
						}]
					}]
				}]
			}]
		}]
	};

var data = {'karyo': karyo, 'features': features, 'links': links};
var data2 = {'karyo': karyo2, 'features': features, 'links': links};
var data3 = {'karyo': karyo3, 'features': features, 'links': links};
var data4 = {'karyo': karyo4, 'features': features, 'links': links};
var data5 = {'karyo': karyo, 'features': features, 'links': links, "tree": tree};
var data6 = {'karyo': karyo, 'features': features, 'links': links, "tree": {}};
var data7 = {'karyo': karyo, 'features': features, 'links': links, "tree": null};
var data8 = {'karyo': karyo, 'features': features16, "links": links14, "tree": tree};
var data9 = {'karyo': karyo, 'features': features17, "links": links14, "tree": tree};