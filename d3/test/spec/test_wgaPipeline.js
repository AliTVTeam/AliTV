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
	it('the svg property is properly set', function(){
		expect(wga.svg).toEqual(svg);
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
var features = {
		'f1': {'karyo': 'c1', 'start': 300, 'end': 800},
		'f2': {'karyo': 'c2', 'start': 100, 'end': 600}
};
var links = [
             {'source': 'f1', 'target': 'f2', 'identity': 90}
             ];
var data = {'karyo': karyo, 'features': features, 'links': links};

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
	wga.setData(data);
	var linearKaryoCoords = wga.getLinearKaryoCoords();
	it('getLinearKaryoCoords method is supposed to return linearKaryoCoords', function(){
		expect(linearKaryoCoords).toBeDefined();
	});
	var expectedCoords = [
		{'karyo': 'c1', 'x': 0, 'y': 0, 'width': defaultConf.width, 'height': defaultConf.linear.karyoHeight},
		{'karyo': 'c2', 'x': 0, 'y': defaultConf.linear.genomeDistance, 'width': defaultConf.width/2, 'height': defaultConf.linear.karyoHeight}
	];
	it('getLinearKaryoCoords method is supposed to work with simple test data', function(){
		expect(linearKaryoCoords).toEqual(expectedCoords);
	});
});