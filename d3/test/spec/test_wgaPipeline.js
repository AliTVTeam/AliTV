var defaultConf =  {
		width: 1000,
		height: 1000,
		linear: {
			genomeDistance: 300,
			karyoHeight: 30,
			karyoDistance: 10
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
		    {'karyo': 'c4', 'x': 0, 'y': defaultConf.linear.genomeDistance*2, 'width': defaultConf.width/((2000+defaultConf.linear.karyoDistance)/1000), 'height': defaultConf.linear.karyoHeight},
		];
		expect(linearKaryoCoords).toEqual(expectedCoords);
	});
});

describe('The drawLinearKaryo method of WgaPipeline objects is supposed to draw karyos', function(){
	var svg = $('<svg></svg>');
	var wga = new WgaPipeline(svg);
	it('drawLinearKaryo method is supposed to be a function', function(){
		expect(typeof wga.drawLinearKaryo).toEqual('function');
	});
});
