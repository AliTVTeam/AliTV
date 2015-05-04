var defaultConf =  {
		width: 1000,
		height: 1000,
		linear: {
			genomeDistance: 300,
			karyoHeight: 30,
			karyoDistance: 10,
			linkKaryoDistance: 10,
			drawAllLinks: false,
			startLineColor: "#49006a",
			endLineColor: "#1d91c0",
			tickFrequency: 10
		},
		circular: {
			karyoHeight: 30,
			karyoDistance: 10,
			outerRadius: 450
		},
		minLinkIdentity: 40,
		maxLinkIdentity: 100,
		minLinkIdentityColor: "#D21414",
		maxLinkIdentityColor: "#1DAD0A"
};

describe('The constructor is supposed a proper AliTV object', function(){
	it('Constructor AliTV exists', function(){
		expect(AliTV).toBeDefined();
	});
	var svg = $('<svg></svg>');
	var wga = new AliTV(svg);
	it('WgaPipelie object is not null', function(){
		expect(wga).not.toBeNull();
	});
	it('WgaPipelie object should be an instance of AliTV class', function(){
		expect(wga instanceof AliTV).toBeTruthy();
	});
	it('the svg property is properly set', function(){
		expect(wga.svg).toEqual(svg);
	});
	it('the height of the svg should be set to the configured height', function(){
		expect(wga.svg.height()).toEqual(defaultConf.height);
	});
	it('the width of the svg should be set to the configured width', function(){
		expect(wga.svg.width()).toEqual(defaultConf.width);
	});
	it('the svgD3 property should exist', function(){
		expect(wga.svgD3).not.toBeNull();
	});
	it('the svgD3 property should be a d3 object', function(){
		expect(wga.svgD3 instanceof d3.selection).toBeTruthy();
	});
	it('the data property is initialized as empty object', function(){
		expect(wga.data).toEqual({});
	});
	it('the conf property is initialized with default values', function(){
		expect(wga.conf).toEqual(defaultConf);
	});
});

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

describe('The setData method of AliTV objects is supposed to set the data', function(){
	var svg = $('<svg></svg>');
	var wga = new AliTV(svg);
	it('setData method is supposed to be a function', function(){
		expect(typeof wga.setData).toEqual('function');
	});
	it('setData method is supposed to set the data variable', function(){
		wga.setData(data);
		expect(wga.data).toEqual(data);
	});
	it('setData method is supposed to overwrite existing data', function(){
		wga.setData(data2);
		expect(wga.data).toEqual(data2);
	});
});

describe('The setFilters method of AliTV objects is supposed to set the filters', function(){
	var svg = $('<svg></svg>');
	var wga = new AliTV(svg);
	it('setFilters method is supposed to be a function', function(){
		expect(typeof wga.setFilters).toEqual('function');
	});
	it('setFilters method is supposed to set the filters variable', function(){
		wga.setData(data);
		wga.setFilters(filters);
		expect(wga.filters).toEqual(filters);
	});
	it('setData method is supposed to overwrite existing filters', function(){
		wga.setData(data2);
		wga.setFilters(filters2);
		expect(wga.filters).toEqual(filters2);
	});
});

describe('The getLinearKaryoCoords method of AliTV objects is supposed to calculate coordinates for the karyos in the linear case', function(){
	var svg = $('<svg></svg>');
	var wga = new AliTV(svg);
	it('getLinearKaryoCoords method is supposed to be a function', function(){
		expect(typeof wga.getLinearKaryoCoords).toEqual('function');
	});
	it('getLinearKaryoCoords method is supposed to return linearKaryoCoords', function(){
		wga.setData(data);
		wga.setFilters(filters);
		var linearKaryoCoords = wga.getLinearKaryoCoords();
		expect(linearKaryoCoords).toBeDefined();
	});
	it('getLinearKaryoCoords method is supposed to work with simple test data (2 genomes, 2 chromosomes)', function(){
		wga.setData(data);
		wga.setFilters(filters);
		var linearKaryoCoords = wga.getLinearKaryoCoords();
		var expectedCoords = [
            {'karyo': 'c1', 'x': 0, 'y': 0, 'width': defaultConf.width, 'height': defaultConf.linear.karyoHeight, 'genome': 0},
            {'karyo': 'c2', 'x': 0, 'y': defaultConf.linear.genomeDistance, 'width': defaultConf.width/2, 'height': defaultConf.linear.karyoHeight, 'genome': 1}
        ];
		expect(linearKaryoCoords).toEqual(expectedCoords);
	});
	it('getLinearKaryoCoords method is supposed to work with simple test data (2 genomes, 3 chromosomes)', function(){
		wga.setData(data2);
		wga.setFilters(filters2);
		var linearKaryoCoords = wga.getLinearKaryoCoords();
		var expectedCoords = [
		    {'karyo': 'c1', 'x': 0, 'y': 0, 'width': defaultConf.width/((2000+defaultConf.linear.karyoDistance)/2000), 'height': defaultConf.linear.karyoHeight, 'genome': 0},
		    {'karyo': 'c2', 'x': 0, 'y': defaultConf.linear.genomeDistance, 'width': defaultConf.width/((2000+defaultConf.linear.karyoDistance)/1000), 'height': defaultConf.linear.karyoHeight, 'genome': 1},
		    {'karyo': 'c3', 'x': defaultConf.width/((2000+defaultConf.linear.karyoDistance)/(1000+defaultConf.linear.karyoDistance)), 'y': defaultConf.linear.genomeDistance, 'width': defaultConf.width/((2000+defaultConf.linear.karyoDistance)/1000), 'height': defaultConf.linear.karyoHeight, 'genome': 1}
		];
		expect(linearKaryoCoords).toEqual(expectedCoords);
	});
	it('getLinearKaryoCoords method is supposed to work with simple test data (3 genomes, 3 chromosomes)', function(){
		wga.setData(data3);
		wga.setFilters(filters3);
		var linearKaryoCoords = wga.getLinearKaryoCoords();
		var expectedCoords = [
		    {'karyo': 'c1', 'x': 0, 'y': 0, 'width': defaultConf.width, 'height': defaultConf.linear.karyoHeight, 'genome': 0},
            {'karyo': 'c2', 'x': 0, 'y': defaultConf.linear.genomeDistance, 'width': defaultConf.width/2, 'height': defaultConf.linear.karyoHeight, 'genome': 1},
		    {'karyo': 'c3', 'x': 0, 'y': defaultConf.linear.genomeDistance*2, 'width': defaultConf.width/2, 'height': defaultConf.linear.karyoHeight, 'genome': 2}
		];
		expect(linearKaryoCoords).toEqual(expectedCoords);
	});
	it('getLinearKaryoCoords method is supposed to work with simple test data (3 genomes, 4 chromosomes)', function(){
		wga.setData(data4);
		wga.setFilters(filters4);
		var linearKaryoCoords = wga.getLinearKaryoCoords();
		var expectedCoords = [
		    {'karyo': 'c1', 'x': 0, 'y': 0, 'width': defaultConf.width/((2000+defaultConf.linear.karyoDistance)/2000), 'height': defaultConf.linear.karyoHeight, 'genome': 0},
		    {'karyo': 'c2', 'x': 0, 'y': defaultConf.linear.genomeDistance, 'width': defaultConf.width/((2000+defaultConf.linear.karyoDistance)/1000), 'height': defaultConf.linear.karyoHeight, 'genome': 1},
		    {'karyo': 'c3', 'x': defaultConf.width/((2000+defaultConf.linear.karyoDistance)/(1000+defaultConf.linear.karyoDistance)), 'y': defaultConf.linear.genomeDistance, 'width': defaultConf.width/((2000+defaultConf.linear.karyoDistance)/1000), 'height': defaultConf.linear.karyoHeight, 'genome': 1},
		    {'karyo': 'c4', 'x': 0, 'y': defaultConf.linear.genomeDistance*2, 'width': defaultConf.width/((2000+defaultConf.linear.karyoDistance)/1000), 'height': defaultConf.linear.karyoHeight, 'genome': 2}
		];
		expect(linearKaryoCoords).toEqual(expectedCoords);
	});
});

describe('The drawLinearKaryo method of AliTV objects is supposed to draw karyos', function(){
	var svg = $('<svg></svg>');
	var ali = new AliTV(svg);
	ali.setData(data);
	ali.setFilters(filters);
	it('drawLinearKaryo method is supposed to be a function', function(){
		expect(typeof ali.drawLinearKaryo).toEqual('function');
	});
	it('there should be exactly one karyoGroup in the simple test svg', function(){
		linearKaryoCoords = ali.getLinearKaryoCoords();
		ali.drawLinearKaryo(linearKaryoCoords);
		expect(ali.svgD3.selectAll('.karyoGroup').size()).toEqual(1);
	});
	it('there should be exactly two karyos in the simple test svg', function(){
		linearKaryoCoords = ali.getLinearKaryoCoords();
		ali.drawLinearKaryo(linearKaryoCoords);
		expect(ali.svgD3.selectAll('.karyo').size()).toEqual(2);
	});
	it('the drawn karyos have the expected height', function(){
		linearKaryoCoords = ali.getLinearKaryoCoords();
		ali.drawLinearKaryo(linearKaryoCoords);
		// This test checks only the height attribute of the first selected element
		expect(Number(ali.svgD3.selectAll('.karyo').attr("height"))).toEqual(defaultConf.linear.karyoHeight);
	});
	it('there should be exactly four karyos in the more complex test svg', function(){
		ali.setData(data4);
		ali.setFilters(filters4);
		linearKaryoCoords = ali.getLinearKaryoCoords();
		ali.drawLinearKaryo(linearKaryoCoords);
		expect(ali.svgD3.selectAll('.karyo').size()).toEqual(4);
	});
//	it('the karyo belongs to the genome_id = 1 and therefore the color should be "rgb(84, 48, 5)"', function(){
//		ali.setData({karyo:karyo,features:features, links:links});
//		ali.setFilters(filters);
//		var linearKaryoCoords = ali.getLinearKaryoCoords();
//		ali.drawLinearKaryo(linearKaryoCoords);
//		expect(String(ali.svgD3.selectAll('.karyo').style("fill"))).toEqual("rgb(84, 48, 5)");	
//		});
});

describe('The drawLinear method of AliTV objects is supposed to draw the linear layout', function(){
	var svg = $('<svg></svg>');
	var wga = new AliTV(svg);
	wga.setData(data2);
	wga.setFilters(filters2);
	it('drawLinear method is supposed to be a function', function(){
		expect(typeof wga.drawLinear).toEqual('function');
	});
	it('there should be exactly three karyos, ticks and one link in the test svg', function(){
		wga.drawLinear();
		expect(wga.svgD3.selectAll('.link').size()).toEqual(1);
		expect(wga.svgD3.selectAll('.karyo').size()).toEqual(3);
		expect(wga.svgD3.selectAll('.tick').size()).toEqual(3);
	});
	it('the drawn karyos have the expected height', function(){
		wga.drawLinear();
		// This test checks only the height attribute of the first selected element
		expect(Number(wga.svgD3.selectAll('.karyo').attr("height"))).toEqual(defaultConf.linear.karyoHeight);
	});
});

describe('The getCircularKaryoCoords method of AliTV objects is supposed to calculate coordinates for the karyos in the circular case', function(){
	beforeEach(function() {
	    jasmine.addMatchers({
	    	toHaveSameAngles: function(util, customEqualityTesters) {
	    		return { 
	    			compare: function(actual, expected){
	    				var result = {pass: true};
	    				if(actual.length !== expected.length){
	    					result.pass = false;
	    				} else {
	    					var precision = 8;
	    					var factor = Math.pow(10, precision);
	    					for(var i=0; i<actual.length; i++){
	    						var startActual = Math.round(actual[i].startAngle*factor)/factor;
	    						var startExpected = Math.round(expected[i].startAngle*factor)/factor;
	    						var endActual = Math.round(actual[i].endAngle*factor)/factor;
	    						var endExpected = Math.round(expected[i].endAngle*factor)/factor;
	    						if((startActual !== startExpected) || (endActual !== endExpected)){
	    							result.pass = false;
	    						}
	    					}
	    				}
	    				return result;
	    			}
	    		};
	    	}
	    });
	});
	var svg = $('<svg></svg>');
	var wga = new AliTV(svg);
	it('getCircularKaryoCoords method is supposed to be a function', function(){
		expect(typeof wga.getCircularKaryoCoords).toEqual('function');
	});
	it('getCircularKaryoCoords method is supposed to return circularKaryoCoords', function(){
		wga.setData(data);
		wga.setFilters(filters);
		var circularKaryoCoords = wga.getCircularKaryoCoords();
		expect(circularKaryoCoords).toBeDefined();
	});
	it('getCircularKaryoCoords method is supposed to work with simple test data (2 genomes, 2 chromosomes)', function(){
		wga.setData(data);
		wga.setFilters(filters);
		var circularKaryoCoords = wga.getCircularKaryoCoords();
		var expAnglePerBase = 2*Math.PI/(3000+2*defaultConf.circular.karyoDistance);
		var expAnglePerSpace = expAnglePerBase * defaultConf.circular.karyoDistance;
		var expectedCoords = [
            {'karyo': 'c1', 'startAngle': 0, 'endAngle': 2000*expAnglePerBase},
            {'karyo': 'c2', 'startAngle': 2000*expAnglePerBase + expAnglePerSpace, 'endAngle': 3000*expAnglePerBase + expAnglePerSpace}
        ];
		expect(circularKaryoCoords).toHaveSameAngles(expectedCoords);
	});
	it('getCircularKaryoCoords method is supposed to work with simple test data (2 genomes, 3 chromosomes)', function(){
		wga.setData(data2);
		wga.setFilters(filters2);
		var circularKaryoCoords = wga.getCircularKaryoCoords();
		var expAnglePerBase = 2*Math.PI/(4000+3*defaultConf.circular.karyoDistance);
		var expAnglePerSpace = expAnglePerBase * defaultConf.circular.karyoDistance;
		var expectedCoords = [
		    {'karyo': 'c1', 'startAngle': 0, 'endAngle': 2000*expAnglePerBase},
		    {'karyo': 'c2', 'startAngle': 2000*expAnglePerBase + expAnglePerSpace, 'endAngle': 3000*expAnglePerBase + expAnglePerSpace},
		    {'karyo': 'c3', 'startAngle': 3000*expAnglePerBase + 2*expAnglePerSpace, 'endAngle': 4000*expAnglePerBase + 2*expAnglePerSpace}
		];
		expect(circularKaryoCoords).toHaveSameAngles(expectedCoords);
	});
	it('getCircularKaryoCoords method is supposed to work with simple test data (3 genomes, 3 chromosomes)', function(){
		wga.setData(data3);
		wga.setFilters(filters3);
		var circularKaryoCoords = wga.getCircularKaryoCoords();
		var expAnglePerBase = 2*Math.PI/(4000+3*defaultConf.circular.karyoDistance);
		var expAnglePerSpace = expAnglePerBase * defaultConf.circular.karyoDistance;
		var expectedCoords = [
		    {'karyo': 'c1', 'startAngle': 0, 'endAngle': 2000*expAnglePerBase},
		    {'karyo': 'c2', 'startAngle': 2000*expAnglePerBase + expAnglePerSpace, 'endAngle': 3000*expAnglePerBase + expAnglePerSpace},
		    {'karyo': 'c3', 'startAngle': 3000*expAnglePerBase + 2*expAnglePerSpace, 'endAngle': 4000*expAnglePerBase + 2*expAnglePerSpace}
		];
		expect(circularKaryoCoords).toHaveSameAngles(expectedCoords);
	});
	it('getCircularKaryoCoords method is supposed to work with simple test data (3 genomes, 4 chromosomes)', function(){
		wga.setData(data4);
		wga.setFilters(filters4);
		var circularKaryoCoords = wga.getCircularKaryoCoords();
		var expAnglePerBase = 2*Math.PI/(5000+4*defaultConf.circular.karyoDistance);
		var expAnglePerSpace = expAnglePerBase * defaultConf.circular.karyoDistance;
		var expectedCoords = [
		    {'karyo': 'c1', 'startAngle': 0, 'endAngle': 2000*expAnglePerBase},
		    {'karyo': 'c2', 'startAngle': 2000*expAnglePerBase + expAnglePerSpace, 'endAngle': 3000*expAnglePerBase + expAnglePerSpace},
		    {'karyo': 'c3', 'startAngle': 3000*expAnglePerBase + 2*expAnglePerSpace, 'endAngle': 4000*expAnglePerBase + 2*expAnglePerSpace},
		    {'karyo': 'c4', 'startAngle': 4000*expAnglePerBase + 3*expAnglePerSpace, 'endAngle': 5000*expAnglePerBase + 3*expAnglePerSpace}
		];
		expect(circularKaryoCoords).toHaveSameAngles(expectedCoords);
	});
	it('getCircularKaryoCoords method is supposed to use the reverse property of filters', function(){
		wga.setData(data4);
		wga.setFilters(filters4_reverse);
		var circularKaryoCoords = wga.getCircularKaryoCoords();
		var expAnglePerBase = 2*Math.PI/(5000+4*defaultConf.circular.karyoDistance);
		var expAnglePerSpace = expAnglePerBase * defaultConf.circular.karyoDistance;
		var expectedCoords = [
		    {'karyo': 'c1', 'startAngle': 0, 'endAngle': 2000*expAnglePerBase},
		    {'karyo': 'c2', 'endAngle': 2000*expAnglePerBase + expAnglePerSpace, 'startAngle': 3000*expAnglePerBase + expAnglePerSpace},
		    {'karyo': 'c3', 'startAngle': 3000*expAnglePerBase + 2*expAnglePerSpace, 'endAngle': 4000*expAnglePerBase + 2*expAnglePerSpace},
		    {'karyo': 'c4', 'endAngle': 4000*expAnglePerBase + 3*expAnglePerSpace, 'startAngle': 5000*expAnglePerBase + 3*expAnglePerSpace}
		];
		expect(circularKaryoCoords).toHaveSameAngles(expectedCoords);
	});
});

describe('The drawCircularKaryo method of AliTV objects is supposed to draw karyos and color them according to their genome id', function(){
	var svg = $('<svg></svg>');
	var ali = new AliTV(svg);
	ali.setData(data);
	ali.setFilters(filters);
	it('drawCircularKaryo method is supposed to be a function', function(){
		expect(typeof ali.drawCircularKaryo).toEqual('function');
	});
	it('there should be exactly one karyoGroup in the simple test svg', function(){
		circularKaryoCoords = ali.getCircularKaryoCoords();
		ali.drawCircularKaryo(circularKaryoCoords);
		expect(ali.svgD3.selectAll('.karyoGroup').size()).toEqual(1);
	});
	it('the karyo group should be translated to the center of the svg', function(){
		circularKaryoCoords = ali.getCircularKaryoCoords();
		ali.drawCircularKaryo(circularKaryoCoords);
		expect(ali.svgD3.selectAll('.karyoGroup').attr("transform")).toEqual("translate(" + defaultConf.width / 2 + "," + defaultConf.height / 2 + ")");
	});
	it('there should be exactly two karyos in the simple test svg', function(){
		circularKaryoCoords = ali.getCircularKaryoCoords();
		ali.drawCircularKaryo(circularKaryoCoords);
		expect(ali.svgD3.selectAll('.karyo').size()).toEqual(2);
	});
	// TODO the following tests do not work as there is a svg d attribute created by D3
//	it('the drawn karyos have the expected outerRadius', function(){
//		circularKaryoCoords = ali.getCircularKaryoCoords();
//		ali.drawCircularKaryo(circularKaryoCoords);
//		// This test checks only the outerRadius attribute of the first selected element
//		expect(Number(ali.svgD3.selectAll('.karyo').attr("outerRadius"))).toEqual(defaultConf.circular.outerRadius);
//		console.log(ali.svgD3.selectAll('.karyo'));
//	});
//	it('the drawn karyos have the expected innerRadius', function(){
//		circularKaryoCoords = ali.getCircularKaryoCoords();
//		ali.drawCircularKaryo(circularKaryoCoords);
//		// This test checks only the innerRadius attribute of the first selected element
//		expect(Number(ali.svgD3.selectAll('.karyo').attr("innerRadius"))).toEqual(defaultConf.circular.outerRadius - defaultConf.circular.karyoHeight);
//	});
	it('there should be exactly four karyos in the more complex test svg', function(){
		ali.setData(data4);
		ali.setFilters(filters4);
		circularKaryoCoords = ali.getCircularKaryoCoords();
		ali.drawCircularKaryo(circularKaryoCoords);
		expect(ali.svgD3.selectAll('.karyo').size()).toEqual(4);
	});	
});

describe('The drawCircular method of AliTV objects is supposed to draw the circular layout', function(){
	var svg = $('<svg></svg>');
	var wga = new AliTV(svg);
	wga.setData(data2);
	wga.setFilters(filters2);
	it('drawCircular method is supposed to be a function', function(){
		expect(typeof wga.drawCircular).toEqual('function');
	});
	it('there should be exactly three karyos in the test svg', function(){
		wga.drawCircular();
		expect(wga.svgD3.selectAll('.karyo').size()).toEqual(3);
	});
});

describe('The getLinearLinkCoords method of AliTV objects is supposed to calculate coordinates for the links in the linear case and check if links are adjacent or not', function(){
	beforeEach(function() {
	    jasmine.addMatchers({
	    	toHaveSameCoordinates: function(util, customEqualityTesters) {
	    		return { 
	    			compare: function(actual, expected){
	    				var compare = function(a,b){
	    					return (a < b) ? -1 : 1;
	    				};
	    				actual.sort(compare);
	    				expected.sort(compare);
	    				var result = {pass: true};
	    				if(actual.length !== expected.length){
	    					result.pass = false;
	    					result.message = "arrays do not have the same number of objects";
	    				} else {
	    					var precision = 8;
	    					var factor = Math.pow(10, precision);
	    					for(var i=0; i<actual.length; i++){
	    						if(actual[i].linkID !== expected[i].linkID){
	    							result.pass = false;
	    							result.message = "mismatch in linkID: " + actual[i].linkID + " vs " + expected[i].linkID;
	    						}
	    						var source0Actual = {x :Math.round(actual[i].source0.x*factor)/factor, y: Math.round(actual[i].source0.y*factor)/factor};
	    						var source0Expected = {x :Math.round(expected[i].source0.x*factor)/factor, y: Math.round(expected[i].source0.y*factor)/factor};
	    						if((source0Actual.x !== source0Expected.x) || (source0Actual.y !== source0Expected.y)){
	    							result.pass = false;
	    							result.message = "mismatch in source0 of " + actual[i].linkID + ": (" +source0Actual.x +", "+ source0Actual.y +") vs ("+source0Expected.x +", "+  source0Expected.y+")";
	    						}
	    						var target0Actual = {x :Math.round(actual[i].target0.x*factor)/factor, y: Math.round(actual[i].target0.y*factor)/factor};
	    						var target0Expected = {x :Math.round(expected[i].target0.x*factor)/factor, y: Math.round(expected[i].target0.y*factor)/factor};
	    						if((target0Actual.x !== target0Expected.x) || (target0Actual.y !== target0Expected.y)){
	    							result.pass = false;
	    							result.message = "mismatch in target0 of " + actual[i].linkID + ": (" +target0Actual.x +", "+ target0Actual.y +") vs ("+target0Expected.x +", "+  target0Expected.y+")";
	    						}
	    						var source1Actual = {x :Math.round(actual[i].source1.x*factor)/factor, y: Math.round(actual[i].source1.y*factor)/factor};
	    						var source1Expected = {x :Math.round(expected[i].source1.x*factor)/factor, y: Math.round(expected[i].source1.y*factor)/factor};
	    						if((source1Actual.x !== source1Expected.x) || (source1Actual.y !== source1Expected.y)){
	    							result.pass = false;
	    							result.message = "mismatch in source1 of " + actual[i].linkID + ": (" +source1Actual.x +", "+ source1Actual.y +") vs ("+source1Expected.x +", "+  source1Expected.y+")";
	    						}
	    						var target1Actual = {x :Math.round(actual[i].target1.x*factor)/factor, y: Math.round(actual[i].target1.y*factor)/factor};
	    						var target1Expected = {x :Math.round(expected[i].target1.x*factor)/factor, y: Math.round(expected[i].target1.y*factor)/factor};
	    						if((target1Actual.x !== target1Expected.x) || (target1Actual.y !== target1Expected.y)){
	    							result.pass = false;
	    							result.message = "mismatch in target1 of " + actual[i].linkID + ": (" +target1Actual.x +", "+ target1Actual.y +") vs ("+target1Expected.x +", "+  target1Expected.y+")";
	    						}
	    						if(actual[i].adjacent !== expected[i].adjacent){
	    							result.pass = false;
	    							result.message = "wrong adjacency: " + actual[i].adjancy + " vs " + expected[i].adjacency;
	    						}
	    					}
	    				}
	    				return result;
	    			}
	    		};
	    	}
	    });
	});
	var svg = $('<svg></svg>');
	var ali = new AliTV(svg);
	it('getLinearLinkCoords method is supposed to be a function', function(){
		expect(typeof ali.getLinearLinkCoords).toEqual('function');
	});
	it('getLinearLinkCoords method is supposed to return a defined value even if coords is not set', function(){
		ali.setData(data);
		ali.setFilters(filters);
		var linearLinkCoords = ali.getLinearLinkCoords();
		expect(linearLinkCoords).toBeDefined();
	});
	it('getLinearLinkCoords method is supposed to work with simple test data (2 genomes, 2 chromosomes, 1 link)', function(){
		ali.setData(data);
		ali.setFilters(filters);
		var linearKaryoCoords = ali.getLinearKaryoCoords();
		var linearLinkCoords = ali.getLinearLinkCoords(linearKaryoCoords);
		var expectedCoords = [
            {
            	linkID : "l1",
            	source0: {x: 300/2000 * linearKaryoCoords[0].width, y: linearKaryoCoords[0].y + linearKaryoCoords[0].height + defaultConf.linear.linkKaryoDistance},
            	target0: {x: 100/1000 * linearKaryoCoords[1].width, y: linearKaryoCoords[1].y - defaultConf.linear.linkKaryoDistance}, 
            	source1: {x: 800/2000 * linearKaryoCoords[0].width, y: linearKaryoCoords[0].y + linearKaryoCoords[0].height + defaultConf.linear.linkKaryoDistance},
            	target1: {x: 600/1000 * linearKaryoCoords[1].width, y: linearKaryoCoords[1].y - defaultConf.linear.linkKaryoDistance},
            	adjacent: true
            }           
        ];
		expect(linearLinkCoords).toHaveSameCoordinates(expectedCoords);
	});
	it('getLinearLinkCoords method is supposed to work with simple test data (3 genomes, 3 chromosomes, 2 links)', function(){
		ali.setData({karyo:karyo4,features:features2, links:links2});
		ali.setFilters(filters4);
		var linearKaryoCoords = ali.getLinearKaryoCoords();
		var linearLinkCoords = ali.getLinearLinkCoords(linearKaryoCoords);
		var expectedCoords = [
		    {
		    	linkID : "l1", 
            	source0: {x: 300/2000 * linearKaryoCoords[0].width, y: linearKaryoCoords[0].y + linearKaryoCoords[0].height + defaultConf.linear.linkKaryoDistance},
            	target0: {x: 100/1000 * linearKaryoCoords[1].width, y: linearKaryoCoords[1].y - defaultConf.linear.linkKaryoDistance}, 
            	source1: {x: 800/2000 * linearKaryoCoords[0].width, y: linearKaryoCoords[0].y + linearKaryoCoords[0].height + defaultConf.linear.linkKaryoDistance},
            	target1: {x: 600/1000 * linearKaryoCoords[1].width, y: linearKaryoCoords[1].y - defaultConf.linear.linkKaryoDistance},
            	adjacent: true
	        }, 
		    {
		    	linkID : "l2",
		    	source0: {x: 100/1000 * linearKaryoCoords[1].width, y: linearKaryoCoords[1].y + linearKaryoCoords[1].height + defaultConf.linear.linkKaryoDistance},
            	target0: {x: 400/1000 * linearKaryoCoords[3].width, y: linearKaryoCoords[3].y - defaultConf.linear.linkKaryoDistance}, 
            	source1: {x: 600/1000 * linearKaryoCoords[1].width, y: linearKaryoCoords[1].y + linearKaryoCoords[1].height + defaultConf.linear.linkKaryoDistance},
            	target1: {x: 900/1000 * linearKaryoCoords[3].width, y: linearKaryoCoords[3].y - defaultConf.linear.linkKaryoDistance},
            	adjacent: true
	        }  
		];
		expect(linearLinkCoords).toHaveSameCoordinates(expectedCoords);
	});
	it('getLinearLinkCoords method is supposed to work with simple test data (2 genomes, 3 chromosomes, 2 links (one link is reverse complemented)', function(){
		ali.setData({karyo:karyo4, links:links3, features:features2});
		ali.setFilters(filters4);
		var linearKaryoCoords = ali.getLinearKaryoCoords();
		var linearLinkCoords = ali.getLinearLinkCoords(linearKaryoCoords);
		var expectedCoords = [
		    {
		    	linkID : "l1", 
            	source0: {x: 300/2000 * linearKaryoCoords[0].width, y: linearKaryoCoords[0].y + linearKaryoCoords[0].height + defaultConf.linear.linkKaryoDistance},
            	target0: {x: 100/1000 * linearKaryoCoords[1].width, y: linearKaryoCoords[1].y - defaultConf.linear.linkKaryoDistance}, 
            	source1: {x: 800/2000 * linearKaryoCoords[0].width, y: linearKaryoCoords[0].y + linearKaryoCoords[0].height + defaultConf.linear.linkKaryoDistance},
            	target1: {x: 600/1000 * linearKaryoCoords[1].width, y: linearKaryoCoords[1].y - defaultConf.linear.linkKaryoDistance},
            	adjacent: true
		    },
		    {
		    	linkID: "l2",
		    	source0: {x: 1800/2000 * linearKaryoCoords[0].width, y: linearKaryoCoords[0].y + linearKaryoCoords[0].height + defaultConf.linear.linkKaryoDistance},
		    	target0: {x: 900/1000 * linearKaryoCoords[2].width + linearKaryoCoords[2].x, y: linearKaryoCoords[2].y - defaultConf.linear.linkKaryoDistance},
		    	source1: {x: 1900/2000 * linearKaryoCoords[0].width, y: linearKaryoCoords[0].y + linearKaryoCoords[0].height + defaultConf.linear.linkKaryoDistance},
		    	target1: {x: 800/1000 * linearKaryoCoords[2].width + linearKaryoCoords[2].x, y: linearKaryoCoords[2].y - defaultConf.linear.linkKaryoDistance},
		    	adjacent: true
		    }
		];
		expect(linearLinkCoords).toHaveSameCoordinates(expectedCoords);
	});
	it('getLinearLinkCoords method is supposed to work with simple test data (3 genomes, 2 chromosomes, 2 links (but one link is not between adjacent chromosomes, later it should not be drawn)', function(){
		ali.setData({karyo:karyo4,features:features2, links:links4});
		ali.setFilters(filters4);
		var linearKaryoCoords = ali.getLinearKaryoCoords();
		var linearLinkCoords = ali.getLinearLinkCoords(linearKaryoCoords);
		var expectedCoords = [
		{
			linkID : "l1", 
        	source0: {x: 300/2000 * linearKaryoCoords[0].width, y: linearKaryoCoords[0].y + linearKaryoCoords[0].height + defaultConf.linear.linkKaryoDistance},
        	target0: {x: 100/1000 * linearKaryoCoords[1].width, y: linearKaryoCoords[1].y - defaultConf.linear.linkKaryoDistance}, 
        	source1: {x: 800/2000 * linearKaryoCoords[0].width, y: linearKaryoCoords[0].y + linearKaryoCoords[0].height + defaultConf.linear.linkKaryoDistance},
        	target1: {x: 600/1000 * linearKaryoCoords[1].width, y: linearKaryoCoords[1].y - defaultConf.linear.linkKaryoDistance},
        	adjacent: true
		},
		{
			linkID: "l2",
	    	source0: {x: 100/1000 * linearKaryoCoords[1].width, y: linearKaryoCoords[1].y + linearKaryoCoords[1].height + defaultConf.linear.linkKaryoDistance},
	    	target0: {x: 400/1000 * linearKaryoCoords[3].width, y: linearKaryoCoords[3].y - defaultConf.linear.linkKaryoDistance},
	    	source1: {x: 600/1000 * linearKaryoCoords[1].width, y: linearKaryoCoords[1].y + linearKaryoCoords[1].height + defaultConf.linear.linkKaryoDistance},
	    	target1: {x: 900/1000 * linearKaryoCoords[3].width, y: linearKaryoCoords[3].y - defaultConf.linear.linkKaryoDistance},
	    	adjacent: true
		}
		];
		expect(linearLinkCoords).toHaveSameCoordinates(expectedCoords);
	});
	it('getLinearLinkCoords method is supposed to work with simple test data (3 genomes, 2 chromosomes, 2 links (but one link is not between adjacent chromosomes, but it is drawn because the user set conf.drawAllLinks on true)', function(){
		ali.setData({karyo:karyo4,features:features2, links:links4});
		ali.setFilters(filters4);
		ali.conf.linear.drawAllLinks = true;
		var linearKaryoCoords = ali.getLinearKaryoCoords();
		var linearLinkCoords = ali.getLinearLinkCoords(linearKaryoCoords);
		var expectedCoords = [
		{
			linkID : "l1", 
        	source0: {x: 300/2000 * linearKaryoCoords[0].width, y: linearKaryoCoords[0].y + linearKaryoCoords[0].height + defaultConf.linear.linkKaryoDistance},
        	target0: {x: 100/1000 * linearKaryoCoords[1].width, y: linearKaryoCoords[1].y - defaultConf.linear.linkKaryoDistance}, 
        	source1: {x: 800/2000 * linearKaryoCoords[0].width, y: linearKaryoCoords[0].y + linearKaryoCoords[0].height + defaultConf.linear.linkKaryoDistance},
        	target1: {x: 600/1000 * linearKaryoCoords[1].width, y: linearKaryoCoords[1].y - defaultConf.linear.linkKaryoDistance},
        	adjacent: true
		},
		{
			linkID: "l2",
	    	source0: {x: 100/1000 * linearKaryoCoords[1].width, y: linearKaryoCoords[1].y + linearKaryoCoords[1].height + defaultConf.linear.linkKaryoDistance},
	    	target0: {x: 400/1000 * linearKaryoCoords[3].width, y: linearKaryoCoords[3].y - defaultConf.linear.linkKaryoDistance},
	    	source1: {x: 600/1000 * linearKaryoCoords[1].width, y: linearKaryoCoords[1].y + linearKaryoCoords[1].height + defaultConf.linear.linkKaryoDistance},
	    	target1: {x: 900/1000 * linearKaryoCoords[3].width, y: linearKaryoCoords[3].y - defaultConf.linear.linkKaryoDistance},
	    	adjacent: true
		},
		{
			linkID: "l3",
			source0: {x: 300/2000 * linearKaryoCoords[0].width, y: linearKaryoCoords[0].y + linearKaryoCoords[0].height + defaultConf.linear.linkKaryoDistance},
			target0: {x: 400/1000 * linearKaryoCoords[3].width, y: linearKaryoCoords[3].y - defaultConf.linear.linkKaryoDistance},
			source1: {x: 800/2000 * linearKaryoCoords[0].width, y: linearKaryoCoords[0].y + linearKaryoCoords[0].height + defaultConf.linear.linkKaryoDistance},
			target1: {x: 900/1000 * linearKaryoCoords[3].width, y: linearKaryoCoords[3].y - defaultConf.linear.linkKaryoDistance},
			adjacent: false
		}
		];
		expect(linearLinkCoords).toHaveSameCoordinates(expectedCoords);
	});
});

describe('The drawLinearLinks method of AliTV objects is supposed to draw links in the linear layout, for an alignment with more than two different genomes only adjacent links should be drawn', function(){
	var svg = $('<svg></svg>');
	var ali = new AliTV(svg);

	it('drawLinearLinks method is supposed to be a function', function(){
		expect(typeof ali.drawLinearLinks).toEqual('function');
	});
	
	it('there should be exactly one link and two karyos in the simple test svg', function(){
		ali.setData(data);
		ali.setFilters(filters);
		var linearKaryoCoords = ali.getLinearKaryoCoords();
		var linearLinkCoords = ali.getLinearLinkCoords(linearKaryoCoords);
		ali.drawLinearKaryo(linearKaryoCoords);
		ali.drawLinearLinks(linearLinkCoords);
		expect(ali.svgD3.selectAll('.karyo').size()).toEqual(2);
		expect(ali.svgD3.selectAll('.link').size()).toEqual(1);
	});
	it('there should be exactly two links and three chromosomes in the simple test svg', function(){
		ali.setData({karyo:karyo5,features:features3, links:links5});
		ali.setFilters(filters5);
		var linearKaryoCoords = ali.getLinearKaryoCoords();
		var linearLinkCoords = ali.getLinearLinkCoords(linearKaryoCoords);
		ali.drawLinearKaryo(linearKaryoCoords);
		ali.drawLinearLinks(linearLinkCoords);
		expect(ali.svgD3.selectAll('.karyo').size()).toEqual(3);
		expect(ali.svgD3.selectAll('.link').size()).toEqual(2);
	});
	it('there should be exactly three karyos ad one links in the simple test svg (actual there are exactly two links, but only one is drawn because the second one is not an adjacent link)', function(){
		ali.setData({karyo:karyo5,features:features4, links:links6});
		ali.setFilters(filters5);
		var linearKaryoCoords = ali.getLinearKaryoCoords();
		var linearLinkCoords = ali.getLinearLinkCoords(linearKaryoCoords);
		ali.drawLinearKaryo(linearKaryoCoords);
		ali.drawLinearLinks(linearLinkCoords);
		expect(ali.svgD3.selectAll('.karyo').size()).toEqual(3);
		expect(ali.svgD3.selectAll('.link').size()).toEqual(1);
	});
});

describe('The colorLinkByIdentity method of AliTV objects is supposed to color links according to their identity value', function(){
	var svg = $('<svg></svg>');
	var ali = new AliTV(svg);
	
	it('colorLinksByIdentity method is supposed to be a function', function(){
		expect(typeof ali.colorLinksByIdentity).toEqual('function');
	});
	it('the colorLinksByIdentity method is supposed to return the color "#d21414" because the function get an identity of 0', function(){
		expect(ali.colorLinksByIdentity(0)).toEqual("#d21414");		
	});
	it('the colorLinksByIdentity method is supposed to return the color "#1DAD0A" because the function get an identity of 100', function(){
		expect(ali.colorLinksByIdentity(100)).toEqual("#1dad0a");		
	});
});

describe('The colorKaryoByGenome method of AliTV objects is supposed to color karyos according to their genome_id', function(){
	var svg = $('<svg></svg>');
	var ali = new AliTV(svg);
	
	it('colorKaryoByGenome method is supposed to be a function', function(){
		expect(typeof ali.colorKaryoByGenomeId).toEqual('function');
	});
	it('the colorKaryoByGenomeId method is supposed to return the color "#49006a" because the function get a genomeId of 0', function(){
		ali.setData(data);
		ali.setFilters(filters);
		expect(ali.colorKaryoByGenomeId(0)).toEqual(defaultConf.linear.startLineColor);		
	});
});

describe('The addLinearTicks method is supposed to add ticks and tick labels next to the karyos indicating th position on the corresponding chromosome', function(){
	var svg = $('<svg></svg>');
	var ali = new AliTV(svg);
	
	it('addLinearTicks method is supposed to be a function', function(){
		expect(typeof ali.addLinearTicks).toEqual('function');
	});
});


