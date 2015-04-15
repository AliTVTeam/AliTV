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
	it('the coords property is initialized as empty object', function(){
		expect(wga.coords).toEqual({});
	});
});

var karyo = {
		'order': ['c1', 'c2'],
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
	wga.setData(data);
	it('setData method is supposed to set the data variable', function(){
		expect(wga.data).toEqual(data);
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
});