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

describe('The getLinearGenomeSpacer method is supposed to get the information of the spacer between two genomes', function(){
	var svg = $('<svg></svg>');
	var ali = new AliTV(svg);
	
	it('getLinearGenomeSpacer method is supposed to be a function', function(){
		expect(typeof ali.getLinearGenomeSpacer).toEqual('function');
	});	
	it('the function should return a defined value', function(){
		var genomeSpacer = ali.getLinearGenomeSpacer();
		expect(genomeSpacer).toBeDefined();
	});
	it('the function should return the spacer between two genomes which is defined in the defaultConf', function(){
		var genomeSpacer = ali.getLinearGenomeSpacer();
		expect(genomeSpacer).toEqual(defaultConf.linear.genomeDistance);
	});
});

describe('The getLinearGenomeSpacer method is supposed to set the new information of the genome distance in the conf object', function(){
	var svg = $('<svg></svg>');
	var ali = new AliTV(svg);
	it('setLinearSpacer method is supposed to be a function', function(){
		expect(typeof ali.setLinearGenomeSpacer).toEqual('function');
	});	
	it('the returned value of the getLinearGenomeSpacer method should be the same as the genomeSpacer which is set and returned by the setter-method', function(){
		var returnedSpacer = 400;
		expect(ali.setLinearGenomeSpacer(returnedSpacer)).toEqual(400);
	});	
	it('when setLinearGenomeSpacer is called several times the spacer should have the same value as the returned spacer of getLinearGenomeSpacer method', function(){
		ali.setLinearSpacer(500);
		expect(ali.getLinearSpacer()).toEqual(500);
		ali.setLinearSpacer(200);
		expect(ali.getLinearSpacer()).toEqual(200);
		ali.setLinearSpacer(1000);
		expect(ali.getLinearSpacer()).toEqual(1000);
	});	
	it('the setLinearGenomeSpacer method should throw an error message if the assigned spacer has no value', function(){
		var genomeSpacer = "";
		expect(function(){ali.setLinearGenomeSpacer(genomeSpacer);}).toThrow("empty");
	});
	it('the setLinearGenomeSpacer method should throw an error message if the assigned spacer is not a number', function(){
		var genomeSpacer = "test";
		expect(function(){ali.setLinearGenomeSpacer(genomeSpacer);}).toThrow("not a number");
	});
	it('the setLinearGenomeSpacer method should throw an error message if the assigned spacer is 0', function(){
		var genomeSpacer = 0;
		expect(function(){ali.setLinearGenomeSpacer(genomeSpacer);}).toThrow("genome distance is to small, it should be > 0");
	});
	it('the setLinearGenomeSpacer method should throw an error message if the assigned spacer is less than 0', function(){
		var genomeSpacer = -12;
		expect(function(){ali.setLinearGenomeSpacer(genomeSpacer);}).toThrow("genome distance is to small, it should be > 0");
	});
	it('the setLinearGenomeSpacer method should throw an error message if the assigned spacer is bigger than the length of the svg', function(){
		var genomeSpacer = ali.conf.graphicalParameters.width + 200;
		expect(function(){ali.setLinearGenomeSpacer(genomeSpacer);}).toThrow("genome distance is to big for drawing, change the height first");
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

//describe('The getMinimumLinkLength method is supposed to get the information of the current minimum length of the links, which should be drawn', function(){
//	var svg = $('<svg></svg>');
//	var ali = new AliTV(svg);
//	it('getMinimumLinkLength method is supposed to be a function', function(){
//		expect(typeof ali.getMinimumLinkLength).toEqual('function');
//	});	
//	it('the function should return a defined value', function(){
//		var minLinkLength = ali.getMinimumLinkLength();
//		expect(minLinkLength).toBeDefined();
//	});
//	it('the function should return 100, because this is the default value for the minimum link length', function(){
//		var minLinkLength = ali.getMinimumLinkLength();
//		expect(minLinkLength).toEqual(100);
//	});
//});
//
//describe('The setMinimumLinkLength method is supposed to set a new minimum length of the links which should be drawn', function(){
//	var svg = $('<svg></svg>');
//	var ali = new AliTV(svg);
//	it('setMinimumLinkLength method is supposed to be a function', function(){
//		expect(typeof ali.setMinimumLinkLength).toEqual('function');
//	});	
//	it('the returned object of the setMinimumLinkLength method should be the same as the minimum length which is setted and returned by the setter-method', function(){
//		var minLinkLength = 125;
//		expect(ali.setMinimumLinkLength(minLinkLength)).toEqual(distance);
//	});	
//	it('when setTickDistance is called several times the distance should have the same value as the returned distance of getTickDistance method', function(){
//		ali.setTickDistance(20);
//		expect(ali.getTickDistance()).toEqual(20);
//		ali.setTickDistance(5);
//		expect(ali.getTickDistance()).toEqual(5);
//		ali.setTickDistance(250);
//		expect(ali.getTickDistance()).toEqual(250);
//	});
//});