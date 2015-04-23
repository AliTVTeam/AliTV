var defaultConf =  {
		width: 1000,
		height: 1000,
		linear: {
			genomeDistance: 300,
			karyoHeight: 30,
			karyoDistance: 10
		},
		circular: {
			karyoHeight: 30,
			karyoDistance: 10,
			outerRadius: 450
		}
};

describe('The constructor is supposed a proper WgaPipeline object', function(){
	it('Constructor wgaPipeline exists', function(){
		expect(WgaPipeline).toBeDefined();
	});
	var svg = $('<svg></svg>');
	var wga = new WgaPipeline(svg);
	it('WgaPipelie object is not null', function(){
		expect(wga).not.toBeNull();
	});
	it('WgaPipelie object should be an instance of WgaPipeline class', function(){
		expect(wga instanceof WgaPipeline).toBeTruthy();
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
		'order': ['c1', 'c2'],
		'genome_order': [0, 1],
		'chromosomes': {
			'c1': {'genome_id': 0, 'length': 2000, 'rc': false, 'seq': null},
			'c2': {'genome_id': 1, 'length': 1000, 'rc': false, 'seq': null}
		}
};
var karyo2 = {
		'order': ['c1', 'c2', 'c3'],
		'genome_order': [0, 1],
		'chromosomes': {
			'c1': {'genome_id': 0, 'length': 2000, 'rc': false, 'seq': null},
			'c2': {'genome_id': 1, 'length': 1000, 'rc': false, 'seq': null},
			'c3': {'genome_id': 1, 'length': 1000, 'rc': false, 'seq': null}
		}
};
var karyo3 = {
		'order': ['c1', 'c2', 'c3'],
		'genome_order': [0, 1, 2],
		'chromosomes': {
			'c1': {'genome_id': 0, 'length': 2000, 'rc': false, 'seq': null},
			'c2': {'genome_id': 1, 'length': 1000, 'rc': false, 'seq': null},
			'c3': {'genome_id': 2, 'length': 1000, 'rc': false, 'seq': null}
		}
};
var karyo4 = {
		'order': ['c1', 'c2', 'c3', 'c4'],
		'genome_order': [0, 1, 2],
		'chromosomes': {
			'c1': {'genome_id': 0, 'length': 2000, 'rc': false, 'seq': null},
			'c2': {'genome_id': 1, 'length': 1000, 'rc': false, 'seq': null},
			'c3': {'genome_id': 1, 'length': 1000, 'rc': false, 'seq': null},
			'c4': {'genome_id': 2, 'length': 1000, 'rc': false, 'seq': null}
		}
};
var features = {
		'f1': {'karyo': 'c1', 'start': 300, 'end': 800},
		'f2': {'karyo': 'c2', 'start': 100, 'end': 600}
};
var links = [
             {'source': 'f1', 'target': 'f2', 'identity': 90}
             ];
var data = {'karyo': karyo, 'features': features, 'links': links};
var data2 = {'karyo': karyo2, 'features': features, 'links': links};
var data3 = {'karyo': karyo3, 'features': features, 'links': links};
var data4 = {'karyo': karyo4, 'features': features, 'links': links};

describe('The setData method of WgaPipeline objects is supposed to set the data', function(){
	var svg = $('<svg></svg>');
	var wga = new WgaPipeline(svg);
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

describe('The getLinearKaryoCoords method of WgaPipeline objects is supposed to calculate coordinates for the karyos in the linear case', function(){
	var svg = $('<svg></svg>');
	var wga = new WgaPipeline(svg);
	it('getLinearKaryoCoords method is supposed to be a function', function(){
		expect(typeof wga.getLinearKaryoCoords).toEqual('function');
	});
	it('getLinearKaryoCoords method is supposed to return linearKaryoCoords', function(){
		wga.setData(data);
		var linearKaryoCoords = wga.getLinearKaryoCoords();
		expect(linearKaryoCoords).toBeDefined();
	});
	it('getLinearKaryoCoords method is supposed to work with simple test data (2 genomes, 2 chromosomes)', function(){
		wga.setData(data);
		var linearKaryoCoords = wga.getLinearKaryoCoords();
		var expectedCoords = [
            {'karyo': 'c1', 'x': 0, 'y': 0, 'width': defaultConf.width, 'height': defaultConf.linear.karyoHeight},
            {'karyo': 'c2', 'x': 0, 'y': defaultConf.linear.genomeDistance, 'width': defaultConf.width/2, 'height': defaultConf.linear.karyoHeight}
        ];
		expect(linearKaryoCoords).toEqual(expectedCoords);
	});
	it('getLinearKaryoCoords method is supposed to work with simple test data (2 genomes, 3 chromosomes)', function(){
		wga.setData(data2);
		var linearKaryoCoords = wga.getLinearKaryoCoords();
		var expectedCoords = [
		    {'karyo': 'c1', 'x': 0, 'y': 0, 'width': defaultConf.width/((2000+defaultConf.linear.karyoDistance)/2000), 'height': defaultConf.linear.karyoHeight},
		    {'karyo': 'c2', 'x': 0, 'y': defaultConf.linear.genomeDistance, 'width': defaultConf.width/((2000+defaultConf.linear.karyoDistance)/1000), 'height': defaultConf.linear.karyoHeight},
		    {'karyo': 'c3', 'x': defaultConf.width/((2000+defaultConf.linear.karyoDistance)/(1000+defaultConf.linear.karyoDistance)), 'y': defaultConf.linear.genomeDistance, 'width': defaultConf.width/((2000+defaultConf.linear.karyoDistance)/1000), 'height': defaultConf.linear.karyoHeight}
		];
		expect(linearKaryoCoords).toEqual(expectedCoords);
	});
	it('getLinearKaryoCoords method is supposed to work with simple test data (3 genomes, 3 chromosomes)', function(){
		wga.setData(data3);
		var linearKaryoCoords = wga.getLinearKaryoCoords();
		var expectedCoords = [
		    {'karyo': 'c1', 'x': 0, 'y': 0, 'width': defaultConf.width, 'height': defaultConf.linear.karyoHeight},
            {'karyo': 'c2', 'x': 0, 'y': defaultConf.linear.genomeDistance, 'width': defaultConf.width/2, 'height': defaultConf.linear.karyoHeight},
		    {'karyo': 'c3', 'x': 0, 'y': defaultConf.linear.genomeDistance*2, 'width': defaultConf.width/2, 'height': defaultConf.linear.karyoHeight}
		];
		expect(linearKaryoCoords).toEqual(expectedCoords);
	});
	it('getLinearKaryoCoords method is supposed to work with simple test data (3 genomes, 4 chromosomes)', function(){
		wga.setData(data4);
		var linearKaryoCoords = wga.getLinearKaryoCoords();
		var expectedCoords = [
		    {'karyo': 'c1', 'x': 0, 'y': 0, 'width': defaultConf.width/((2000+defaultConf.linear.karyoDistance)/2000), 'height': defaultConf.linear.karyoHeight},
		    {'karyo': 'c2', 'x': 0, 'y': defaultConf.linear.genomeDistance, 'width': defaultConf.width/((2000+defaultConf.linear.karyoDistance)/1000), 'height': defaultConf.linear.karyoHeight},
		    {'karyo': 'c3', 'x': defaultConf.width/((2000+defaultConf.linear.karyoDistance)/(1000+defaultConf.linear.karyoDistance)), 'y': defaultConf.linear.genomeDistance, 'width': defaultConf.width/((2000+defaultConf.linear.karyoDistance)/1000), 'height': defaultConf.linear.karyoHeight},
		    {'karyo': 'c4', 'x': 0, 'y': defaultConf.linear.genomeDistance*2, 'width': defaultConf.width/((2000+defaultConf.linear.karyoDistance)/1000), 'height': defaultConf.linear.karyoHeight}
		];
		expect(linearKaryoCoords).toEqual(expectedCoords);
	});
});

describe('The drawLinearKaryo method of WgaPipeline objects is supposed to draw karyos', function(){
	var svg = $('<svg></svg>');
	var wga = new WgaPipeline(svg);
	wga.setData(data);
	it('drawLinearKaryo method is supposed to be a function', function(){
		expect(typeof wga.drawLinearKaryo).toEqual('function');
	});
	it('there should be exactly one karyoGroup in the simple test svg', function(){
		linearKaryoCoords = wga.getLinearKaryoCoords();
		wga.drawLinearKaryo(linearKaryoCoords);
		expect(wga.svgD3.selectAll('.karyoGroup').size()).toEqual(1);
	});
	it('there should be exactly two karyos in the simple test svg', function(){
		linearKaryoCoords = wga.getLinearKaryoCoords();
		wga.drawLinearKaryo(linearKaryoCoords);
		expect(wga.svgD3.selectAll('.karyo').size()).toEqual(2);
	});
	it('the drawn karyos have the expected height', function(){
		linearKaryoCoords = wga.getLinearKaryoCoords();
		wga.drawLinearKaryo(linearKaryoCoords);
		// This test checks only the height attribute of the first selected element
		expect(Number(wga.svgD3.selectAll('.karyo').attr("height"))).toEqual(defaultConf.linear.karyoHeight);
	});
	it('there should be exactly four karyos in the more complex test svg', function(){
		wga.setData(data4);
		linearKaryoCoords = wga.getLinearKaryoCoords();
		wga.drawLinearKaryo(linearKaryoCoords);
		expect(wga.svgD3.selectAll('.karyo').size()).toEqual(4);
	});
});

describe('The drawLinear method of WgaPipeline objects is supposed to draw the linear layout', function(){
	var svg = $('<svg></svg>');
	var wga = new WgaPipeline(svg);
	wga.setData(data2);
	it('drawLinear method is supposed to be a function', function(){
		expect(typeof wga.drawLinear).toEqual('function');
	});
	it('there should be exactly three karyos in the test svg', function(){
		wga.drawLinear();
		expect(wga.svgD3.selectAll('.karyo').size()).toEqual(3);
	});
	it('the drawn karyos have the expected height', function(){
		wga.drawLinear();
		// This test checks only the height attribute of the first selected element
		expect(Number(wga.svgD3.selectAll('.karyo').attr("height"))).toEqual(defaultConf.linear.karyoHeight);
	});
});

describe('The getCircularKaryoCoords method of WgaPipeline objects is supposed to calculate coordinates for the karyos in the circular case', function(){
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
	    						var startActual = Math.round(actual[0].startAngle*factor)/factor;
	    						var startExpected = Math.round(expected[0].startAngle*factor)/factor;
	    						var endActual = Math.round(actual[0].endAngle*factor)/factor;
	    						var endExpected = Math.round(expected[0].endAngle*factor)/factor;
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
	var wga = new WgaPipeline(svg);
	it('getCircularKaryoCoords method is supposed to be a function', function(){
		expect(typeof wga.getCircularKaryoCoords).toEqual('function');
	});
	it('getCircularKaryoCoords method is supposed to return circularKaryoCoords', function(){
		wga.setData(data);
		var circularKaryoCoords = wga.getCircularKaryoCoords();
		expect(circularKaryoCoords).toBeDefined();
	});
	it('getCircularKaryoCoords method is supposed to work with simple test data (2 genomes, 2 chromosomes)', function(){
		wga.setData(data);
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
});

describe('The drawCircularKaryo method of WgaPipeline objects is supposed to draw karyos', function(){
	var svg = $('<svg></svg>');
	var wga = new WgaPipeline(svg);
	wga.setData(data);
	it('drawCircularKaryo method is supposed to be a function', function(){
		expect(typeof wga.drawCircularKaryo).toEqual('function');
	});
	it('there should be exactly one karyoGroup in the simple test svg', function(){
		circularKaryoCoords = wga.getCircularKaryoCoords();
		wga.drawCircularKaryo(circularKaryoCoords);
		expect(wga.svgD3.selectAll('.karyoGroup').size()).toEqual(1);
	});
	it('the karyo group should be translated to the center of the svg', function(){
		circularKaryoCoords = wga.getCircularKaryoCoords();
		wga.drawCircularKaryo(circularKaryoCoords);
		expect(wga.svgD3.selectAll('.karyoGroup').attr("transform")).toEqual("translate(" + defaultConf.width / 2 + "," + defaultConf.height / 2 + ")");
	});
	it('there should be exactly two karyos in the simple test svg', function(){
		circularKaryoCoords = wga.getCircularKaryoCoords();
		wga.drawCircularKaryo(circularKaryoCoords);
		expect(wga.svgD3.selectAll('.karyo').size()).toEqual(2);
	});
	// TODO the following tests do not work as there is a svg d attribute created by D3
//	it('the drawn karyos have the expected outerRadius', function(){
//		circularKaryoCoords = wga.getCircularKaryoCoords();
//		wga.drawCircularKaryo(circularKaryoCoords);
//		// This test checks only the outerRadius attribute of the first selected element
//		expect(Number(wga.svgD3.selectAll('.karyo').attr("outerRadius"))).toEqual(defaultConf.circular.outerRadius);
//		console.log(wga.svgD3.selectAll('.karyo'));
//	});
//	it('the drawn karyos have the expected innerRadius', function(){
//		circularKaryoCoords = wga.getCircularKaryoCoords();
//		wga.drawCircularKaryo(circularKaryoCoords);
//		// This test checks only the innerRadius attribute of the first selected element
//		expect(Number(wga.svgD3.selectAll('.karyo').attr("innerRadius"))).toEqual(defaultConf.circular.outerRadius - defaultConf.circular.karyoHeight);
//	});
	it('there should be exactly four karyos in the more complex test svg', function(){
		wga.setData(data4);
		circularKaryoCoords = wga.getCircularKaryoCoords();
		wga.drawCircularKaryo(circularKaryoCoords);
		expect(wga.svgD3.selectAll('.karyo').size()).toEqual(4);
	});
});


describe('The drawCircular method of WgaPipeline objects is supposed to draw the circular layout', function(){
	var svg = $('<svg></svg>');
	var wga = new WgaPipeline(svg);
	wga.setData(data2);
	it('drawCircular method is supposed to be a function', function(){
		expect(typeof wga.drawCircular).toEqual('function');
	});
	it('there should be exactly three karyos in the test svg', function(){
		wga.drawCircular();
		expect(wga.svgD3.selectAll('.karyo').size()).toEqual(3);
	});
});