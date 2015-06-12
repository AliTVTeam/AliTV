describe('The getLinearSpacer method is supposed to get the information of the spacer between two karyos', function(){
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
		expect(spacer).toEqual(defaultConf.graphicalParameters.karyoDistance);
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
		expect(ali.getLinearSpacer()).toEqual(12);
		ali.setLinearSpacer(100);
		expect(ali.getLinearSpacer()).toEqual(100);
		ali.setLinearSpacer(20);
		expect(ali.getLinearSpacer()).toEqual(20);
	});	
	it('the returned Spacer of the getLinearSpacer method should throw an error message if the spacer is empty', function(){
		var returnedSpacer = "";
		expect(function(){ali.setLinearSpacer(returnedSpacer);}).toThrow("empty");
	});
	it('the returned Spacer of the getLinearSpacer method should throw an error message if the spacer is not a number', function(){
		var returnedSpacer = "test";
		expect(function(){ali.setLinearSpacer(returnedSpacer);}).toThrow("not a number");
	});
	it('the returned Spacer of the getLinearSpacer method should throw an error message if the spacer is less than 0', function(){
		var returnedSpacer = -12;
		expect(function(){ali.setLinearSpacer(returnedSpacer);}).toThrow("spacer is to small, it should be > 0");
	});
	it('the returned Spacer of the getLinearSpacer method should throw an error message if the spacer is 0', function(){
		var returnedSpacer = 0;
		expect(function(){ali.setLinearSpacer(returnedSpacer);}).toThrow("spacer is to small, it should be > 0");
	});
});

	
describe('The getKaryoHeight method is supposed to get the height of the chromosomes', function(){
	var svg = $('<svg></svg>');
	var ali = new AliTV(svg);
	
	it('getkaryoHeight method is supposed to be a function', function(){
		expect(typeof ali.getKaryoHeight).toEqual('function');
	});	
	it('the function should return a defined value', function(){
		var height = ali.getKaryoHeight();
		expect(height).toBeDefined();
	});
	it('the function should return the height of chromosomes which is defined in the defaultConf', function(){
		var height = ali.getKaryoHeight();
		expect(height).toEqual(defaultConf.graphicalParameters.karyoHeight);
	});
});

describe('The setKaryoHeight method is supposed to set the new height of chromosomes in the conf object', function(){
	var svg = $('<svg></svg>');
	var ali = new AliTV(svg);
	it('setKaryoHeight method is supposed to be a function', function(){
		expect(typeof ali.setKaryoHeight).toEqual('function');
	});	
	it('the returned value of the getKaryoHeight method should be the same as the height which is set and returned by the setter-method', function(){
		var height = 40;
		expect(ali.setKaryoHeight(height)).toEqual(40);
	});	
	it('when setKaryoHeight is called several times the height should have the same value as the returned height of getKaryoHeight method', function(){
		ali.setKaryoHeight(20);
		expect(ali.getKaryoHeight()).toEqual(20);
		ali.setKaryoHeight(40);
		expect(ali.getKaryoHeight()).toEqual(40);
		ali.setKaryoHeight(32);
		expect(ali.getKaryoHeight()).toEqual(32);
	});
	it('the setKaryoHeight method should throw an error message if the assigned height has no value', function(){
		var height = "";
		expect(function(){ali.setKaryoHeight(height);}).toThrow("empty");
	});
	it('the setKaryoHeight method should throw an error message if the assigned height is not a number', function(){
		var height = "test";
		expect(function(){ali.setKaryoHeight(height);}).toThrow("not a number");
	});
	it('the setKaryoHeight method should throw an error message if the assigned height is 0', function(){
		var height = 0;
		expect(function(){ali.setKaryoHeight(height);}).toThrow("genome distance is to small, it should be > 0");
	});
	it('the setKaryoHeight method should throw an error message if the assigned height is less than 0', function(){
		var height = -12;
		expect(function(){ali.setKaryoHeight(height);}).toThrow("genome distance is to small, it should be > 0");
	});

});

describe('The getCanvasWidth method is supposed to get the width of the svg drawing area', function(){
	var svg = $('<svg></svg>');
	var ali = new AliTV(svg);
	
	it('getCanvasWidth method is supposed to be a function', function(){
		expect(typeof ali.getCanvasWidth).toEqual('function');
	});	
	it('the function should return a defined value', function(){
		var width = ali.getCanvasWidth();
		expect(width).toBeDefined();
	});
	it('the function should return the width of canvas which is defined in the defaultConf', function(){
		var width = ali.getCanvasWidth();
		expect(width).toEqual(defaultConf.graphicalParameters.width);
	});
});
	
describe('The setCanvasWidth method is supposed to set a new width of the svgDrawingArea', function(){
	var svg = $('<svg></svg>');
	var ali = new AliTV(svg);
	it('setCanvasWidth method is supposed to be a function', function(){
		expect(typeof ali.setCanvasWidth).toEqual('function');
	});	
	it('the returned object of the getCanvasWidth method should be the same as the width which is set and returned by the setter-method', function(){
		var width = 3000
		expect(ali.setCanvasWidth(width)).toEqual(width);
	});	
	it('when setCanvasWidth is called several times the width should have the same value as the returned width of getCanvasWidth method', function(){
		ali.setCanvasWidth(2000);
		expect(ali.getCanvasWidth()).toEqual(2000);
		ali.setCanvasWidth(1200);
		expect(ali.getCanvasWidth()).toEqual(1200);
		ali.setCanvasWidth(10000);
		expect(ali.getCanvasWidth()).toEqual(10000);
	});
	it('the setCanvasWidth method should throw an error message if the assigned width is empty', function(){
		var width = "";
		expect(function(){ali.setCanvasWidth(width);}).toThrow("empty");
	});
	it('the setCanvasWidth method should throw an error message if the assigned width is not a number', function(){
		var width = "test";
		expect(function(){ali.setCanvasWidth(width);}).toThrow("not a number");
	});
	it('the setCanvasWidth method should throw an error message if the assigned width is 0', function(){
		var width = 0;
		expect(function(){ali.setCanvasWidth(width);}).toThrow("width is to small, it should be > 0");
	});
	it('the setCanvasWidth method should throw an error message if the assigned width is less than 0', function(){
		var width = -3000;
		expect(function(){ali.setCanvasWidth(width);}).toThrow("width is to small, it should be > 0");
	});
});

describe('The getCanvasHeight method is supposed to get the height of the svg drawing area', function(){
	var svg = $('<svg></svg>');
	var ali = new AliTV(svg);
	
	it('getCanvasHeight method is supposed to be a function', function(){
		expect(typeof ali.getCanvasHeight).toEqual('function');
	});	
	it('the function should return a defined value', function(){
		var height = ali.getCanvasHeight();
		expect(height).toBeDefined();
	});
	it('the function should return the height of canvas which is defined in the defaultConf', function(){
		var height = ali.getCanvasHeight();
		expect(height).toEqual(defaultConf.graphicalParameters.height);
	});
});

describe('The setCanvasHeight method is supposed to set a new height of the svg drawing area', function(){
	var svg = $('<svg></svg>');
	var ali = new AliTV(svg);
	it('setCanvasHeight method is supposed to be a function', function(){
		expect(typeof ali.setCanvasHeight).toEqual('function');
	});	
	it('the returned object of the getCanvasHeight method should be the same as the height which is setted and returned by the setter-method', function(){
		var height = 3000;
		expect(ali.setCanvasHeight(height)).toEqual(height);
	});	
	it('when setCanvasHeight is called several times the width should have the same value as the returned height of getCanvasHeight method', function(){
		ali.setCanvasHeight(1234);
		expect(ali.getCanvasHeight()).toEqual(1234);
		ali.setCanvasHeight(4242);
		expect(ali.getCanvasHeight()).toEqual(4242);
		ali.setCanvasHeight(10000);
		expect(ali.getCanvasHeight()).toEqual(10000);
	});
	it('the setCanvasHeight method should throw an error message if the assigned height is empty', function(){
		var height = "";
		expect(function(){ali.setCanvasHeight(height);}).toThrow("empty");
	});
	it('the setCanvasHeight method should throw an error message if the assigned height is not a number', function(){
		var height = "test";
		expect(function(){ali.setCanvasHeight(height);}).toThrow("not a number");
	});
	it('the setCanvasHeight method should throw an error message if the assigned height is 0', function(){
		var height = 0;
		expect(function(){ali.setCanvasHeight(height);}).toThrow("height is to small, it should be > 0");
	});
	it('the setCanvasHeight method should throw an error message if the assigned height is less than 0', function(){
		var height = -42;
		expect(function(){ali.setCanvasHeight(height);}).toThrow("height is to small, it should be > 0");
	});
});

describe('The getOuterRadius method is supposed to calculate the appropriate outerRadius for the circular layout', function(){
	var svg = $('<svg></svg>');
	var ali = new AliTV(svg);
	it('getOuterRadius method is supposed to be a function', function(){
		expect(typeof ali.getOuterRadius).toEqual('function');
	});
	it('getOuterRadius method is supposed to return not null', function(){
		expect(ali.getOuterRadius()).toBeDefined();
	});
	it('getOuterRadius method is supposed to return 450 if default width and height are used (45% of 1000)', function(){
		expect(ali.getOuterRadius()).toEqual(450);
	});
	it('getOuterRadius method is supposed to return 45% of the smaller dimension (width or height)', function(){
		ali.setCanvasHeight(500);
		ali.setCanvasWidth(1000);
		expect(ali.getOuterRadius()).toEqual(225);
	});
	it('getOuterRadius method is supposed to return 45% of the smaller dimension (width or height)', function(){
		ali.setCanvasHeight(2000);
		ali.setCanvasWidth(1000);
		expect(ali.getOuterRadius()).toEqual(450);
	});
	it('getOuterRadius method is supposed to return 45% of the smaller dimension (width or height)', function(){
		ali.setCanvasHeight(2000);
		ali.setCanvasWidth(2000);
		expect(ali.getOuterRadius()).toEqual(900);
	});
});

describe('The getGenomeDistance method is supposed to calculate the appropriate genomeDistance for the linear layout', function(){
	var svg = $('<svg></svg>');
	var ali = new AliTV(svg);
	it('getGenomeDistance method is supposed to be a function', function(){
		expect(typeof ali.getGenomeDistance).toEqual('function');
	});
	it('getGenomeDistance method is supposed to return not null', function(){
		ali.setData(data);
		ali.setFilters(filters);
		expect(ali.getGenomeDistance()).toBeDefined();
	});
	it('getGenomeDistance method is supposed to return 970 if default height and 2 genomes are used (1000 * 1/2)', function(){
		ali.setData(data);
		ali.setFilters(filters);
		var distance = (1000 - 30) * 1/(2 - 1);
		expect(ali.getGenomeDistance()).toEqual(distance);
	});
	it('getGenomeDistance method is supposed to return 323 if default height and 4 genomes are used (1000 * 1/4)', function(){
		ali.setData({karyo: karyo7});
		ali.setFilters(filters8);
		var distance = (1000 - 30) * 1/(4 - 1);
		expect(ali.getGenomeDistance()).toEqual(Math.round(distance));
	});
	it('getGenomeDistance method is supposed to return 1970 if the default height is set on 2000 and 2 genomes are used (2000 * 1/2)', function(){
		ali.setData(data);
		ali.setFilters(filters);
		ali.setCanvasHeight(2000);
		var distance = (2000 - 30) * 1/(2 -1);
		expect(ali.getGenomeDistance()).toEqual(distance);
	});
});

describe('The getTickDistance method is supposed to get the distance of the chromosome ticks in bp', function(){
	var svg = $('<svg></svg>');
	var ali = new AliTV(svg);
	
	it('getTickFrequency method is supposed to be a function', function(){
		expect(typeof ali.getTickDistance).toEqual('function');
	});	
	it('the function should return a defined value', function(){
		var distance = ali.getTickDistance();
		expect(distance).toBeDefined();
	});
	it('the function should return the tick distance which is defined in the defaultConf', function(){
		var distance = ali.getTickDistance();
		expect(distance).toEqual(defaultConf.graphicalParameters.tickDistance);
	});
});

describe('The setTickDistance method is supposed to set a new distance between the chromosome ticks', function(){
	var svg = $('<svg></svg>');
	var ali = new AliTV(svg);
	it('setTickDistance method is supposed to be a function', function(){
		expect(typeof ali.setTickDistance).toEqual('function');
	});	
	it('the returned object of the getTickDistance method should be the same as the distance which is setted and returned by the setter-method', function(){
		var distance = 200;
		expect(ali.setTickDistance(distance)).toEqual(distance);
	});	
	it('when setTickDistance is called several times the distance should have the same value as the returned distance of getTickDistance method', function(){
		ali.setTickDistance(20);
		expect(ali.getTickDistance()).toEqual(20);
		ali.setTickDistance(5);
		expect(ali.getTickDistance()).toEqual(5);
		ali.setTickDistance(250);
		expect(ali.getTickDistance()).toEqual(250);
	});
	it('the setTickDistance method should throw an error message if the assigned distance is empty', function(){
		var distance = "";
		expect(function(){ali.setTickDistance(distance);}).toThrow("empty");
	});
	it('the setTickDistance method should throw an error message if the assigned distance is not a number', function(){
		var distance = "test";
		expect(function(){ali.setTickDistance(distance);}).toThrow("not a number");
	});
	it('the setTickDistance method should throw an error message if the assigned distance is 0', function(){
		var distance = 0;
		expect(function(){ali.setTickDistance(distance);}).toThrow("distance is to small, it should be > 0");
	});
	it('the setTickDistance method should throw an error message if the assigned distance is less than 0', function(){
		var distance = -200;
		expect(function(){ali.setTickDistance(distance);}).toThrow("distance is to small, it should be > 0");
	});
});

describe('The getLayout method is supposed to get the information of the current layout', function(){
	var svg = $('<svg></svg>');
	var ali = new AliTV(svg);
	it('getLayout method is supposed to be a function', function(){
		expect(typeof ali.getLayout).toEqual('function');
	});	
	it('the function should return a defined value', function(){
		var layout = ali.getLayout();
		expect(layout).toBeDefined();
	});
	it('the function should return "linear", because this is the default layout', function(){
		var layout = ali.getLayout();
		expect(layout).toEqual("linear");
	});
});

describe('The getTreeWidth method is supposed to get the current width of the phylogenetic tree', function(){
	var svg = $('<svg></svg>');
	var ali = new AliTV(svg);
	it('getLayout method is supposed to be a function', function(){
		expect(typeof ali.getTreeWidth).toEqual('function');
	});	
	it('the function should return a defined value', function(){
		var treeWidth = ali.getTreeWidth();
		expect(treeWidth).toBeDefined();
	});
	it('the function should return the tree width which is defined in the defaultConf', function(){
		var treeWidth = ali.getTreeWidth();
		expect(treeWidth).toEqual(defaultConf.graphicalParameters.treeWidth);
	});
	
});

describe('The setTreeWidth method is supposed to set a new tree width', function(){
	var svg = $('<svg></svg>');
	var ali = new AliTV(svg);
	it('setTreeWidth method is supposed to be a function', function(){
		expect(typeof ali.setTreeWidth).toEqual('function');
	});	
	it('the returned object of the getTreeWidth method should be the same as the tree width which is setted and returned by the setter-method', function(){
		var treeWidth = 400;
		expect(ali.setTreeWidth(treeWidth)).toEqual(treeWidth);
	});	
	it('when setTreeWidth is called several times the width of the tree should have the same value as the returned width of getTreeWidth method', function(){
		ali.setTreeWidth(250);
		expect(ali.getTreeWidth()).toEqual(250);
		ali.setTreeWidth(1000);
		expect(ali.getTreeWidth()).toEqual(1000);
		ali.setTreeWidth(888);
		expect(ali.getTreeWidth()).toEqual(888);
	});
	it('the setTreeWidth method should throw an error message if the assigned tree width is empty', function(){
		var treeWidth = "";
		expect(function(){ali.setTreeWidth(treeWidth);}).toThrow("empty");
	});
	it('the setTreeWidth method should throw an error message if the assigned tree width is not a number', function(){
		var treeWidth = "test";
		expect(function(){ali.setTreeWidth(treeWidth);}).toThrow("not a number");
	});
	it('the setTreeWidth method should throw an error message if the assigned treeWidth is 0', function(){
		var treeWidth = 0;
		expect(function(){ali.setTreeWidth(treeWidth);}).toThrow("the tree width is to small, it should be > 0");
	});
	it('the setTreeWidth method should throw an error message if the assigned distance is less than 0', function(){
		var treeWidth = -200;
		expect(function(){ali.setTreeWidth(treeWidth);}).toThrow("the tree width is to small, it should be > 0");
	});
});

describe('The getTickLabelFrequency method is supposed to get the current frequency of tick labels', function(){
	var svg = $('<svg></svg>');
	var ali = new AliTV(svg);
	it('getTickLabelFrequency method is supposed to be a function', function(){
		expect(typeof ali.getTickLabelFrequency).toEqual('function');
	});	
	it('the function should return a defined value', function(){
		var tickLabelFrequency = ali.getTickLabelFrequency();
		expect(tickLabelFrequency).toBeDefined();
	});
	it('the function should return the tick label frequency which is defined in the defaultConf', function(){
		var tickLabelFrequency = ali.getTickLabelFrequency();
		expect(tickLabelFrequency).toEqual(defaultConf.graphicalParameters.tickLabelFrequency);
	});
	
});

describe('The setTickLabelFrequency method is supposed to set a new frequency of tick labels', function(){
	var svg = $('<svg></svg>');
	var ali = new AliTV(svg);
	it('setTickLabelFrequency method is supposed to be a function', function(){
		expect(typeof ali.setTickLabelFrequency).toEqual('function');
	});	
	it('the returned value of the setTickLabelFrequency method should be the same as the label frequency which is setted and returned by the setter-method', function(){
		var tickLabelFrequency = 15;
		expect(ali.setTickLabelFrequency(tickLabelFrequency)).toEqual(tickLabelFrequency);
	});	
	it('when setTickLabelFrequency is called several times the width of the tree should have the same value as the returned frequency of getTickLabelFrequency method', function(){
		ali.setTickLabelFrequency(5);
		expect(ali.getTickLabelFrequency()).toEqual(5);
		ali.setTickLabelFrequency(100);
		expect(ali.getTickLabelFrequency()).toEqual(100);
		ali.setTickLabelFrequency(22);
		expect(ali.getTickLabelFrequency()).toEqual(22);
	});
	it('the setTickLabelFrequency method should throw an error message if the assigned frequency is empty', function(){
		var tickLabelFrequency = "";
		expect(function(){ali.setTickLabelFrequency(tickLabelFrequency);}).toThrow("empty");
	});
	it('the setTickLabelFrequency method should throw an error message if the assigned frequency is not a number', function(){
		var tickLabelFrequency = "test";
		expect(function(){ali.setTickLabelFrequency(tickLabelFrequency);}).toThrow("not a number");
	});
	it('the setTickLabelFrequency method should throw an error message if the assigned frequency is 0', function(){
		var tickLabelFrequency = 0;
		expect(function(){ali.setTickLabelFrequency(tickLabelFrequency);}).toThrow("the frequency is to small, it should be > 0");
	});
	it('the setTickLabelFrequency method should throw an error message if the assigned frequency is less than 0', function(){
		var tickLabelFrequency = -200;
		expect(function(){ali.setTickLabelFrequency(tickLabelFrequency);}).toThrow("the frequency is to small, it should be > 0");
	});
});

describe('The getGeneColor method is supposed to get the current color of genes', function(){
	var svg = $('<svg></svg>');
	var ali = new AliTV(svg);
	it('getGeneColor method is supposed to be a function', function(){
		expect(typeof ali.getGeneColor).toEqual('function');
	});	
	it('the function should return a defined value', function(){
		var color = ali.getGeneColor();
		expect(color).toBeDefined();
	});
	it('the function should return the color of genomes which is defined in the defaultConf', function(){
		var color = ali.getGeneColor();
		expect(color).toEqual(defaultConf.features.supportedFeatures.gen.color);
	});
	
});