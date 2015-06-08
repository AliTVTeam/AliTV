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
		expect(wga.svg.height()).toEqual(defaultConf.graphicalParameters.height);
	});
	it('the width of the svg should be set to the configured width if the tree is not set', function(){
		expect(wga.svg.width()).toEqual(defaultConf.graphicalParameters.width);
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
            {'karyo': 'c1', 'x': 0, 'y': 0, 'width': defaultConf.graphicalParameters.width, 'height': defaultConf.graphicalParameters.karyoHeight, 'genome': 0},
            {'karyo': 'c2', 'x': 0, 'y': wga.getGenomeDistance(), 'width': defaultConf.graphicalParameters.width/2, 'height': defaultConf.graphicalParameters.karyoHeight, 'genome': 1}
        ];
		expect(linearKaryoCoords).toEqual(expectedCoords);
	});
	it('getLinearKaryoCoords method is supposed to work with simple test data (2 genomes, 3 chromosomes)', function(){
		wga.setData(data2);
		wga.setFilters(filters2);
		var linearKaryoCoords = wga.getLinearKaryoCoords();
		var expectedCoords = [
		    {'karyo': 'c1', 'x': 0, 'y': 0, 'width': defaultConf.graphicalParameters.width/((2000+defaultConf.graphicalParameters.karyoDistance)/2000), 'height': defaultConf.graphicalParameters.karyoHeight, 'genome': 0},
		    {'karyo': 'c2', 'x': 0, 'y': wga.getGenomeDistance(), 'width': defaultConf.graphicalParameters.width/((2000+defaultConf.graphicalParameters.karyoDistance)/1000), 'height': defaultConf.graphicalParameters.karyoHeight, 'genome': 1},
		    {'karyo': 'c3', 'x': defaultConf.graphicalParameters.width/((2000+defaultConf.graphicalParameters.karyoDistance)/(1000+defaultConf.graphicalParameters.karyoDistance)), 'y': wga.getGenomeDistance(), 'width': defaultConf.graphicalParameters.width/((2000+defaultConf.graphicalParameters.karyoDistance)/1000), 'height': defaultConf.graphicalParameters.karyoHeight, 'genome': 1}
		];
		expect(linearKaryoCoords).toEqual(expectedCoords);
	});
	it('getLinearKaryoCoords method is supposed to work with simple test data (3 genomes, 3 chromosomes)', function(){
		wga.setData(data3);
		wga.setFilters(filters3);
		var linearKaryoCoords = wga.getLinearKaryoCoords();
		var expectedCoords = [
		    {'karyo': 'c1', 'x': 0, 'y': 0, 'width': defaultConf.graphicalParameters.width, 'height': defaultConf.graphicalParameters.karyoHeight, 'genome': 0},
            {'karyo': 'c2', 'x': 0, 'y': wga.getGenomeDistance(), 'width': defaultConf.graphicalParameters.width/2, 'height': defaultConf.graphicalParameters.karyoHeight, 'genome': 1},
		    {'karyo': 'c3', 'x': 0, 'y': wga.getGenomeDistance()*2, 'width': defaultConf.graphicalParameters.width/2, 'height': defaultConf.graphicalParameters.karyoHeight, 'genome': 2}
		];
		expect(linearKaryoCoords).toEqual(expectedCoords);
	});
	it('getLinearKaryoCoords method is supposed to work with simple test data (3 genomes, 4 chromosomes)', function(){
		wga.setData(data4);
		wga.setFilters(filters4);
		var linearKaryoCoords = wga.getLinearKaryoCoords();
		var expectedCoords = [
		    {'karyo': 'c1', 'x': 0, 'y': 0, 'width': defaultConf.graphicalParameters.width/((2000+defaultConf.graphicalParameters.karyoDistance)/2000), 'height': defaultConf.graphicalParameters.karyoHeight, 'genome': 0},
		    {'karyo': 'c2', 'x': 0, 'y': wga.getGenomeDistance(), 'width': defaultConf.graphicalParameters.width/((2000+defaultConf.graphicalParameters.karyoDistance)/1000), 'height': defaultConf.graphicalParameters.karyoHeight, 'genome': 1},
		    {'karyo': 'c3', 'x': defaultConf.graphicalParameters.width/((2000+defaultConf.graphicalParameters.karyoDistance)/(1000+defaultConf.graphicalParameters.karyoDistance)), 'y': wga.getGenomeDistance(), 'width': defaultConf.graphicalParameters.width/((2000+defaultConf.graphicalParameters.karyoDistance)/1000), 'height': defaultConf.graphicalParameters.karyoHeight, 'genome': 1},
		    {'karyo': 'c4', 'x': 0, 'y': wga.getGenomeDistance()*2, 'width': defaultConf.graphicalParameters.width/((2000+defaultConf.graphicalParameters.karyoDistance)/1000), 'height': defaultConf.graphicalParameters.karyoHeight, 'genome': 2}
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
		var linearKaryoCoords = ali.getLinearKaryoCoords();
		ali.drawLinearKaryo(linearKaryoCoords);
		expect(ali.svgD3.selectAll('.karyoGroup').size()).toEqual(1);
	});
	it('there should be exactly two karyos in the simple test svg', function(){
		var linearKaryoCoords = ali.getLinearKaryoCoords();
		ali.drawLinearKaryo(linearKaryoCoords);
		expect(ali.svgD3.selectAll('.karyo').size()).toEqual(2);
	});
	it('the drawn karyos have the expected height', function(){
		var linearKaryoCoords = ali.getLinearKaryoCoords();
		ali.drawLinearKaryo(linearKaryoCoords);
		// This test checks only the height attribute of the first selected element
		expect(Number(ali.svgD3.selectAll('.karyo').attr("height"))).toEqual(defaultConf.graphicalParameters.karyoHeight);
	});
	it('there should be exactly four karyos in the more complex test svg', function(){
		ali.setData(data4);
		ali.setFilters(filters4);
		var linearKaryoCoords = ali.getLinearKaryoCoords();
		ali.drawLinearKaryo(linearKaryoCoords);
		expect(ali.svgD3.selectAll('.karyo').size()).toEqual(4);
	});
//	it('the karyo belongs to the genome_id = 1 and therefore the color should be "#49006a"', function(){
//		ali.setData({karyo:karyo,features:features, links:links});
//		ali.setFilters(filters);
//		var linearKaryoCoords = ali.getLinearKaryoCoords();
//		ali.drawLinearKaryo(linearKaryoCoords);
//		expect(ali.svg.find('.karyo').css("fill")).toEqual("#49006a");	
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
			var tickFrequency = wga.data.karyo.chromosomes[value.karyo].length / wga.conf.graphicalParameters.tickDistance;
			totalTicks += tickFrequency + 1;
		});
		
		expect(wga.svgD3.selectAll('.link').size()).toEqual(1);
		expect(wga.svgD3.selectAll('.karyo').size()).toEqual(3);
		expect(wga.svgD3.selectAll('.tick').size()).toEqual(totalTicks);
	});
	it('the drawn karyos have the expected height', function(){
		wga.drawLinear();
		// This test checks only the height attribute of the first selected element
		expect(Number(wga.svgD3.selectAll('.karyo').attr("height"))).toEqual(defaultConf.graphicalParameters.karyoHeight);
	});
});

describe('The getCircularKaryoCoords method of AliTV objects is supposed to calculate coordinates for the karyos in the circular case', function(){
	beforeEach(function() {
	    jasmine.addMatchers(customMatchers);
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
		var expAnglePerBase = 2*Math.PI/(3000+2*defaultConf.graphicalParameters.karyoDistance);
		var expAnglePerSpace = expAnglePerBase * defaultConf.graphicalParameters.karyoDistance;
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
		var expAnglePerBase = 2*Math.PI/(4000+3*defaultConf.graphicalParameters.karyoDistance);
		var expAnglePerSpace = expAnglePerBase * defaultConf.graphicalParameters.karyoDistance;
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
		var expAnglePerBase = 2*Math.PI/(4000+3*defaultConf.graphicalParameters.karyoDistance);
		var expAnglePerSpace = expAnglePerBase * defaultConf.graphicalParameters.karyoDistance;
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
		var expAnglePerBase = 2*Math.PI/(5000+4*defaultConf.graphicalParameters.karyoDistance);
		var expAnglePerSpace = expAnglePerBase * defaultConf.graphicalParameters.karyoDistance;
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
		var expAnglePerBase = 2*Math.PI/(5000+4*defaultConf.graphicalParameters.karyoDistance);
		var expAnglePerSpace = expAnglePerBase * defaultConf.graphicalParameters.karyoDistance;
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
	    jasmine.addMatchers(customMatchers);
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
			chrpos += defaultConf.graphicalParameters.tickDistance;
		}
		chrpos = 0;
		while (chrpos <= ali.data.karyo.chromosomes[circularKaryoCoords[1].karyo].length){
			expectedCoords.push(c1start + c1total * (chrpos/1000));
			chrpos += defaultConf.graphicalParameters.tickDistance;
		}
		expect(circularTickCoords).toHaveSameCircularTickCoordinates(expectedCoords);
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
		var circularKaryoCoords = ali.getCircularKaryoCoords();
		ali.drawCircularKaryo(circularKaryoCoords);
		expect(ali.svgD3.selectAll('.karyoGroup').size()).toEqual(1);
	});
	it('the karyo group should be translated to the center of the svg', function(){
		var circularKaryoCoords = ali.getCircularKaryoCoords();
		ali.drawCircularKaryo(circularKaryoCoords);
		expect(ali.svgD3.selectAll('.karyoGroup').attr("transform")).toEqual("translate(" + defaultConf.graphicalParameters.width / 2 + "," + defaultConf.graphicalParameters.height / 2 + ")");
	});
	it('there should be exactly two karyos in the simple test svg', function(){
		var circularKaryoCoords = ali.getCircularKaryoCoords();
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
		var circularKaryoCoords = ali.getCircularKaryoCoords();
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
	    jasmine.addMatchers(customMatchers);
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
            	source0: {x: 300/2000 * linearKaryoCoords[0].width, y: linearKaryoCoords[0].y + linearKaryoCoords[0].height + defaultConf.graphicalParameters.linkKaryoDistance},
            	target0: {x: 100/1000 * linearKaryoCoords[1].width, y: linearKaryoCoords[1].y - defaultConf.graphicalParameters.linkKaryoDistance}, 
            	source1: {x: 800/2000 * linearKaryoCoords[0].width, y: linearKaryoCoords[0].y + linearKaryoCoords[0].height + defaultConf.graphicalParameters.linkKaryoDistance},
            	target1: {x: 600/1000 * linearKaryoCoords[1].width, y: linearKaryoCoords[1].y - defaultConf.graphicalParameters.linkKaryoDistance}
            }           
        ];
		expect(linearLinkCoords).toHaveSameLinearLinkCoordinates(expectedCoords);
	});
	it('getLinearLinkCoords method is supposed to work with simple test data (3 genomes, 3 chromosomes, 2 links)', function(){
		ali.setData({karyo:karyo4,features:features2, links:links2});
		ali.setFilters(filters4);
		var linearKaryoCoords = ali.getLinearKaryoCoords();
		var linearLinkCoords = ali.getLinearLinkCoords(linearKaryoCoords);
		var expectedCoords = [
		    {
		    	linkID : "l1", 
            	source0: {x: 300/2000 * linearKaryoCoords[0].width, y: linearKaryoCoords[0].y + linearKaryoCoords[0].height + defaultConf.graphicalParameters.linkKaryoDistance},
            	target0: {x: 100/1000 * linearKaryoCoords[1].width, y: linearKaryoCoords[1].y - defaultConf.graphicalParameters.linkKaryoDistance}, 
            	source1: {x: 800/2000 * linearKaryoCoords[0].width, y: linearKaryoCoords[0].y + linearKaryoCoords[0].height + defaultConf.graphicalParameters.linkKaryoDistance},
            	target1: {x: 600/1000 * linearKaryoCoords[1].width, y: linearKaryoCoords[1].y - defaultConf.graphicalParameters.linkKaryoDistance}
	        }, 
		    {
		    	linkID : "l2",
		    	source0: {x: 100/1000 * linearKaryoCoords[1].width, y: linearKaryoCoords[1].y + linearKaryoCoords[1].height + defaultConf.graphicalParameters.linkKaryoDistance},
            	target0: {x: 400/1000 * linearKaryoCoords[3].width, y: linearKaryoCoords[3].y - defaultConf.graphicalParameters.linkKaryoDistance}, 
            	source1: {x: 600/1000 * linearKaryoCoords[1].width, y: linearKaryoCoords[1].y + linearKaryoCoords[1].height + defaultConf.graphicalParameters.linkKaryoDistance},
            	target1: {x: 900/1000 * linearKaryoCoords[3].width, y: linearKaryoCoords[3].y - defaultConf.graphicalParameters.linkKaryoDistance}
	        }  
		];
		expect(linearLinkCoords).toHaveSameLinearLinkCoordinates(expectedCoords);
	});
	it('getLinearLinkCoords method is supposed to work with simple test data (2 genomes, 3 chromosomes, 2 links (one link is reverse complemented)', function(){
		ali.setData({karyo:karyo4, links:links3, features:features2});
		ali.setFilters(filters4);
		var linearKaryoCoords = ali.getLinearKaryoCoords();
		var linearLinkCoords = ali.getLinearLinkCoords(linearKaryoCoords);
		var expectedCoords = [
		    {
		    	linkID : "l1", 
            	source0: {x: 300/2000 * linearKaryoCoords[0].width, y: linearKaryoCoords[0].y + linearKaryoCoords[0].height + defaultConf.graphicalParameters.linkKaryoDistance},
            	target0: {x: 100/1000 * linearKaryoCoords[1].width, y: linearKaryoCoords[1].y - defaultConf.graphicalParameters.linkKaryoDistance}, 
            	source1: {x: 800/2000 * linearKaryoCoords[0].width, y: linearKaryoCoords[0].y + linearKaryoCoords[0].height + defaultConf.graphicalParameters.linkKaryoDistance},
            	target1: {x: 600/1000 * linearKaryoCoords[1].width, y: linearKaryoCoords[1].y - defaultConf.graphicalParameters.linkKaryoDistance}
		    },
		    {
		    	linkID: "l2",
		    	source0: {x: 1800/2000 * linearKaryoCoords[0].width, y: linearKaryoCoords[0].y + linearKaryoCoords[0].height + defaultConf.graphicalParameters.linkKaryoDistance},
		    	target0: {x: 900/1000 * linearKaryoCoords[2].width + linearKaryoCoords[2].x, y: linearKaryoCoords[2].y - defaultConf.graphicalParameters.linkKaryoDistance},
		    	source1: {x: 1900/2000 * linearKaryoCoords[0].width, y: linearKaryoCoords[0].y + linearKaryoCoords[0].height + defaultConf.graphicalParameters.linkKaryoDistance},
		    	target1: {x: 800/1000 * linearKaryoCoords[2].width + linearKaryoCoords[2].x, y: linearKaryoCoords[2].y - defaultConf.graphicalParameters.linkKaryoDistance}
		    }
		];
		expect(linearLinkCoords).toHaveSameLinearLinkCoordinates(expectedCoords);
	});
	it('getLinearLinkCoords method is supposed to work with simple test data (3 genomes, 2 chromosomes, 2 links (but one link is not between adjacent chromosomes, later it should not be drawn)', function(){
		ali.setData({karyo:karyo4,features:features2, links:links4});
		ali.setFilters(filters4);
		ali.filters.onlyShowAdjacentLinks = true;
		var linearKaryoCoords = ali.getLinearKaryoCoords();
		var linearLinkCoords = ali.getLinearLinkCoords(linearKaryoCoords);
		var expectedCoords = [
		{
			linkID : "l1", 
        	source0: {x: 300/2000 * linearKaryoCoords[0].width, y: linearKaryoCoords[0].y + linearKaryoCoords[0].height + defaultConf.graphicalParameters.linkKaryoDistance},
        	target0: {x: 100/1000 * linearKaryoCoords[1].width, y: linearKaryoCoords[1].y - defaultConf.graphicalParameters.linkKaryoDistance}, 
        	source1: {x: 800/2000 * linearKaryoCoords[0].width, y: linearKaryoCoords[0].y + linearKaryoCoords[0].height + defaultConf.graphicalParameters.linkKaryoDistance},
        	target1: {x: 600/1000 * linearKaryoCoords[1].width, y: linearKaryoCoords[1].y - defaultConf.graphicalParameters.linkKaryoDistance}
		},
		{
			linkID: "l2",
	    	source0: {x: 100/1000 * linearKaryoCoords[1].width, y: linearKaryoCoords[1].y + linearKaryoCoords[1].height + defaultConf.graphicalParameters.linkKaryoDistance},
	    	target0: {x: 400/1000 * linearKaryoCoords[3].width, y: linearKaryoCoords[3].y - defaultConf.graphicalParameters.linkKaryoDistance},
	    	source1: {x: 600/1000 * linearKaryoCoords[1].width, y: linearKaryoCoords[1].y + linearKaryoCoords[1].height + defaultConf.graphicalParameters.linkKaryoDistance},
	    	target1: {x: 900/1000 * linearKaryoCoords[3].width, y: linearKaryoCoords[3].y - defaultConf.graphicalParameters.linkKaryoDistance}
		}
		];
		expect(linearLinkCoords).toHaveSameLinearLinkCoordinates(expectedCoords);
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
        	source0: {x: 300/2000 * linearKaryoCoords[0].width, y: linearKaryoCoords[0].y + linearKaryoCoords[0].height + defaultConf.graphicalParameters.linkKaryoDistance},
        	target0: {x: 100/1000 * linearKaryoCoords[1].width, y: linearKaryoCoords[1].y - defaultConf.graphicalParameters.linkKaryoDistance}, 
        	source1: {x: 800/2000 * linearKaryoCoords[0].width, y: linearKaryoCoords[0].y + linearKaryoCoords[0].height + defaultConf.graphicalParameters.linkKaryoDistance},
        	target1: {x: 600/1000 * linearKaryoCoords[1].width, y: linearKaryoCoords[1].y - defaultConf.graphicalParameters.linkKaryoDistance}
		},
		{
			linkID: "l2",
	    	source0: {x: 100/1000 * linearKaryoCoords[1].width, y: linearKaryoCoords[1].y + linearKaryoCoords[1].height + defaultConf.graphicalParameters.linkKaryoDistance},
	    	target0: {x: 400/1000 * linearKaryoCoords[3].width, y: linearKaryoCoords[3].y - defaultConf.graphicalParameters.linkKaryoDistance},
	    	source1: {x: 600/1000 * linearKaryoCoords[1].width, y: linearKaryoCoords[1].y + linearKaryoCoords[1].height + defaultConf.graphicalParameters.linkKaryoDistance},
	    	target1: {x: 900/1000 * linearKaryoCoords[3].width, y: linearKaryoCoords[3].y - defaultConf.graphicalParameters.linkKaryoDistance}
		},
		{
			linkID: "l3",
			source0: {x: 300/2000 * linearKaryoCoords[0].width, y: linearKaryoCoords[0].y + linearKaryoCoords[0].height + defaultConf.graphicalParameters.linkKaryoDistance},
			target0: {x: 400/1000 * linearKaryoCoords[3].width, y: linearKaryoCoords[3].y - defaultConf.graphicalParameters.linkKaryoDistance},
			source1: {x: 800/2000 * linearKaryoCoords[0].width, y: linearKaryoCoords[0].y + linearKaryoCoords[0].height + defaultConf.graphicalParameters.linkKaryoDistance},
			target1: {x: 900/1000 * linearKaryoCoords[3].width, y: linearKaryoCoords[3].y - defaultConf.graphicalParameters.linkKaryoDistance}
		}
		];
		expect(linearLinkCoords).toHaveSameLinearLinkCoordinates(expectedCoords);
	});
	it('getLinearLinkCoords method is supposed to work with simple test data (3 genomes, 2 chromosomes, 3 links (but 2 links are not calculated, because their identity is less than the minLinkIdentity, which is set in the filters)', function(){
		ali.setData({karyo:karyo4,features:features2, links:links4});
		ali.setFilters(filters4);
		ali.filters.links.minLinkIdentity = 92;
		var linearKaryoCoords = ali.getLinearKaryoCoords();
		var linearLinkCoords = ali.getLinearLinkCoords(linearKaryoCoords);
		var expectedCoords = [
		{
			linkID: "l3",
			source0: {x: 300/2000 * linearKaryoCoords[0].width, y: linearKaryoCoords[0].y + linearKaryoCoords[0].height + defaultConf.graphicalParameters.linkKaryoDistance},
			target0: {x: 400/1000 * linearKaryoCoords[3].width, y: linearKaryoCoords[3].y - defaultConf.graphicalParameters.linkKaryoDistance},
			source1: {x: 800/2000 * linearKaryoCoords[0].width, y: linearKaryoCoords[0].y + linearKaryoCoords[0].height + defaultConf.graphicalParameters.linkKaryoDistance},
			target1: {x: 900/1000 * linearKaryoCoords[3].width, y: linearKaryoCoords[3].y - defaultConf.graphicalParameters.linkKaryoDistance}
		}
		];
		expect(linearLinkCoords).toHaveSameLinearLinkCoordinates(expectedCoords);
	});
	it('getLinearLinkCoords method is supposed to work with simple test data (3 genomes, 2 chromosomes, 3 links (but 2 links are not calculated, because the identity of one link is less than the minLinkIdentity and the identity of the other link is greater than the maxLinkIdentity)', function(){
		ali.setData({karyo:karyo4,features:features2, links:links4});
		ali.setFilters(filters4);
		ali.filters.links.minLinkIdentity = 89;
		ali.filters.links.maxLinkIdentity = 100;
		var linearKaryoCoords = ali.getLinearKaryoCoords();
		var linearLinkCoords = ali.getLinearLinkCoords(linearKaryoCoords);
		var expectedCoords = [
			{
				linkID : "l1", 
				source0: {x: 300/2000 * linearKaryoCoords[0].width, y: linearKaryoCoords[0].y + linearKaryoCoords[0].height + defaultConf.graphicalParameters.linkKaryoDistance},
				target0: {x: 100/1000 * linearKaryoCoords[1].width, y: linearKaryoCoords[1].y - defaultConf.graphicalParameters.linkKaryoDistance}, 
				source1: {x: 800/2000 * linearKaryoCoords[0].width, y: linearKaryoCoords[0].y + linearKaryoCoords[0].height + defaultConf.graphicalParameters.linkKaryoDistance},
				target1: {x: 600/1000 * linearKaryoCoords[1].width, y: linearKaryoCoords[1].y - defaultConf.graphicalParameters.linkKaryoDistance}
			},
			{
				linkID: "l3",
				source0: {x: 300/2000 * linearKaryoCoords[0].width, y: linearKaryoCoords[0].y + linearKaryoCoords[0].height + defaultConf.graphicalParameters.linkKaryoDistance},
				target0: {x: 400/1000 * linearKaryoCoords[3].width, y: linearKaryoCoords[3].y - defaultConf.graphicalParameters.linkKaryoDistance},
				source1: {x: 800/2000 * linearKaryoCoords[0].width, y: linearKaryoCoords[0].y + linearKaryoCoords[0].height + defaultConf.graphicalParameters.linkKaryoDistance},
				target1: {x: 900/1000 * linearKaryoCoords[3].width, y: linearKaryoCoords[3].y - defaultConf.graphicalParameters.linkKaryoDistance}
			}
		];
		expect(linearLinkCoords).toHaveSameLinearLinkCoordinates(expectedCoords);
	});
	it('getLinearLinkCoords method is supposed to work with simple test data (2 genomes, 2 chromosomes, 1 links (but the link is not calculated, because its length is less than minLinkLength and maxLinkLength', function(){
		ali.setData({karyo:karyo,features:features5, links:links8});
		ali.setFilters(filters7);
		ali.filters.links.minLinkLength = 50;
		ali.filters.links.maxLinkLength = 95;
		var linearKaryoCoords = ali.getLinearKaryoCoords();
		var linearLinkCoords = ali.getLinearLinkCoords(linearKaryoCoords);
		var expectedCoords = [];
		expect(linearLinkCoords).toHaveSameLinearLinkCoordinates(expectedCoords);
	});
	
});

describe('The getCircularLinkCoords method of AliTV objects is supposed to calculate coordinates for the links in the circular layout', function(){
	beforeEach(function() {
	    jasmine.addMatchers(customMatchers);
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
		expect(circularLinkCoords).toHaveSameCircularLinkCoordinates(expectedCoords);
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
		expect(circularLinkCoords).toHaveSameCircularLinkCoordinates(expectedCoords);
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
		ali.filters.onlyShowAdjacentLinks = true;
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
		ali.setData(data);
		ali.setFilters(filters);
		var ticks = ali.getGenomeDistance();
		var linearKaryoCoords = ali.getLinearKaryoCoords();
		var ticks = ali.getLinearTickCoords(linearKaryoCoords);
		var expectedTicks = [{ x1: 0, y1: -5, x2: 0, y2: 35 }, { x1: 50, y1: -5, x2: 50, y2: 35 }, { x1: 100, y1: -5, x2: 100, y2: 35 }, { x1: 150, y1: -5, x2: 150, y2: 35 }, { x1: 200, y1: -5, x2: 200, y2: 35 }, { x1: 250, y1: -5, x2: 250, y2: 35 }, { x1: 300, y1: -5, x2: 300, y2: 35 }, { x1: 350, y1: -5, x2: 350, y2: 35 }, { x1: 400, y1: -5, x2: 400, y2: 35 }, { x1: 450, y1: -5, x2: 450, y2: 35 }, { x1: 500, y1: -5, x2: 500, y2: 35 }, { x1: 550, y1: -5, x2: 550, y2: 35 }, { x1: 600, y1: -5, x2: 600, y2: 35 }, { x1: 650, y1: -5, x2: 650, y2: 35 }, { x1: 700, y1: -5, x2: 700, y2: 35 }, { x1: 750, y1: -5, x2: 750, y2: 35 }, { x1: 800, y1: -5, x2: 800, y2: 35 }, { x1: 850, y1: -5, x2: 850, y2: 35 }, { x1: 900, y1: -5, x2: 900, y2: 35 }, { x1: 950, y1: -5, x2: 950, y2: 35 }, { x1: 1000, y1: -5, x2: 1000, y2: 35 }, { x1: 0, y1: 965, x2: 0, y2: 1005 }, { x1: 50, y1: 965, x2: 50, y2: 1005 }, { x1: 100, y1: 965, x2: 100, y2: 1005 }, { x1: 150, y1: 965, x2: 150, y2: 1005 }, { x1: 200, y1: 965, x2: 200, y2: 1005 }, { x1: 250, y1: 965, x2: 250, y2: 1005 }, { x1: 300, y1: 965, x2: 300, y2: 1005 }, { x1: 350, y1: 965, x2: 350, y2: 1005 }, { x1: 400, y1: 965, x2: 400, y2: 1005 }, { x1: 450, y1: 965, x2: 450, y2: 1005 }, { x1: 500, y1: 965, x2: 500, y2: 1005 } ]
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

describe('The fadeOutLinks method also works in the circular layout', function(){
	var svg = $('<svg></svg>');
	var ali = new AliTV(svg);
	beforeEach(function(done){
		ali.setData({karyo:karyo5, features: features3, links: links4});
		ali.setFilters(filters5);
		ali.drawCircular();
		done();
	});
	
	it("if the mouse pointer enters a chromosome links are filtered and their opacity would be set on 0.1", function(done) {
		ali.svg.find('.karyo').eq(2).d3Trigger("mouseover");
		setTimeout(function(){
			expect(ali.svg.find('.link').css("opacity")).toEqual("0.1");
			done();
		}, 1000);
	 });
	
	it("if the mouse pointer leaves a chromsome the link opacity is set back to 1", function(done) {
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
	beforeEach(function() {
	    jasmine.addMatchers(customMatchers);
	    ali.setData(data);
	    ali.setFilters(filters);
	});
	
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
		                      {'karyo': 'c1', 'x': 0 + defaultConf.graphicalParameters.width, 'y': 0, 'width': defaultConf.graphicalParameters.width * (-1), 'height': defaultConf.graphicalParameters.karyoHeight, 'genome': 0},
		                      {'karyo': 'c2', 'x': 0, 'y': ali.getGenomeDistance(), 'width': defaultConf.graphicalParameters.width/2, 'height': defaultConf.graphicalParameters.karyoHeight, 'genome': 1}
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
		                      {'karyo': 'c1', 'x': 0, 'y': 0, 'width': defaultConf.graphicalParameters.width, 'height': defaultConf.graphicalParameters.karyoHeight, 'genome': 0},
		                      {'karyo': 'c2', 'x': 0, 'y': ali.getGenomeDistance(), 'width': defaultConf.graphicalParameters.width/2, 'height': defaultConf.graphicalParameters.karyoHeight, 'genome': 1}
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
		var expectedLinks = [{ linkID: 'l1', source0: { x: 850, y: 40 }, source1: { x: 600, y: 40 }, target0: { x: 50, y: 960 }, target1: { x: 300, y: 960 }}];
		
		setTimeout(function(){
			expect(expectedLinks).toEqual(linearLinkCoords);
			done();
		}, 1000);
	});
	it('the click event should also work in the circular layout', function(done){
		ali.filters.karyo.chromosomes.c1.reverse = false;
		ali.drawCircular();
		ali.svg.find('.karyo').eq(0).d3Trigger("click");
		var circularKaryoCoords = ali.getCircularKaryoCoords();
		var expAnglePerBase = 2*Math.PI/(3000+2*defaultConf.graphicalParameters.karyoDistance);
		var expAnglePerSpace = expAnglePerBase * defaultConf.graphicalParameters.karyoDistance;
		var expectedCoords = [
            {'karyo': 'c1', 'endAngle': 0, 'startAngle': 2000*expAnglePerBase},
            {'karyo': 'c2', 'startAngle': 2000*expAnglePerBase + expAnglePerSpace, 'endAngle': 3000*expAnglePerBase + expAnglePerSpace}
        ];
		
		setTimeout(function(){
			expect(circularKaryoCoords).toHaveSameAngles(expectedCoords);
			done();
		}, 1000);
	});
});

describe('The drawEqualLayout method is supposed to draw the layout which is equal to the current layout', function(){
	var svg = $('<svg></svg>');
	var ali = new AliTV(svg);
	it('drawEqualLayout method is supposed to be a function', function(){
		expect(typeof ali.drawEqualLayout).toEqual('function');
	});	
	it('if the current layout is "linear" after calling drawEqualLayout the returned layout is "linear"', function(){
		var layout = "linear";
		ali.setData(data);
		ali.setFilters(filters);
		expect(ali.drawEqualLayout(layout)).toEqual("linear");
	});	
	it('if the current layout is "circular" after calling drawEqualLayout the returned layout is "circular"', function(){
		var layout = "circular";
		ali.setData(data);
		ali.setFilters(filters);
		expect(ali.drawEqualLayout(layout)).toEqual("circular");
	});	
});

describe('The filterChromosomes method is supposed to filter all visible chromosomes', function(){
	var svg = $('<svg></svg>');
	var ali = new AliTV(svg);
	it('filterChromosomes method is supposed to be a function', function(){
		expect(typeof ali.filterChromosomes).toEqual('function');
	});	
	it('filterChromosomes method is supposed to return only four chromosomes, because some links are filtered according to their identity and the user wants to skip chromosomes without visible links', function(){
		var svg = $('<svg></svg>');
		var ali = new AliTV(svg);
		ali.setData({karyo: karyo9, links: links13, features: features10});
		ali.setFilters(filters15);
		ali.filters.showAllChromosomes = false;
		ali.filters.skipChromosomesWithoutVisibleLinks = true;
		ali.filters.links.minLinkIdentity = 50;
		ali.filters.links.maxLinkIdentity = 99;
		var expectedChromosomes = { c2: { genome_id: 0, length: 1000, seq: null }, c3: { genome_id: 1, length: 1000, seq: null }, c4: { genome_id: 1, length: 1000, seq: null }, c5: { genome_id: 2, length: 500, seq: null }};
		expect(ali.filterChromosomes()).toEqual(expectedChromosomes);
	});
	it('filterChromosomes method is supposed to return only chromosomes which have linkage information', function(){
		var svg = $('<svg></svg>');
		var ali = new AliTV(svg);
		ali.setData({karyo: karyo4, links: links12, features: features9});
		ali.setFilters(filters4);
		ali.filters.showAllChromosomes = false;
		ali.filters.skipChromosomesWithoutLinks = true;
		var expectedChromosomes = { c1: { genome_id: 0, length: 2000, seq: null }, c2: { genome_id: 1, length: 1000, seq: null }, c3: { genome_id: 1, length: 1000, seq: null }};
		expect(ali.filterChromosomes()).toEqual(expectedChromosomes);
	});
});

describe('The filterVisibleChromosomes method is supposed to filter all chromosomes which are set visible in the filters', function(){
	var svg = $('<svg></svg>');
	var ali = new AliTV(svg);
	it('filterVisibleChromosomes method is supposed to be a function', function(){
		expect(typeof ali.filterVisibleChromosomes).toEqual('function');
	});	
	it('the filterVisibleChromosomes method is supposed to return all chromosomes, because they are all set visible', function(){
		ali.setData({karyo: karyo3});
		ali.setFilters(filters3);
		var currentVisibleChromosomes = ali.data.karyo.chromosomes;
		var expectedChromosomes = { c1: { genome_id: 0, length: 2000, seq: null }, c2: { genome_id: 1, length: 1000, seq: null }, c3: { genome_id: 2, length: 1000, seq: null }};
		expect(ali.filterVisibleChromosomes(currentVisibleChromosomes)).toEqual(expectedChromosomes);
	});
	it('the filterVisibleChromosomes method is supposed to return only two chromosomes, because they are set visible', function(){
		ali.setData({karyo: karyo3});
		ali.setFilters(filters9);
		var currentVisibleChromosomes = ali.data.karyo.chromosomes;
		var expectedChromosomes = { c1: { genome_id: 0, length: 2000, seq: null }, c3: { genome_id: 2, length: 1000, seq: null }};
		expect(ali.filterVisibleChromosomes(currentVisibleChromosomes)).toEqual(expectedChromosomes);
	});
});

describe('The filterChromosomeOrder method is supposed to create a new order array, which contains the order of all visible chromosomes', function(){
	var svg = $('<svg></svg>');
	var ali = new AliTV(svg);
	it('filterChromosomeOrder method is supposed to be a function', function(){
		expect(typeof ali.filterChromosomeOrder).toEqual('function');
	});	
	it('the filterChromosomeOrder method is supposed to return the order of chromosomes which is set in the filters, because all chromosomes are set visible', function(){
		var svg = $('<svg></svg>');
		var ali = new AliTV(svg);
		ali.setData({karyo: karyo8});
		ali.setFilters(filters10);
		var currentVisibleChromosomes = ali.filterChromosomes(ali.data.karyo.chromosomes);
		var expectedOrder = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7'];
		expect(ali.filterChromosomeOrder(currentVisibleChromosomes)).toEqual(expectedOrder);
	});
	it('the filterChromosomesOrder method is supposed to return the expected order of chromosomes, because two chromsomes are not set visible', function(){
		var svg = $('<svg></svg>');
		var ali = new AliTV(svg);
		ali.setData({karyo: karyo8});
		ali.setFilters(filters13);
		ali.filters.showAllChromosomes = false;
		var currentVisibleChromosomes = ali.filterChromosomes(ali.data.karyo.chromosomes);
		var expectedOrder = ['c1', 'c2', 'c4', 'c7'];
		expect(ali.filterChromosomeOrder(currentVisibleChromosomes)).toEqual(expectedOrder);
	});
});

describe('The filterLinks method is supposed to filter all visible links', function(){
	var svg = $('<svg></svg>');
	var ali = new AliTV(svg);
	it('filterLinks method is supposed to be a function', function(){
		expect(typeof ali.filterLinks).toEqual('function');
	});	
});

describe('The filterVisibleLinks method is supposed to filter links which have their source or target only on visible chromosomes', function(){
	var svg = $('<svg></svg>');
	var ali = new AliTV(svg);
	it('filterVisibleLinks method is supposed to be a function', function(){
		expect(typeof ali.filterVisibleLinks).toEqual('function');
	});	
	it('the filterVisibleLinks method is supposed to return the expected links, because some are on not visible chromosomes', function(){
		var svg = $('<svg></svg>');
		var ali = new AliTV(svg);
		ali.setData({karyo: karyo2, features: features8, links: links12});
		ali.setFilters(filters14);
		ali.filters.showAllChromosomes = false;
		var visibleChromosomes = ali.filterChromosomes();
		var expectedLinks = {"l1": {'source': 'f1', 'target': 'f2', 'identity': 75}};
		expect(ali.filterVisibleLinks(visibleChromosomes)).toEqual(expectedLinks);
	});
});

describe('The filterChromosomeWithoutLinkageInformation method is supposed to filter all chromosomes which have no links', function(){
	var svg = $('<svg></svg>');
	var ali = new AliTV(svg);
	it('filterChromosomeWithoutLinkageInformation method is supposed to be a function', function(){
		expect(typeof ali.filterChromosomeWithoutLinkageInformation).toEqual('function');
	});	
	it('The filterChromosomeWithoutLinkageInformation method is supposed to return only chromosome which have links', function(){
		var svg = $('<svg></svg>');
		var ali = new AliTV(svg);
		ali.setData({karyo: karyo4, links: links12, features: features9});
		ali.setFilters(filters4);
		var visibleChromosomes = ali.data.karyo.chromosomes;
		var expectedChromosomes = { c1: { genome_id: 0, length: 2000, seq: null }, c2: { genome_id: 1, length: 1000, seq: null }, c3: { genome_id: 1, length: 1000, seq: null }}
		expect(ali.filterChromosomeWithoutLinkageInformation(visibleChromosomes)).toEqual(expectedChromosomes);
	});
});

describe('The filterChromosomeWithoutVisibleLinks method is supposed to filter all chromosomes which have no visible links with the current configurations', function(){
	var svg = $('<svg></svg>');
	var ali = new AliTV(svg);
	it('filterChromosomeWithoutVisibleLinks method is supposed to be a function', function(){
		expect(typeof ali.filterChromosomeWithoutVisibleLinks).toEqual('function');
	});	
	it('filterChromosomesWithoutVisibleLinks method is supposed to return four of six chromosomes, because two have no visible links and are filtered', function(){
		var svg = $('<svg></svg>');
		var ali = new AliTV(svg);
		ali.setData({karyo: karyo9, links: links13, features: features10});
		ali.setFilters(filters15);
		ali.filters.showAllChromosomes = false;
		ali.filters.skipChromosomesWithoutVisibleLinks = true;
		ali.filters.links.minLinkIdentity = 50;
		ali.filters.links.maxLinkIdentity = 99;
		var visibleChromosomes = ali.data.karyo.chromosomes;
		var expectedChromosomes = { c2: { genome_id: 0, length: 1000, seq: null }, c3: { genome_id: 1, length: 1000, seq: null }, c4: { genome_id: 1, length: 1000, seq: null }, c5: { genome_id: 2, length: 500, seq: null }};
		expect(ali.filterChromosomeWithoutVisibleLinks(visibleChromosomes)).toEqual(expectedChromosomes);
	});
});

describe('The filterLinksByIdentity method is supposed to filter all links whose identity is greater than the maxIdentity oder less than the minIdentity', function(){
	var svg = $('<svg></svg>');
	var ali = new AliTV(svg);
	it('filterLinksByIdentity method is supposed to be a function', function(){
		expect(typeof ali.filterLinksByIdentity).toEqual('function');
	});	
	it('filterLinksByIdentity method is supposed to filter the assigned links according to the minLinkIdentity and the maxLinkIdentity', function(){
		var svg = $('<svg></svg>');
		var ali = new AliTV(svg);
		ali.setData({links: links7});
		ali.setFilters(filters14);
		ali.filters.links.minLinkIdentity = 50;
		ali.filters.links.maxLinkIdentity = 70;
		var expectedLinks = {"l2": { source: 'f2', target: 'f3', identity: 50 },"l3": { source: 'f2', target: 'f4', identity: 60 }, "l4": { source: 'f1', target: 'f4', identity: 70 }};
		var links = ali.data.links;
		expect(ali.filterLinksByIdentity(links)).toEqual(expectedLinks);
	});	
});

describe('The filterLinksByLength method is supposed to filter all links whose length is greater than the maxLength oder less than the minLength', function(){
	var svg = $('<svg></svg>');
	var ali = new AliTV(svg);
	it('filterLinksByLength method is supposed to be a function', function(){
		expect(typeof ali.filterLinksByLength).toEqual('function');
	});		
});

describe('The filterLinksByAdjacency method is supposed to filter all links which are adjacent', function(){
	var svg = $('<svg></svg>');
	var ali = new AliTV(svg);
	it('filterLinksByAdjacency method is supposed to be a function', function(){
		expect(typeof ali.filterLinksByAdjacency).toEqual('function');
	});	
});

describe('The drawPhylogeneticTree method is supposed to draw a phylogenetic tree next to the genomes', function(){
	var svg = $('<svg></svg>');
	var ali = new AliTV(svg);
	it('drawPhylogeneticTree method is supposed to be a function', function(){
		expect(typeof ali.drawPhylogeneticTree).toEqual('function');
	});	
	it('if the function is called we should have exactly one tree group', function(){
		var svg = $('<svg></svg>');
		var ali = new AliTV(svg);
		ali.setData(data5);
		ali.setFilters(filters);
		ali.drawPhylogeneticTree();
		expect(ali.svgD3.selectAll('.treeGroup').size()).toEqual(1);
	});	
	it('if the user wants to draw a tree he sets drawTree equal true, then one tree is drawn', function(){
			var svg = $('<svg></svg>');
			var ali = new AliTV(svg);
			ali.setData(data5);
			ali.setFilters(filters);
			ali.conf.tree.drawTree = true;
			ali.drawLinear();
			expect(ali.svgD3.selectAll('.treeGroup').size()).toEqual(1);
	});
	it('then the user wants to remove the tree, therefore he sets drawTree equal false and the tree should be removed', function(){
			var svg = $('<svg></svg>');
			var ali = new AliTV(svg);
			ali.setData(data5);
			ali.setFilters(filters);
			ali.conf.tree.drawTree = false;
			ali.drawLinear();
			expect(ali.svgD3.selectAll('.treeGroup').size()).toEqual(0);
	});
	it('if the tree is drawn on the right side the tree drawing area is transformed', function(){
		var svg = $('<svg></svg>');
		var ali = new AliTV(svg);
		ali.setData(data5);
		ali.setFilters(filters);
		ali.conf.tree.drawTree = true;
		ali.conf.tree.orientation = "right";
		ali.drawLinear();
		expect(ali.svgD3.selectAll('.treeGroup').attr("transform")).toEqual("translate(1000, 0)");
});
});

describe('The hasTree method should check if the user provides tree data', function(){
	var svg = $('<svg></svg>');
	var ali = new AliTV(svg);
	it('hasTree method is supposed to be a function', function(){
		expect(typeof ali.hasTree).toEqual('function');
	});	
	it('if there is no tree data the method should return false', function(){
		ali.setData(data);
		ali.setFilters(filters);
		expect(ali.hasTree()).toEqual(false);
	});
	it('if the tree object exists but it is empty the method should return false', function(){
		ali.setData(data6);
		ali.setFilters(filters);
		expect(ali.hasTree()).toEqual(false);
	});
	it('if the tree object exists but it is null the method should return false', function(){
		ali.setData(data7);
		ali.setFilters(filters);
		expect(ali.hasTree()).toEqual(false);
	});
	it('if the tree data exists the method should return true', function(){
		ali.setData(data5);
		ali.setFilters(filters);
		expect(ali.hasTree()).toEqual(true);
	});
});

describe('The getLinearFeatureCoords method is supposed to calculate coordinates for feature classes in the linear layout', function(){
	var svg = $('<svg></svg>');
	var ali = new AliTV(svg);
	it('getLinearFeatureCoords method is supposed to be a function', function(){
		expect(typeof ali.getLinearFeatureCoords).toEqual('function');
	});
	it('getLinearFeatureCoords method is supposed to return linearFeatureCoords', function(){
		ali.setData({karyo: karyo3, features: features11});
		ali.setFilters(filters3);
		var linearKaryoCoords = ali.getLinearKaryoCoords();
		var linearFeatureCoords = ali.getLinearFeatureCoords(linearKaryoCoords);
		expect(linearFeatureCoords).toBeDefined();
	});
	it('getLinearFeatureCoords method is supposed to return the expected coordinates for three features on three chromosomes', function(){
		ali.setData({karyo: karyo3, features: features11});
		ali.setFilters(filters3);
		ali.conf.features.showAllFeatures = true;
		var expectedFeatures = [{"id": "f1", "height": defaultConf.features.gen.height, "x": ali.data.features["f1"].start * 1000 / 2000, "width": Math.abs(ali.data.features["f1"].end - ali.data.features["f1"].start) * 1000 / 2000, "y": 0},
		                        {"id": "f2", "height": defaultConf.features.gen.height, "x": ali.data.features["f2"].start * 500 / 1000, "width": Math.abs(ali.data.features["f2"].end - ali.data.features["f2"].start) * 500 / 1000, "y": 485},
		                        {"id": "f3", "height": defaultConf.features.gen.height, "x": ali.data.features["f3"].start * 500 / 1000, "width": Math.abs(ali.data.features["f3"].end - ali.data.features["f3"].start) * 500 / 1000, "y": 970}];
		var linearKaryoCoords = ali.getLinearKaryoCoords();
		var linearFeatureCoords = ali.getLinearFeatureCoords(linearKaryoCoords);
		expect(linearFeatureCoords).toEqual(expectedFeatures);
	});
	it('getLinearFeatureCoords method is supposed to return the expected coordinates for two inverted repeats on one chromosome, they should be drawn as arrows', function(){
		ali.setData({karyo: karyo3, features: features14});
		ali.setFilters(filters3);
		ali.conf.features.showAllFeatures = true;
		var expectedFeatures = [{"id": "f1", arrowData: [{x: ali.data.features["f1"].start * 1000/2000, y: 0 +  1/5 * defaultConf.features.invertedRepeat.height}, 
		                                                 {x: ali.data.features["f1"].start * 1000/2000 + 5/6 * Math.abs(ali.data.features["f1"].end - ali.data.features["f1"].start) * 1000 / 2000, y: 0 + 1/5 * defaultConf.features.invertedRepeat.height}, 
		                                                 {x: ali.data.features["f1"].start * 1000/2000 + 5/6 * Math.abs(ali.data.features["f1"].end - ali.data.features["f1"].start) * 1000 / 2000, y: 0}, 
		                                                 {x: ali.data.features["f1"].start * 1000/2000 + Math.abs(ali.data.features["f1"].end - ali.data.features["f1"].start) * 1000 / 2000, y: 0 +  1/2 * defaultConf.features.invertedRepeat.height}, 
		                                                 {x: ali.data.features["f1"].start * 1000/2000 + 5/6 * Math.abs(ali.data.features["f1"].end - ali.data.features["f1"].start) * 1000 / 2000, y: 0 + defaultConf.features.invertedRepeat.height},
		                                                 {x: ali.data.features["f1"].start * 1000/2000 + 5/6 * Math.abs(ali.data.features["f1"].end - ali.data.features["f1"].start) * 1000 / 2000, y: 0 + 4/5 * defaultConf.features.invertedRepeat.height},
		                                                 {x: ali.data.features["f1"].start * 1000/2000, y: 0 + 4/5 * defaultConf.features.invertedRepeat.height}]}];
		var linearKaryoCoords = ali.getLinearKaryoCoords();
		var linearFeatureCoords = ali.getLinearFeatureCoords(linearKaryoCoords);
		expect(linearFeatureCoords).toEqual(expectedFeatures);
	});
});

describe('The drawLinearFeatures method of AliTV objects is supposed to draw features on the chromosomes', function(){
	var svg = $('<svg></svg>');
	var ali = new AliTV(svg);
	ali.setData({karyo: karyo3, features: features11});
	ali.setFilters(filters3);
	ali.conf.features.showAllFeatures = true;
	it('drawLinearFeatures method is supposed to be a function', function(){
		expect(typeof ali.drawLinearFeatures).toEqual('function');
	});
	it('there should be exactly one featureGroup in the simple test svg', function(){
		ali.setData({karyo: karyo3, features: features11});
		ali.setFilters(filters3);
		var linearKaryoCoords = ali.getLinearKaryoCoords();
		var linearFeatureCoords = ali.getLinearFeatureCoords(linearKaryoCoords);
		ali.drawLinearFeatures(linearFeatureCoords);
		expect(ali.svgD3.selectAll('.featureGroup').size()).toEqual(1);
	});
	it('there should be exactly four features (two genes and two inverted repeats) in the simple test svg', function(){
		ali.setData({karyo: karyo3, features: features15});
		ali.setFilters(filters3);
		var linearKaryoCoords = ali.getLinearKaryoCoords();
		var linearFeatureCoords = ali.getLinearFeatureCoords(linearKaryoCoords);
		ali.drawLinearFeatures(linearFeatureCoords);
		expect(ali.svgD3.selectAll('.feature').size()).toEqual(4);
	});
	it('there should be exactly four features in a more complex test svg, two features are on a reverse chromosome', function(){
		ali.setData({karyo: karyo10, features: features15});
		ali.setFilters(filters16);
		var linearKaryoCoords = ali.getLinearKaryoCoords();
		var linearFeatureCoords = ali.getLinearFeatureCoords(linearKaryoCoords);
		ali.drawLinearFeatures(linearFeatureCoords);
		expect(ali.svgD3.selectAll('.feature').size()).toEqual(4);
	});
	it('the drawn features have the expected height', function(){
		ali.setData({karyo: karyo3, features: features11});
		ali.setFilters(filters3);
		var linearKaryoCoords = ali.getLinearKaryoCoords();
		var linearFeatureCoords = ali.getLinearFeatureCoords(linearKaryoCoords);
		ali.drawLinearFeatures(linearFeatureCoords);
		// This test checks only the height attribute of the first selected element
		expect(Number(ali.svgD3.selectAll('.feature').attr("height"))).toEqual(defaultConf.features.gen.height);
	});
	it('if a tree is drawn the feature group should be transformed', function(){
		ali.setData(data8);
		ali.setFilters(filters);
		ali.conf.labels.showAllLabels = false;
		ali.conf.tree.drawTree = true;
		ali.drawLinear();
		expect(ali.svgD3.selectAll('.featureGroup').attr("transform")).toEqual("translate(" + defaultConf.graphicalParameters.treeWidth + ", 0)");
	});
	it('if a tree is drawn and all labels should be shown the feature group is transformed', function(){
		ali.setData(data8);
		ali.setFilters(filters);
		ali.conf.labels.showAllLabels = true;
		ali.conf.tree.drawTree = true;
		ali.drawLinear();
		expect(ali.svgD3.selectAll('.featureGroup').attr("transform")).toEqual("translate(" + (defaultConf.graphicalParameters.treeWidth + defaultConf.graphicalParameters.genomeLabelWidth) + ", 0)");
	});
});

describe('The getGenomeLabelCoords method is supposed to calculate the coords for adding genome labels', function(){
	var svg = $('<svg></svg>');
	var ali = new AliTV(svg);
	it('getGenomeLabelCoords method is supposed to be a function', function(){
		expect(typeof ali.getGenomeLabelCoords).toEqual('function');
	});
	it('getGenomeLabelCoords method is supposed to return the array linearGenomeLabelCoords, which should be defined', function(){
		ali.setData(data);
		ali.setFilters(filters);
		var linearGenomeLabelCoords = ali.getGenomeLabelCoords()
		expect(linearGenomeLabelCoords).toBeDefined();
	});
	it('getGenomeLabelCoords method is supposed to return the expected linearGenomeLabelCoords', function(){
		ali.setData({karyo:karyo7});
		ali.setFilters(filters4);		
		var expectedCoords = [{name: 0, x: 1/2 * defaultConf.graphicalParameters.genomeLabelWidth, y: 0 * ali.getGenomeDistance() + 0.9 * defaultConf.graphicalParameters.karyoHeight}, {name: 1, x: 1/2 * defaultConf.graphicalParameters.genomeLabelWidth, y: 1 * ali.getGenomeDistance() + 0.9 * defaultConf.graphicalParameters.karyoHeight}, {name: 2, x: 1/2 * defaultConf.graphicalParameters.genomeLabelWidth, y: 2 * ali.getGenomeDistance() + 0.9 * defaultConf.graphicalParameters.karyoHeight}];
		var linearGenomeLabelCoords = ali.getGenomeLabelCoords()
		expect(linearGenomeLabelCoords).toEqual(expectedCoords);
	});
});

describe('The drawLinearGenomeLabels method of AliTV objects is supposed to draw genome labels next to the chromosomes', function(){
	var svg = $('<svg></svg>');
	var ali = new AliTV(svg);
	it('drawLinearFeatures method is supposed to be a function', function(){
		expect(typeof ali.drawLinearGenomeLabels).toEqual('function');
	});
	it('there should be exactly one genomeLabelGroup in the simple test svg', function(){
		ali.setData(data);
		ali.setFilters(filters);
		var linearGenomeLabelCoords = ali.getGenomeLabelCoords();
		ali.drawLinearGenomeLabels(linearGenomeLabelCoords);
		expect(ali.svgD3.selectAll('.genomeLabelGroup').size()).toEqual(1);
	});
	it('if a tree is drawn the genomeLabel group should be transformed', function(){
		ali.setData(data8);
		ali.setFilters(filters);
		ali.conf.labels.showAllLabels = true;
		ali.conf.tree.drawTree = true;
		ali.drawLinear();
		expect(ali.svgD3.selectAll('.genomeLabelGroup').attr("transform")).toEqual("translate(" + defaultConf.graphicalParameters.treeWidth + ", 0)");
	});
});

describe('The getChromosomeLabelCoords method is supposed to calculate the coords for adding labels to the chromosomes', function(){
	var svg = $('<svg></svg>');
	var ali = new AliTV(svg);
	it('getChromosomeLabelCoords method is supposed to be a function', function(){
		expect(typeof ali.getChromosomeLabelCoords).toEqual('function');
	});
	it('getChromsomeLabelCoords method is supposed to return the array linearChromosomeLabelCoords, which should be defined', function(){
		ali.setData(data);
		ali.setFilters(filters);
		var linearKaryoCoords = ali.getLinearKaryoCoords();
		var linearChromosomeLabelCoords = ali.getChromosomeLabelCoords(linearKaryoCoords);
		expect(linearChromosomeLabelCoords).toBeDefined();
	});
	it('getChromsomeLabelCoords method is supposed to return the expected linearChromsomeLabelCoords', function(){
		ali.setData(data);
		ali.setFilters(filters);	
		var linearKaryoCoords = ali.getLinearKaryoCoords();
		var linearChromosomeLabelCoords = ali.getChromosomeLabelCoords(linearKaryoCoords);
		var expectedCoords = [{name: "c1", y: 0 + 0.85 * defaultConf.graphicalParameters.karyoHeight, x: 0 + 1/2 * 1000}, {name: "c2", x: 0 + 1/2 * 500, y: 970 + 0.85 * defaultConf.graphicalParameters.karyoHeight}];
		expect(linearChromosomeLabelCoords).toEqual(expectedCoords);
	});
});

describe('The drawLinearChromosomeLabels method of AliTV objects is supposed to draw chromosome labels next to the chromosomes', function(){
	var svg = $('<svg></svg>');
	var ali = new AliTV(svg);
	it('drawLinearChromosomeLabels method is supposed to be a function', function(){
		expect(typeof ali.drawLinearChromosomeLabels).toEqual('function');
	});
	it('there should be exactly one chromosomeLabelGroup in the simple test svg', function(){
		ali.setData(data);
		ali.setFilters(filters);
		var linearKaryoCoords = ali.getLinearKaryoCoords();
		var linearChromosomeLabelCoords = ali.getChromosomeLabelCoords(linearKaryoCoords);
		ali.drawLinearChromosomeLabels(linearChromosomeLabelCoords);
		expect(ali.svgD3.selectAll('.chromosomeLabelGroup').size()).toEqual(1);
	});
	it('if the default configuration of showChromosomeLabels is false no chromosomes are drawn', function(){
		var svg = $('<svg></svg>');
		var ali = new AliTV(svg);
		ali.setData(data);
		ali.setFilters(filters);
		ali.conf.labels.chromosome.showChromosomeLabels = false;
		ali.conf.labels.showAllLabels = false;
		ali.drawLinear();
		expect(ali.svgD3.selectAll('.chromosomeLabelGroup').size()).toEqual(0);
	});
});

describe('The getFeatureLabelCoords method is supposed to calculate the coords for adding labels to the features', function(){
	var svg = $('<svg></svg>');
	var ali = new AliTV(svg);
	it('getFeatureLabelCoords method is supposed to be a function', function(){
		expect(typeof ali.getFeatureLabelCoords).toEqual('function');
	});
	it('getFeatureLabelCoords method is supposed to return the array linearFeatureLabelCoords, which should be defined', function(){
		ali.setData(data8);
		ali.setFilters(filters);
		ali.conf.features.showAllFeatures = true;
		var linearKaryoCoords = ali.getLinearKaryoCoords();
		var linearFeatureCoords = ali.getLinearFeatureCoords(linearKaryoCoords);
		var linearFeatureLabelCoords = ali.getFeatureLabelCoords(linearFeatureCoords);
		expect(linearFeatureLabelCoords).toBeDefined();
	});
});

describe('The drawLinearFeatureLabels method of AliTV objects is supposed to draw feature labels onto the chromosomes', function(){
	var svg = $('<svg></svg>');
	var ali = new AliTV(svg);
	it('drawLinearFeatureLabels method is supposed to be a function', function(){
		expect(typeof ali.drawLinearFeatureLabels).toEqual('function');
	});

});
