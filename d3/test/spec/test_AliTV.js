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
			tickDistance: 100
		},
		circular: {
			karyoHeight: 30,
			karyoDistance: 10,
			linkKaryoDistance: 10,
			outerRadius: 450,
			tickDistance: 100,
			tickSize: 5
		},
		minLinkIdentity: 40,
		maxLinkIdentity: 100,
		midLinkIdentity: 60,
		minLinkIdentityColor: "#D21414",
		maxLinkIdentityColor: "#1DAD0A",
		midLinkIdentityColor: "#FFEE05"
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
	it('there should be exactly three karyos, ticks (depend on tickDistance) and one link in the test svg', function(){	
		var karyoCoords = wga.getLinearKaryoCoords();
		var ticks = wga.getLinearTickCoords(karyoCoords);
		wga.drawLinearTicks(ticks, karyoCoords);
		wga.drawLinearKaryo(karyoCoords);
		var linkCoords = wga.getLinearLinkCoords(karyoCoords);
		wga.drawLinearLinks(linkCoords);
		
		var totalTicks = 0;
		$.each(karyoCoords, function(key, value){
			var tickFrequency = wga.data.karyo.chromosomes[value.karyo].length / wga.conf.linear.tickDistance;
			totalTicks += tickFrequency + 1;
		});
		
		expect(wga.svgD3.selectAll('.link').size()).toEqual(1);
		expect(wga.svgD3.selectAll('.karyo').size()).toEqual(3);
		expect(wga.svgD3.selectAll('.tick').size()).toEqual(totalTicks);
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

describe('The getCircularTickCoords method of AliTV objects is supposed to calculate tick coordinates for the circular layout', function(){
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
	    						var a = Math.round(actual[i]*factor)/factor;
	    						var e = Math.round(expected[i]*factor)/factor;
	    						if(a !== e){
	    							result.pass = false;
	    							result.message = "mismatch at index " + i + ": " + a + " vs " + e;
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
	it('getCircularTickCoords method is supposed to be a function', function(){
		expect(typeof ali.getCircularTickCoords).toEqual('function');
	});
	it('getCircularTickCoords method is supposed to return circularTickCoords', function(){
		ali.setData(data);
		ali.setFilters(filters);
		var circularKaryoCoords = ali.getCircularKaryoCoords();
		var circularTickCoords = ali.getCircularTickCoords(circularKaryoCoords);
		expect(circularTickCoords).toBeDefined();
	});
	it('getCircularTickCoords method is supposed to return the correct angles in the simple case (2 chromosomes)', function(){
		ali.setData(data);
		ali.setFilters(filters);
		var circularKaryoCoords = ali.getCircularKaryoCoords();
		var circularTickCoords = ali.getCircularTickCoords(circularKaryoCoords);
		var c0total = circularKaryoCoords[0].endAngle - circularKaryoCoords[0].startAngle;
		var c0start = circularKaryoCoords[0].startAngle;
		var c1total = circularKaryoCoords[1].endAngle - circularKaryoCoords[1].startAngle;
		var c1start = circularKaryoCoords[1].startAngle;
		var expectedCoords = [];
		var chrpos = 0;
		while (chrpos <= ali.data.karyo.chromosomes[circularKaryoCoords[0].karyo].length){
			expectedCoords.push(c0start + c0total * (chrpos/2000));
			chrpos += defaultConf.circular.tickDistance;
		}
		chrpos = 0;
		while (chrpos <= ali.data.karyo.chromosomes[circularKaryoCoords[1].karyo].length){
			expectedCoords.push(c1start + c1total * (chrpos/1000));
			chrpos += defaultConf.circular.tickDistance;
		}
		expect(circularTickCoords).toHaveSameCoordinates(expectedCoords);
	});
});

describe('The drawCircularTicks method is supposed to add ticks to the karyos in the circular layout', function(){
	var svg = $('<svg></svg>');
	var ali = new AliTV(svg);
	it('drawCircularTicks method is supposed to be a function', function(){
		expect(typeof ali.drawCircularTicks).toEqual('function');
	});
	it('drawCircularTicks method is supposed to draw ticks', function(){
		ali.setData(data);
		ali.setFilters(filters);
		var ckc = ali.getCircularKaryoCoords();
		var ctc = ali.getCircularTickCoords(ckc);
		ali.drawCircularTicks(ctc);
		expect(ali.svgD3.selectAll(".tickGroup").size()).toEqual(1);
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
	it('there should be exactly three karyos and one link in the test svg', function(){
		wga.drawCircular();
		expect(wga.svgD3.selectAll('.karyo').size()).toEqual(3);
		expect(wga.svgD3.selectAll('.link').size()).toEqual(1);
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

describe('The getCircularLinkCoords method of AliTV objects is supposed to calculate coordinates for the links in the circular layout', function(){
	beforeEach(function() {
	    jasmine.addMatchers({
	    	toHaveSameCoordinates: function(util, customEqualityTesters) {
	    		return { 
	    			compare: function(actual, expected){
	    				var comp = function(a,b){
	    					return (a < b) ? -1 : 1;
	    				};
	    				actual.sort(comp);
	    				expected.sort(comp);
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
	    						var sourceActual = {startAngle: Math.round(actual[i].source.startAngle*factor)/factor, endAngle: Math.round(actual[i].source.endAngle*factor)/factor};
	    						var sourceExpected = {startAngle: Math.round(expected[i].source.startAngle*factor)/factor, endAngle: Math.round(expected[i].source.endAngle*factor)/factor};
	    						if((sourceActual.startAngle !== sourceExpected.startAngle) || (sourceActual.endAngle !== sourceExpected.endAngle)){
	    							result.pass = false;
	    							result.message = "mismatch in source of " + actual[i].linkID + ": (" +sourceActual.startAngle +", "+ sourceActual.endAngle +") vs ("+sourceExpected.startAngle +", "+  sourceExpected.endAngle+")";
	    						}
	    						var targetActual = {startAngle: Math.round(actual[i].target.startAngle*factor)/factor, endAngle: Math.round(actual[i].target.endAngle*factor)/factor};
	    						var targetExpected = {startAngle: Math.round(expected[i].target.startAngle*factor)/factor, endAngle: Math.round(expected[i].target.endAngle*factor)/factor};
	    						if((targetActual.startAngle !== targetExpected.startAngle) || (targetActual.endAngle !== targetExpected.endAngle)){
	    							result.pass = false;
	    							result.message = "mismatch in target of " + actual[i].linkID + ": (" +targetActual.startAngle +", "+ targetActual.endAngle +") vs ("+targetExpected.startAngle +", "+  targetExpected.endAngle+")";
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
	it('getCircularLinkCoords method is supposed to be a function', function(){
		expect(typeof ali.getCircularLinkCoords).toEqual('function');
	});
	it('getCircularLinkCoords method is supposed to return a defined value even if coords is not set', function(){
		ali.setData(data);
		ali.setFilters(filters);
		var circularLinkCoords = ali.getCircularLinkCoords();
		expect(circularLinkCoords).toBeDefined();
	});
	it('getCircularLinkCoords method is supposed to work with simple test data (2 genomes, 2 chromosomes, 1 link)', function(){
		ali.setData(data);
		ali.setFilters(filters);
		var circularKaryoCoords = ali.getCircularKaryoCoords();
		var circularLinkCoords = ali.getCircularLinkCoords(circularKaryoCoords);
		var expectedCoords = [
            {
            	linkID : "l1",
            	source: {
            		startAngle: circularKaryoCoords[0].startAngle + (300/2000 * (circularKaryoCoords[0].endAngle - circularKaryoCoords[0].startAngle)), 
            		endAngle: circularKaryoCoords[0].startAngle + (800/2000 * (circularKaryoCoords[0].endAngle - circularKaryoCoords[0].startAngle))
            		},
            	target: {
            		startAngle: circularKaryoCoords[1].startAngle + (100/1000 * (circularKaryoCoords[1].endAngle - circularKaryoCoords[1].startAngle)), 
            		endAngle: circularKaryoCoords[1].startAngle + (600/1000 * (circularKaryoCoords[1].endAngle - circularKaryoCoords[1].startAngle))
            		}
            }           
        ];
		expect(circularLinkCoords).toHaveSameCoordinates(expectedCoords);
	});
	it('getCircularLinkCoords method is supposed to work with simple test data (3 genomes, 4 chromosomes, 3 links)', function(){
		ali.setData({karyo:karyo4,features:features2, links:links4});
		ali.setFilters(filters4);
		var circularKaryoCoords = ali.getCircularKaryoCoords();
		var circularLinkCoords = ali.getCircularLinkCoords(circularKaryoCoords);
		var expectedCoords = [
            {
            	linkID : "l1",
            	source: {
            		startAngle: circularKaryoCoords[0].startAngle + (300/2000 * (circularKaryoCoords[0].endAngle - circularKaryoCoords[0].startAngle)), 
            		endAngle: circularKaryoCoords[0].startAngle + (800/2000 * (circularKaryoCoords[0].endAngle - circularKaryoCoords[0].startAngle))
            		},
            	target: {
            		startAngle: circularKaryoCoords[1].startAngle + (100/1000 * (circularKaryoCoords[1].endAngle - circularKaryoCoords[1].startAngle)), 
            		endAngle: circularKaryoCoords[1].startAngle + (600/1000 * (circularKaryoCoords[1].endAngle - circularKaryoCoords[1].startAngle))
            		}
            },
            {
            	linkID : "l2",
            	source: {
            		startAngle: circularKaryoCoords[1].startAngle + (100/1000 * (circularKaryoCoords[1].endAngle - circularKaryoCoords[1].startAngle)), 
            		endAngle: circularKaryoCoords[1].startAngle + (600/1000 * (circularKaryoCoords[1].endAngle - circularKaryoCoords[1].startAngle))
            		},
            	target: {
            		startAngle: circularKaryoCoords[3].startAngle + (400/1000 * (circularKaryoCoords[3].endAngle - circularKaryoCoords[3].startAngle)), 
            		endAngle: circularKaryoCoords[3].startAngle + (900/1000 * (circularKaryoCoords[3].endAngle - circularKaryoCoords[3].startAngle))
            		}
            },
            {
            	linkID : "l3",
            	source: {
            		startAngle: circularKaryoCoords[0].startAngle + (300/2000 * (circularKaryoCoords[0].endAngle - circularKaryoCoords[0].startAngle)), 
            		endAngle: circularKaryoCoords[0].startAngle + (800/2000 * (circularKaryoCoords[0].endAngle - circularKaryoCoords[0].startAngle))
            		},
            	target: {
            		startAngle: circularKaryoCoords[3].startAngle + (400/1000 * (circularKaryoCoords[3].endAngle - circularKaryoCoords[3].startAngle)), 
            		endAngle: circularKaryoCoords[3].startAngle + (900/1000 * (circularKaryoCoords[3].endAngle - circularKaryoCoords[3].startAngle))
            		}
            }
        ];
		expect(circularLinkCoords).toHaveSameCoordinates(expectedCoords);
	});
});

describe('The drawCircularLinks method of AliTV objects is supposed to draw links in the circular layout', function(){
	var svg = $('<svg></svg>');
	var ali = new AliTV(svg);

	it('drawCircularLinks method is supposed to be a function', function(){
		expect(typeof ali.drawCircularLinks).toEqual('function');
	});
	
	it('there should be exactly one link and two karyos in the simple test svg', function(){
		ali.setData(data);
		ali.setFilters(filters);
		var circularKaryoCoords = ali.getCircularKaryoCoords();
		var circularLinkCoords = ali.getCircularLinkCoords(circularKaryoCoords);
		ali.drawCircularKaryo(circularKaryoCoords);
		ali.drawCircularLinks(circularLinkCoords);
		expect(ali.svgD3.selectAll('.karyo').size()).toEqual(2);
		expect(ali.svgD3.selectAll('.link').size()).toEqual(1);
	});
	it('there should be exactly two links and three chromosomes in the simple test svg', function(){
		ali.setData({karyo:karyo5,features:features3, links:links5});
		ali.setFilters(filters5);
		var circularKaryoCoords = ali.getCircularKaryoCoords();
		var circularLinkCoords = ali.getCircularLinkCoords(circularKaryoCoords);
		ali.drawCircularKaryo(circularKaryoCoords);
		ali.drawCircularLinks(circularLinkCoords);
		expect(ali.svgD3.selectAll('.karyo').size()).toEqual(3);
		expect(ali.svgD3.selectAll('.link').size()).toEqual(2);
	});
	it('there should be exactly three karyos and two links in the simple test svg', function(){
		ali.setData({karyo:karyo5,features:features4, links:links6});
		ali.setFilters(filters5);
		var circularKaryoCoords = ali.getCircularKaryoCoords();
		var circularLinkCoords = ali.getCircularLinkCoords(circularKaryoCoords);
		ali.drawCircularKaryo(circularKaryoCoords);
		ali.drawCircularLinks(circularLinkCoords);
		expect(ali.svgD3.selectAll('.karyo').size()).toEqual(3);
		expect(ali.svgD3.selectAll('.link').size()).toEqual(2);
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

describe('The getLinearTickCoords method is supposed to calculate coords for the linear ticks', function(){
	var svg = $('<svg></svg>');
	var ali = new AliTV(svg);
	it('getLinearTickCoords method is supposed to be a function', function(){
		expect(typeof ali.getLinearTickCoords).toEqual('function');
	});
	
	it('getLinearTickCoords method is supposed to calculate the same coords as the expected coords', function(){
		ali.setData({karyo:karyo6});
		ali.setFilters(filters6);
		var linearKaryoCoords = ali.getLinearKaryoCoords();
		var ticks = ali.getLinearTickCoords(linearKaryoCoords);
		var expectedTicks = [{ x1: 0, y1: -5, x2: 0, y2: 35 }, { x1: 50, y1: -5, x2: 50, y2: 35 }, { x1: 100, y1: -5, x2: 100, y2: 35 }, { x1: 150, y1: -5, x2: 150, y2: 35 }, { x1: 200, y1: -5, x2: 200, y2: 35 }, { x1: 250, y1: -5, x2: 250, y2: 35 }, { x1: 300, y1: -5, x2: 300, y2: 35 }, { x1: 350, y1: -5, x2: 350, y2: 35 }, { x1: 400, y1: -5, x2: 400, y2: 35 }, { x1: 450, y1: -5, x2: 450, y2: 35 }, { x1: 500, y1: -5, x2: 500, y2: 35 }, { x1: 550, y1: -5, x2: 550, y2: 35 }, { x1: 600, y1: -5, x2: 600, y2: 35 }, { x1: 650, y1: -5, x2: 650, y2: 35 }, { x1: 700, y1: -5, x2: 700, y2: 35 }, { x1: 750, y1: -5, x2: 750, y2: 35 }, { x1: 800, y1: -5, x2: 800, y2: 35 }, { x1: 850, y1: -5, x2: 850, y2: 35 }, { x1: 900, y1: -5, x2: 900, y2: 35 }, { x1: 950, y1: -5, x2: 950, y2: 35 }, { x1: 1000, y1: -5, x2: 1000, y2: 35 }];
		
		expect(ticks).toEqual(expectedTicks);		
	});
});

describe('The fadeOutLinks method is called by a mouse pointer event and is supposed to fade out all links except the links of the chromosome the mouse points to', function(){
	var svg = $('<svg></svg>');
	var ali = new AliTV(svg);
	beforeEach(function(done){
		ali.setData({karyo:karyo5, features: features3, links: links4});
		ali.setFilters(filters5);
		ali.drawLinear();
		done();
	});

	it('fadeOutLinks method is supposed to be a function', function(){
		expect(typeof ali.fadeLinks).toEqual('function');
	});
	
	it("if the mouse pointer enters a chromosome links are filtered and there opacity would be set on 0.1", function(done) {
		 var spyEvent = spyOnEvent('.karyo', 'mouseover');
		 //ali.svg.find('.karyo').get(2).dispatchEvent(new MouseEvent("mouseover"));
			ali.svg.find('.karyo').eq(2).d3Trigger("mouseover");
			setTimeout(function(){
				expect(ali.svg.find('.link').css("opacity")).toEqual("0.1");
				done();
			}, 1000);
	 });
	
	it("if the mouse pointer leaves a chromsome the link opacity is set back to 1", function(done) {
		 var spyEvent = spyOnEvent('.karyo', 'mouseout');
		 ali.svg.find('.karyo').d3Trigger("mouseover");
			setTimeout(function(){
				expect(ali.svg.find('.link').css("opacity")).toEqual("0.1");
				ali.svg.find('.karyo').eq(2).d3Trigger("mouseout");
				setTimeout(function(){
					expect(ali.svg.find('.link').css("opacity")).toEqual("1");			
					done();
				}, 1000);				
			}, 1000);
	 });
	
});

describe('The drawLinearTicks method is supposed to draw ticks in the linear layout', function(){
	var svg = $('<svg></svg>');
	var ali = new AliTV(svg);
	it('drawLinearTicks method is supposed to be a function', function(){
		expect(typeof ali.drawLinearTicks).toEqual('function');
	});
	
	it('the svg should contain exactly 21 ticks', function(){
		ali.setData({karyo:karyo6});
		ali.setFilters(filters6);
		var linearKaryoCoords = ali.getLinearKaryoCoords();
		var ticks = ali.getLinearTickCoords(linearKaryoCoords);
		ali.drawLinearTicks(ticks, linearKaryoCoords);
		expect(ali.svgD3.selectAll('.tick').size()).toEqual(21);
	});
	
});

describe('A left mouseclick on a chromosome should change the reverse information of this chromosome', function(){
	var svg = $('<svg></svg>');
	var ali = new AliTV(svg);
	ali.setData(data);
	ali.setFilters(filters);
	
	it('if the current reverse information is false after the click event it should be true', function(done){	
		ali.filters.karyo.chromosomes.c1.reverse = false;
		ali.drawLinear();
		ali.svg.find('.karyo').eq(0).d3Trigger("click");
		setTimeout(function(){
			expect(ali.filters.karyo.chromosomes.c1.reverse).toEqual(true);
			done();
		}, 1000);
	});
	it('if the current reverse information is true after the click event it should be false', function(done){	
		ali.filters.karyo.chromosomes.c1.reverse = true;
		ali.drawLinear();
		ali.svg.find('.karyo').eq(0).d3Trigger("click");
		setTimeout(function(){
			expect(ali.filters.karyo.chromosomes.c1.reverse).toEqual(false);
			done();
		}, 1000);
	});
	it('if the current reverse information is false, after the click it should be true and in the karyoCoords the x-value and the width should be changed', function(done){
		ali.filters.karyo.chromosomes.c1.reverse = false;
		ali.drawLinear();
		ali.svg.find('.karyo').eq(0).d3Trigger("click");		
		var linearKaryoCoords = ali.getLinearKaryoCoords();
		
		var expectedCoords = [
		                      {'karyo': 'c1', 'x': 0 + defaultConf.width, 'y': 0, 'width': defaultConf.width * (-1), 'height': defaultConf.linear.karyoHeight, 'genome': 0},
		                      {'karyo': 'c2', 'x': 0, 'y': defaultConf.linear.genomeDistance, 'width': defaultConf.width/2, 'height': defaultConf.linear.karyoHeight, 'genome': 1}
		                      ];
		
		setTimeout(function(){
			expect(expectedCoords).toEqual(linearKaryoCoords);
			done();
		}, 1000);
	});
	it('if the current reverse information is true, after the click it should be false and in the karyoCoords the x-value and the width should be set back', function(done){
		ali.filters.karyo.chromosomes.c1.reverse = true;
		ali.drawLinear();
		ali.svg.find('.karyo').eq(0).d3Trigger("click");		
		var linearKaryoCoords = ali.getLinearKaryoCoords();
		
		var expectedCoords = [
		                      {'karyo': 'c1', 'x': 0, 'y': 0, 'width': defaultConf.width, 'height': defaultConf.linear.karyoHeight, 'genome': 0},
		                      {'karyo': 'c2', 'x': 0, 'y': defaultConf.linear.genomeDistance, 'width': defaultConf.width/2, 'height': defaultConf.linear.karyoHeight, 'genome': 1}
		                      ];
		setTimeout(function(){
			expect(expectedCoords).toEqual(linearKaryoCoords);
			done();
		}, 1000);
	});
	it('after the click event the reverse information is true and source0 and source1 should be changed', function(done){
		ali.filters.karyo.chromosomes.c1.reverse = false;
		ali.drawLinear();
		ali.svg.find('.karyo').eq(0).d3Trigger("click");
		var linearKaryoCoords = ali.getLinearKaryoCoords();
		var linearLinkCoords = ali.getLinearLinkCoords(linearKaryoCoords);
		var expectedLinks = [{ linkID: 'l1', source0: { x: 850, y: 40 }, source1: { x: 600, y: 40 }, target0: { x: 50, y: 290 }, target1: { x: 300, y: 290 }, adjacent: true }];
		
		setTimeout(function(){
			expect(expectedLinks).toEqual(linearLinkCoords);
			done();
		}, 1000);
	});
});

describe('The getLinearSpacer method is supposed to get the information of the spacer between to karyos of the description field in the HTML page', function(){
	var svg = $('<svg></svg>');
	var ali = new AliTV(svg);
	
	it('getLinearSpacer method is supposed to be a function', function(){
		expect(typeof ali.getLinearSpacer).toEqual('function');
	});	
	it('the function should return a defined value', function(){
		var spacer = ali.getLinearSpacer();
		expect(spacer).toBeDefined();
	});
	it('the function should return the spacer of the defaultConf', function(){
		var spacer = ali.getLinearSpacer();
		expect(spacer).toEqual(defaultConf.linear.karyoDistance);
	});
});
	

describe('The setLinearSpacer method is supposed to set the new information of the karyoDistance in the conf object', function(){
	var svg = $('<svg></svg>');
	var ali = new AliTV(svg);
	it('setLinearSpacer method is supposed to be a function', function(){
		expect(typeof ali.setLinearSpacer).toEqual('function');
	});	
	it('the returned spacer of the getLinearSpacer method should be the same as the spacer which is set and returned by the setter-method', function(){
		var returnedSpacer = 50;
		expect(ali.setLinearSpacer(returnedSpacer)).toEqual(50);
	});	
	it('when setLinearSpacer is called several times the spacer should have the same value as the returned spacer of getLinearSpacer method', function(){
		ali.setLinearSpacer(12);
		expect(ali.getLinearSpacer()).toEqual(50);
		ali.setLinearSpacer(100);
		expect(ali.getLinearSpacer()).toEqual(50);
		ali.setLinearSpacer(20);
		expect(ali.getLinearSpacer()).toEqual(20);
	});	
	it('the returned Spacer of the getLinearSpacer method should throw an error message if the spacer is empty', function(){
		var returnedSpacer = "";
		expect(function(){ali.setLinearSpacer(returnedSpacer);}).toThrow("test");
	});
});
	


