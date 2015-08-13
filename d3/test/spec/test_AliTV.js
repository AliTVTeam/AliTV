describe('The constructor is supposed a proper AliTV object', function(){
	it('Constructor AliTV exists', function(){
		expect(AliTV).toBeDefined();
	});
	var svg = $('<svg></svg>');
	var ali = new AliTV(svg);
	it('WgaPipelie object is not null', function(){
		expect(ali).not.toBeNull();
	});
	it('WgaPipelie object should be an instance of AliTV class', function(){
		expect(ali instanceof AliTV).toBeTruthy();
	});
	it('the svg property is properly set', function(){
		expect(ali.svg).toEqual(svg);
	});
	it('the height of the svg should be set to the configured height', function(){
		expect(Number(ali.svg.attr("height"))).toEqual(defaultConf.graphicalParameters.canvasHeight);
	});
	it('the width of the svg should be set to the configured width if the tree is not set', function(){
		expect(Number(ali.svg.attr("width"))).toEqual(defaultConf.graphicalParameters.canvasWidth);
	});
	it('the svgD3 property should exist', function(){
		expect(ali.svgD3).not.toBeNull();
	});
	it('the svgD3 property should be a d3 object', function(){
		expect(ali.svgD3 instanceof d3.selection).toBeTruthy();
	});
	it('the data property is initialized as empty object', function(){
		expect(ali.data).toEqual({});
	});
	it('the conf property is initialized with default values', function(){
		expect(ali.conf).toEqual(defaultConf);
	});
});

describe('The setData method of AliTV objects is supposed to set the data', function(){
	var svg = $('<svg></svg>');
	var ali = new AliTV(svg);
	it('setData method is supposed to be a function', function(){
		expect(typeof ali.setData).toEqual('function');
	});
	it('setData method is supposed to set the data variable', function(){
		ali.setData(data);
		expect(ali.data).toEqual(data);
	});
	it('setData method is supposed to overwrite existing data', function(){
		ali.setData(data2);
		expect(ali.data).toEqual(data2);
	});
});

describe('The setFilters method of AliTV objects is supposed to set the filters', function(){
	var svg = $('<svg></svg>');
	var ali = new AliTV(svg);
	it('setFilters method is supposed to be a function', function(){
		expect(typeof ali.setFilters).toEqual('function');
	});
	it('setFilters method is supposed to set the filters variable', function(){
		ali.setData(data);
		ali.setFilters(filters);
		expect(ali.filters).toEqual(filters);
	});
	it('setData method is supposed to overwrite existing filters', function(){
		ali.setData(data2);
		ali.setFilters(filters2);
		expect(ali.filters).toEqual(filters2);
	});
});

describe('The getLinearKaryoCoords method of AliTV objects is supposed to calculate coordinates for the karyos in the linear case', function(){
	beforeEach(function() {
	    jasmine.addMatchers(customMatchers);
	});
	var svg = $('<svg></svg>');
	var ali = new AliTV(svg);
	it('getLinearKaryoCoords method is supposed to be a function', function(){
		expect(typeof ali.getLinearKaryoCoords).toEqual('function');
	});
	it('getLinearKaryoCoords method is supposed to return linearKaryoCoords', function(){
		ali.setData(data);
		ali.setFilters(filters);
		var linearKaryoCoords = ali.getLinearKaryoCoords();
		expect(linearKaryoCoords).toBeDefined();
	});
	it('getLinearKaryoCoords method is supposed to work with simple test data (2 genomes, 2 chromosomes)', function(){
		ali.setData(data);
		ali.setFilters(filters);
		var linearKaryoCoords = ali.getLinearKaryoCoords();
		var expectedCoords = [
            {'karyo': 'c1', 'x': 0, 'y': 0, 'width': defaultConf.graphicalParameters.canvasWidth, 'height': defaultConf.graphicalParameters.karyoHeight, 'genome': 0},
            {'karyo': 'c2', 'x': 0, 'y': ali.getGenomeDistance(), 'width': defaultConf.graphicalParameters.canvasWidth/2, 'height': defaultConf.graphicalParameters.karyoHeight, 'genome': 1}
        ];
		expect(linearKaryoCoords).toEqual(expectedCoords);
	});
	it('getLinearKaryoCoords method is supposed to set the maxGenomeSize in cache (2 genomes, 2 chromosomes)', function(){
		ali.setData(data);
		ali.setFilters(filters);
		var linearKaryoCoords = ali.getLinearKaryoCoords();
		var expectedMaxGenomeSize = 2000;
		expect(ali.cache.linear.maxGenomeSize).toEqual(expectedMaxGenomeSize);
	});
	it('getLinearKaryoCoords method is supposed to work with simple test data (2 genomes, 3 chromosomes)', function(){
		ali.setData(data2);
		ali.setFilters(filters2);
		var linearKaryoCoords = ali.getLinearKaryoCoords();
		var expectedCoords = [
		    {'karyo': 'c1', 'x': 0, 'y': 0, 'width': defaultConf.graphicalParameters.canvasWidth/((2000+defaultConf.graphicalParameters.karyoDistance)/2000), 'height': defaultConf.graphicalParameters.karyoHeight, 'genome': 0},
		    {'karyo': 'c2', 'x': 0, 'y': ali.getGenomeDistance(), 'width': defaultConf.graphicalParameters.canvasWidth/((2000+defaultConf.graphicalParameters.karyoDistance)/1000), 'height': defaultConf.graphicalParameters.karyoHeight, 'genome': 1},
		    {'karyo': 'c3', 'x': defaultConf.graphicalParameters.canvasWidth/((2000+defaultConf.graphicalParameters.karyoDistance)/(1000+defaultConf.graphicalParameters.karyoDistance)), 'y': ali.getGenomeDistance(), 'width': defaultConf.graphicalParameters.canvasWidth/((2000+defaultConf.graphicalParameters.karyoDistance)/1000), 'height': defaultConf.graphicalParameters.karyoHeight, 'genome': 1}
		];
		expect(linearKaryoCoords).toEqual(expectedCoords);
	});
	it('getLinearKaryoCoords method is supposed to work with simple test data (3 genomes, 3 chromosomes)', function(){
		ali.setData(data3);
		ali.setFilters(filters3);
		var linearKaryoCoords = ali.getLinearKaryoCoords();
		var expectedCoords = [
		    {'karyo': 'c1', 'x': 0, 'y': 0, 'width': defaultConf.graphicalParameters.canvasWidth, 'height': defaultConf.graphicalParameters.karyoHeight, 'genome': 0},
            {'karyo': 'c2', 'x': 0, 'y': ali.getGenomeDistance(), 'width': defaultConf.graphicalParameters.canvasWidth/2, 'height': defaultConf.graphicalParameters.karyoHeight, 'genome': 1},
		    {'karyo': 'c3', 'x': 0, 'y': ali.getGenomeDistance()*2, 'width': defaultConf.graphicalParameters.canvasWidth/2, 'height': defaultConf.graphicalParameters.karyoHeight, 'genome': 2}
		];
		expect(linearKaryoCoords).toEqual(expectedCoords);
	});
	it('getLinearKaryoCoords method is supposed to work with simple test data (3 genomes, 4 chromosomes)', function(){
		ali.setData(data4);
		ali.setFilters(filters4);
		var linearKaryoCoords = ali.getLinearKaryoCoords();
		var expectedCoords = [
		    {'karyo': 'c1', 'x': 0, 'y': 0, 'width': defaultConf.graphicalParameters.canvasWidth/((2000+defaultConf.graphicalParameters.karyoDistance)/2000), 'height': defaultConf.graphicalParameters.karyoHeight, 'genome': 0},
		    {'karyo': 'c2', 'x': 0, 'y': ali.getGenomeDistance(), 'width': defaultConf.graphicalParameters.canvasWidth/((2000+defaultConf.graphicalParameters.karyoDistance)/1000), 'height': defaultConf.graphicalParameters.karyoHeight, 'genome': 1},
		    {'karyo': 'c3', 'x': defaultConf.graphicalParameters.canvasWidth/((2000+defaultConf.graphicalParameters.karyoDistance)/(1000+defaultConf.graphicalParameters.karyoDistance)), 'y': ali.getGenomeDistance(), 'width': defaultConf.graphicalParameters.canvasWidth/((2000+defaultConf.graphicalParameters.karyoDistance)/1000), 'height': defaultConf.graphicalParameters.karyoHeight, 'genome': 1},
		    {'karyo': 'c4', 'x': 0, 'y': ali.getGenomeDistance()*2, 'width': defaultConf.graphicalParameters.canvasWidth/((2000+defaultConf.graphicalParameters.karyoDistance)/1000), 'height': defaultConf.graphicalParameters.karyoHeight, 'genome': 2}
		];
		expect(linearKaryoCoords).toEqual(expectedCoords);
	});
	it('getLinearKaryoCoords method is supposed to work when the filters set an offset for one genome (3 genomes, 4 chromosomes)', function(){
		ali.setData(data4);
		ali.setFilters(filters4_offset);
		var linearKaryoCoords = ali.getLinearKaryoCoords();
		var canvasWidth = defaultConf.graphicalParameters.canvasWidth;
		var karyoDistance = defaultConf.graphicalParameters.karyoDistance;
		var karyoHeight = defaultConf.graphicalParameters.karyoHeight;
		var expectedCoords = [
		    {'karyo': 'c1', 'x': 0, 'y': 0, 'width': canvasWidth/((2000+karyoDistance)/2000), 'height': karyoHeight, 'genome': 0},
		    {'karyo': 'c2', 'x': -1000*canvasWidth/(2000+karyoDistance), 'y': ali.getGenomeDistance(), 'width': 1000*canvasWidth/(2000+karyoDistance), 'height': karyoHeight, 'genome': 1},
		    {'karyo': 'c3', 'x': (1000+karyoDistance-1000)*canvasWidth/(2000+karyoDistance), 'y': ali.getGenomeDistance(), 'width': canvasWidth/((2000+karyoDistance)/1000), 'height': karyoHeight, 'genome': 1},
		    {'karyo': 'c4', 'x': 0, 'y': ali.getGenomeDistance()*2, 'width': canvasWidth/((2000+karyoDistance)/1000), 'height': karyoHeight, 'genome': 2}
		];
		expect(linearKaryoCoords).toHaveSameLinearKaryoCoords(expectedCoords);
	});
	it('getLinearKaryoCoords method is supposed to work when the filters set a start and end for one genome region (3 genomes, 4 chromosomes)', function(){
		ali.setData(data4);
		ali.setFilters(filters4_region);
		var linearKaryoCoords = ali.getLinearKaryoCoords();
		var canvasWidth = defaultConf.graphicalParameters.canvasWidth;
		var karyoDistance = defaultConf.graphicalParameters.karyoDistance;
		var karyoHeight = defaultConf.graphicalParameters.karyoHeight;
		var expectedCoords = [
		    {'karyo': 'c1', 'x': 0, 'y': 0, 'width': canvasWidth/((2000+karyoDistance)/2000), 'height': karyoHeight, 'genome': 0},
		    {'karyo': 'c2', 'x': canvasWidth*500/(-500), 'y': ali.getGenomeDistance(), 
		    	'width': 1000*canvasWidth/500, 'height': karyoHeight, 'genome': 1},
		    {'karyo': 'c3', 'x': ((karyoDistance)/500) * canvasWidth + canvasWidth, 'y': ali.getGenomeDistance(), 
		    	'width': 1000*canvasWidth/500, 'height': karyoHeight, 'genome': 1},
		    {'karyo': 'c4', 'x': 0, 'y': ali.getGenomeDistance()*2, 'width': canvasWidth/((2000+karyoDistance)/1000), 'height': karyoHeight, 'genome': 2}
		];
		expect(linearKaryoCoords).toHaveSameLinearKaryoCoords(expectedCoords);
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
	var ali = new AliTV(svg);
	ali.setData(data2);
	ali.setFilters(filters2);
	it('drawLinear method is supposed to be a function', function(){
		expect(typeof ali.drawLinear).toEqual('function');
	});
	it('there should be exactly three karyos and one link in the test svg', function(){	
		var karyoCoords = ali.getLinearKaryoCoords();
		ali.drawLinearKaryo(karyoCoords);
		var linkCoords = ali.getLinearLinkCoords(karyoCoords);
		ali.drawLinearLinks(linkCoords);
		
		expect(ali.svgD3.selectAll('.link').size()).toEqual(1);
		expect(ali.svgD3.selectAll('.karyo').size()).toEqual(3);
	});
	it('the drawn karyos have the expected height', function(){
		ali.drawLinear();
		// This test checks only the height attribute of the first selected element
		expect(Number(ali.svgD3.selectAll('.karyo').attr("height"))).toEqual(defaultConf.graphicalParameters.karyoHeight);
	});
	it('if a tree is drawn the alignmentRegion should be transformed', function(){
		ali.setData(data8);
		ali.setFilters(filters);
		ali.conf.labels.showAllLabels = false;
		ali.conf.labels.genome.showGenomeLabels = false;
		ali.conf.labels.chromosome.showChromosomeLabels = false;
		ali.conf.labels.features.showFeatureLabels = false;
		ali.conf.tree.drawTree = true;
		ali.drawLinear();
		expect(ali.getAlignmentRegion().attr("transform")).toEqual("translate(" + defaultConf.graphicalParameters.treeWidth + ", 0)");
	});
	it('if a tree is drawn and all labels should be shown the alignmentRegion is transformed', function(){
		ali.setData(data8);
		ali.setFilters(filters);
		ali.conf.labels.showAllLabels = true;
		ali.conf.tree.drawTree = true;
		ali.drawLinear();
		expect(ali.getAlignmentRegion().attr("transform")).toEqual("translate(" + (defaultConf.graphicalParameters.treeWidth + defaultConf.graphicalParameters.genomeLabelWidth) + ", 0)");
	});
});

describe('The getCircularKaryoCoords method of AliTV objects is supposed to calculate coordinates for the karyos in the circular case', function(){
	beforeEach(function() {
	    jasmine.addMatchers(customMatchers);
	});
	var svg = $('<svg></svg>');
	var ali = new AliTV(svg);
	it('getCircularKaryoCoords method is supposed to be a function', function(){
		expect(typeof ali.getCircularKaryoCoords).toEqual('function');
	});
	it('getCircularKaryoCoords method is supposed to return circularKaryoCoords', function(){
		ali.setData(data);
		ali.setFilters(filters);
		var circularKaryoCoords = ali.getCircularKaryoCoords();
		expect(circularKaryoCoords).toBeDefined();
	});
	it('getCircularKaryoCoords method is supposed to work with simple test data (2 genomes, 2 chromosomes)', function(){
		ali.setData(data);
		ali.setFilters(filters);
		var circularKaryoCoords = ali.getCircularKaryoCoords();
		var expAnglePerBase = 2*Math.PI/(3000+2*defaultConf.graphicalParameters.karyoDistance);
		var expAnglePerSpace = expAnglePerBase * defaultConf.graphicalParameters.karyoDistance;
		var expectedCoords = [
            {'karyo': 'c1', 'startAngle': 0, 'endAngle': 2000*expAnglePerBase},
            {'karyo': 'c2', 'startAngle': 2000*expAnglePerBase + expAnglePerSpace, 'endAngle': 3000*expAnglePerBase + expAnglePerSpace}
        ];
		expect(circularKaryoCoords).toHaveSameAngles(expectedCoords);
	});
	it('getCircularKaryoCoords method is supposed to work with simple test data (2 genomes, 3 chromosomes)', function(){
		ali.setData(data2);
		ali.setFilters(filters2);
		var circularKaryoCoords = ali.getCircularKaryoCoords();
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
		ali.setData(data3);
		ali.setFilters(filters3);
		var circularKaryoCoords = ali.getCircularKaryoCoords();
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
		ali.setData(data4);
		ali.setFilters(filters4);
		var circularKaryoCoords = ali.getCircularKaryoCoords();
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
		ali.setData(data4);
		ali.setFilters(filters4_reverse);
		var circularKaryoCoords = ali.getCircularKaryoCoords();
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
		expect(ali.svgD3.selectAll('.karyoGroup').attr("transform")).toEqual("translate(" + defaultConf.graphicalParameters.canvasWidth / 2 + "," + defaultConf.graphicalParameters.canvasHeight / 2 + ")");
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
	var ali = new AliTV(svg);
	ali.setData(data2);
	ali.setFilters(filters2);
	it('drawCircular method is supposed to be a function', function(){
		expect(typeof ali.drawCircular).toEqual('function');
	});
	it('there should be exactly three karyos and one link in the test svg', function(){
		ali.drawCircular();
		expect(ali.svgD3.selectAll('.karyo').size()).toEqual(3);
		expect(ali.svgD3.selectAll('.link').size()).toEqual(1);
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
	it('getLinearLinkCoords method is supposed to work with simple test data (3 genomes, 2 chromosomes, 3 links (but 2 links are not calculated, because their identity is less than the minLinkIdentity, which is set in the filters)', function(){
		ali.setData({karyo:karyo4,features:features2, links:links4});
		ali.setFilters(filters4);
		ali.filters.links.minLinkIdentity = 92;
		ali.filters.onlyShowAdjacentLinks = false;
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
		ali.filters.onlyShowAdjacentLinks = false;
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
		ali.filters.links.minLinkIdentity = 0;
		ali.filters.links.maxLinkIdentity = 100;
		ali.conf.layout = "circular";
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
		ali.setData({karyo:karyo5,features:features3, links:links5, visibleLinks: links5});
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
		ali.conf.labels.ticks.showTickLabels = false;
		var ticks = ali.getGenomeDistance();
		var linearKaryoCoords = ali.getLinearKaryoCoords();
		var ticks = ali.getLinearTickCoords(linearKaryoCoords);
		var expectedTicks = [{ id: 'c1', x1: 0, x2: 0, y1: -5, y2: 35 }, { id: 'c1', x1: 50, x2: 50, y1: -5, y2: 35 }, { id: 'c1', x1: 100, x2: 100, y1: -5, y2: 35 }, { id: 'c1', x1: 150, x2: 150, y1: -5, y2: 35 }, { id: 'c1', x1: 200, x2: 200, y1: -5, y2: 35 }, { id: 'c1', x1: 250, x2: 250, y1: -5, y2: 35 }, { id: 'c1', x1: 300, x2: 300, y1: -5, y2: 35 }, { id: 'c1', x1: 350, x2: 350, y1: -5, y2: 35 }, { id: 'c1', x1: 400, x2: 400, y1: -5, y2: 35 }, { id: 'c1', x1: 450, x2: 450, y1: -5, y2: 35 }, { id: 'c1', x1: 500, x2: 500, y1: -5, y2: 35 }, { id: 'c1', x1: 550, x2: 550, y1: -5, y2: 35 }, { id: 'c1', x1: 600, x2: 600, y1: -5, y2: 35 }, { id: 'c1', x1: 650, x2: 650, y1: -5, y2: 35 }, { id: 'c1', x1: 700, x2: 700, y1: -5, y2: 35 }, { id: 'c1', x1: 750, x2: 750, y1: -5, y2: 35 }, { id: 'c1', x1: 800, x2: 800, y1: -5, y2: 35 }, { id: 'c1', x1: 850, x2: 850, y1: -5, y2: 35 }, { id: 'c1', x1: 900, x2: 900, y1: -5, y2: 35 }, { id: 'c1', x1: 950, x2: 950, y1: -5, y2: 35 }, { id: 'c2', x1: 0, x2: 0, y1: 965, y2: 1005 }, { id: 'c2', x1: 50, x2: 50, y1: 965, y2: 1005 }, { id: 'c2', x1: 100, x2: 100, y1: 965, y2: 1005 }, { id: 'c2', x1: 150, x2: 150, y1: 965, y2: 1005 }, { id: 'c2', x1: 200, x2: 200, y1: 965, y2: 1005 }, { id: 'c2', x1: 250, x2: 250, y1: 965, y2: 1005 }, { id: 'c2', x1: 300, x2: 300, y1: 965, y2: 1005 }, { id: 'c2', x1: 350, x2: 350, y1: 965, y2: 1005 }, { id: 'c2', x1: 400, x2: 400, y1: 965, y2: 1005 }, { id: 'c2', x1: 450, x2: 450, y1: 965, y2: 1005 } ]
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
		expect(ali.svgD3.selectAll('.tick').size()).toEqual(20);
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
		                      {'karyo': 'c1', 'x': 0 + defaultConf.graphicalParameters.canvasWidth, 'y': 0, 'width': defaultConf.graphicalParameters.canvasWidth * (-1), 'height': defaultConf.graphicalParameters.karyoHeight, 'genome': 0},
		                      {'karyo': 'c2', 'x': 0, 'y': ali.getGenomeDistance(), 'width': defaultConf.graphicalParameters.canvasWidth/2, 'height': defaultConf.graphicalParameters.karyoHeight, 'genome': 1}
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
		                      {'karyo': 'c1', 'x': 0, 'y': 0, 'width': defaultConf.graphicalParameters.canvasWidth, 'height': defaultConf.graphicalParameters.karyoHeight, 'genome': 0},
		                      {'karyo': 'c2', 'x': 0, 'y': ali.getGenomeDistance(), 'width': defaultConf.graphicalParameters.canvasWidth/2, 'height': defaultConf.graphicalParameters.karyoHeight, 'genome': 1}
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
		var expectedLinks = [{ linkID: 'l1', source0: { x: 850, y: 50 }, source1: { x: 600, y: 50 }, target0: { x: 50, y: 950 }, target1: { x: 300, y: 950 }}];
		
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
		ali.filters.skipChromosomesWithoutVisibleLinks = true;
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
		ali.filters.onlyShowAdjacentLinks = false;
		var expectedLinks = {"l1": {'source': 'f1', 'target': 'f2', 'identity': 75}};
		expect(ali.filterVisibleLinks(ali.filterLinksByAdjacency(), visibleChromosomes)).toEqual(expectedLinks);
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
		// this is needed to make the link object flat 
		ali.filters.onlyShowAdjacentLinks = false;
		var links = ali.filterLinksByAdjacency();
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
		expect(ali.svgD3.selectAll('.treeGroup').attr("transform")).toEqual("translate(" + (ali.conf.graphicalParameters.canvasWidth + ali.conf.graphicalParameters.genomeLabelWidth) + ", 0)");
	});
	it('if the tree is drawn on the right side and no genome labels are set, the tree should not be transformed', function(){
		var svg = $('<svg></svg>');
		var ali = new AliTV(svg);
		ali.setData(data5);
		ali.setFilters(filters);
		ali.conf.tree.drawTree = true;
		ali.conf.tree.orientation = "right";
		ali.conf.labels.showAllLabels = false;
		ali.conf.labels.genome.showGenomeLabels = false;
		ali.drawLinear();
		expect(ali.svgD3.selectAll('.treeGroup').attr("transform")).toEqual("translate(" + ali.conf.graphicalParameters.canvasWidth + ", 0)");
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
		var expectedFeatures = [{"id": "f1", "type": "gene", "karyo": "c1", "height": defaultConf.features.supportedFeatures.gene.height, "x": 100 * 1000 / 2000, "width": Math.abs(200 - 100) * 1000 / 2000, "y": 0},
		                        {"id": "f2", "type": "gene", "karyo": "c2", "height": defaultConf.features.supportedFeatures.gene.height, "x": 300 * 500 / 1000, "width": Math.abs(300 - 400) * 500 / 1000, "y": 485},
		                        {"id": "f3", "type": "gene", "karyo": "c3", "height": defaultConf.features.supportedFeatures.gene.height, "x": 500 * 500 / 1000, "width": Math.abs(600 - 500) * 500 / 1000, "y": 970}];
		var linearKaryoCoords = ali.getLinearKaryoCoords();
		var linearFeatureCoords = ali.getLinearFeatureCoords(linearKaryoCoords);
		expect(linearFeatureCoords).toEqual(expectedFeatures);
	});
	it('getLinearFeatureCoords method is supposed to return the expected coordinates for two features on two chromosomes, even if they should be drawn strand-specific', function(){
		ali.setData({karyo: karyo, features: features22, links: links});
		ali.setFilters(filters);
		ali.conf.features.showAllFeatures = true;
		var linearKaryoCoords = ali.getLinearKaryoCoords();
		var expectedFeatures = [{ id: 'f1', type: 'gene', karyo: 'c1', height: 6, x: 950, width: -50, y: 0 },
		                        { id: 'f2', type: 'gene', karyo: 'c2', height: 6, x: 150, width: 50, y: 994 }];
		var linearFeatureCoords = ali.getLinearFeatureCoords(linearKaryoCoords);
		expect(linearFeatureCoords).toEqual(expectedFeatures);
	});
	it('getLinearFeatureCoords method is supposed to return the expected coordinates for one inverted repeats on one chromosome, they should be drawn as arrows', function(){
		ali.setData({karyo: karyo3, features: features14});
		ali.setFilters(filters3);
		ali.conf.features.showAllFeatures = true;
		var expectedFeatures = [{"id": "f1", "type": "invertedRepeat", "karyo": "c1", path: [{x: 100 * 1000/2000, y: 0 +  1/5 * defaultConf.features.supportedFeatures.invertedRepeat.height}, 
		                                                 {x: 100 * 1000/2000 + 5/6 * (200 - 100) * 1000 / 2000, y: 0 + 1/5 * defaultConf.features.supportedFeatures.invertedRepeat.height}, 
		                                                 {x: 100 * 1000/2000 + 5/6 * (200 - 100) * 1000 / 2000, y: 0}, 
		                                                 {x: 100 * 1000/2000 + (200 - 100) * 1000 / 2000, y: 0 +  1/2 * defaultConf.features.supportedFeatures.invertedRepeat.height}, 
		                                                 {x: 100 * 1000/2000 + 5/6 * (200 - 100) * 1000 / 2000, y: 0 + defaultConf.features.supportedFeatures.invertedRepeat.height},
		                                                 {x: 100 * 1000/2000 + 5/6 * (200 - 100) * 1000 / 2000, y: 0 + 4/5 * defaultConf.features.supportedFeatures.invertedRepeat.height},
		                                                 {x: 100 * 1000/2000, y: 0 + 4/5 * defaultConf.features.supportedFeatures.invertedRepeat.height}]}];
		var linearKaryoCoords = ali.getLinearKaryoCoords();
		var linearFeatureCoords = ali.getLinearFeatureCoords(linearKaryoCoords);
		expect(linearFeatureCoords).toEqual(expectedFeatures);
	});
	it('getLinearFeatureCoords method is supposed to return the expected coordinates for one inverted repeats on one chromosome, they should be drawn as arrows', function(){
		ali.setData({karyo: karyo3, features: features14});
		ali.setFilters(filters3);
		ali.conf.features.showAllFeatures = true;
		var expectedFeatures = [{"id": "f1", "type": "invertedRepeat", "karyo": "c1", path: [{x: 100 * 1000/2000, y: 0 +  1/5 * defaultConf.features.supportedFeatures.invertedRepeat.height}, 
		                                                 {x: 100 * 1000/2000 + 5/6 * (200 - 100) * 1000 / 2000, y: 0 + 1/5 * defaultConf.features.supportedFeatures.invertedRepeat.height}, 
		                                                 {x: 100 * 1000/2000 + 5/6 * (200 - 100) * 1000 / 2000, y: 0}, 
		                                                 {x: 100 * 1000/2000 + (200 - 100) * 1000 / 2000, y: 0 +  1/2 * defaultConf.features.supportedFeatures.invertedRepeat.height}, 
		                                                 {x: 100 * 1000/2000 + 5/6 * (200 - 100) * 1000 / 2000, y: 0 + defaultConf.features.supportedFeatures.invertedRepeat.height},
		                                                 {x: 100 * 1000/2000 + 5/6 * (200 - 100) * 1000 / 2000, y: 0 + 4/5 * defaultConf.features.supportedFeatures.invertedRepeat.height},
		                                                 {x: 100 * 1000/2000, y: 0 + 4/5 * defaultConf.features.supportedFeatures.invertedRepeat.height}]}];
		var linearKaryoCoords = ali.getLinearKaryoCoords();
		var linearFeatureCoords = ali.getLinearFeatureCoords(linearKaryoCoords);
		expect(linearFeatureCoords).toEqual(expectedFeatures);
	});
	it('getLinearFeatureCoords method is supposed to return the expected coordinates for inverted repeats on one chromosome also with swapped start/end and it should be drawed on the negative strand', function(){
		var svg = $('<svg></svg>');
		var ali = new AliTV(svg);
		ali.setData({karyo: karyo3, features: features14r});
		ali.setFilters(filters3);
		ali.conf.features.showAllFeatures = true;
		ali.data.features.invertedRepeat[0].strand = "-";
		var expectedFeatures = [{"id": "f1", "type": "invertedRepeat", "karyo": "c1", path: [{x: 200 * 1000/2000, y: (4/5 + 1/25) * defaultConf.features.supportedFeatures.invertedRepeat.height}, 
	                                                 {x: 200 * 1000/2000 + 5/6 * (100 - 200) * 1000 / 2000, y: (4/5 + 1/25) * defaultConf.features.supportedFeatures.invertedRepeat.height}, 
	                                                 {x: 200 * 1000/2000 + 5/6 * (100 - 200) * 1000 / 2000, y: 4/5 * defaultConf.graphicalParameters.karyoHeight}, 
	                                                 {x: 200 * 1000/2000 + (100 - 200) * 1000 / 2000, y: (4/5 + 1/10) * defaultConf.features.supportedFeatures.invertedRepeat.height}, 
	                                                 {x: 200 * 1000/2000 + 5/6 * (100 - 200) * 1000 / 2000, y: defaultConf.features.supportedFeatures.invertedRepeat.height},
	                                                 {x: 200 * 1000/2000 + 5/6 * (100 - 200) * 1000 / 2000, y: 24/25 * defaultConf.features.supportedFeatures.invertedRepeat.height},
	                                                 {x: 200 * 1000/2000, y: 24/25 * defaultConf.features.supportedFeatures.invertedRepeat.height}]}];
		var linearKaryoCoords = ali.getLinearKaryoCoords();
		var linearFeatureCoords = ali.getLinearFeatureCoords(linearKaryoCoords);
		expect(linearFeatureCoords).toEqual(expectedFeatures);
	});
	it('getLinearFeatureCoords method is supposed to return the expected coordinates for inverted repeats on one chromosome also with swapped start/end ans it should be drawed on the positiev strand', function(){
		var svg = $('<svg></svg>');
		var ali = new AliTV(svg);
		ali.setData({karyo: karyo3, features: features14r});
		ali.setFilters(filters3);
		ali.conf.features.showAllFeatures = true;
		ali.data.features.invertedRepeat[0].strand = "+";
		var expectedFeatures = [{"id": "f1", "type": "invertedRepeat", "karyo": "c1", path: [{x: 200 * 1000/2000, y: 1/25 * defaultConf.features.supportedFeatures.invertedRepeat.height}, 
	                                                 {x: 200 * 1000/2000 + 5/6 * (100 - 200) * 1000 / 2000, y: 1/25 * defaultConf.features.supportedFeatures.invertedRepeat.height}, 
	                                                 {x: 200 * 1000/2000 + 5/6 * (100 - 200) * 1000 / 2000, y: 0}, 
	                                                 {x: 200 * 1000/2000 + (100 - 200) * 1000 / 2000, y: 1/10 * defaultConf.features.supportedFeatures.invertedRepeat.height}, 
	                                                 {x: 200 * 1000/2000 + 5/6 * (100 - 200) * 1000 / 2000, y: 1/5 * defaultConf.features.supportedFeatures.invertedRepeat.height},
	                                                 {x: 200 * 1000/2000 + 5/6 * (100 - 200) * 1000 / 2000, y: 4/25 * defaultConf.features.supportedFeatures.invertedRepeat.height},
	                                                 {x: 200 * 1000/2000, y: 4/25 * defaultConf.features.supportedFeatures.invertedRepeat.height}]}];
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
	it('there should be exactly four features of different feature groups in a test svg', function(){
		ali.setData({karyo: karyo12, features: features19});
		ali.setFilters(filters17);
		ali.conf.features.showAllFeatures = true;
		ali.conf.features.supportedFeatures.gene.form = "arrow";
		ali.conf.features.supportedFeatures.gene.pattern = "lines";
		var linearKaryoCoords = ali.getLinearKaryoCoords();
		var linearFeatureCoords = ali.getLinearFeatureCoords(linearKaryoCoords);
		ali.drawLinearFeatures(linearFeatureCoords);
		expect(ali.svgD3.selectAll('.feature').size()).toEqual(4);
	});
	it('there should be exactly four features of different feature groups in a test svg, the patterns and forms of them are changed via the configuration', function(){
		var svg = $('<svg></svg>');
		var ali = new AliTV(svg);
		ali.setData({karyo: karyo12, features: features19});
		ali.setFilters(filters17);
		ali.conf.features.showAllFeatures = true;
		ali.conf.features.supportedFeatures.gene.pattern = "";
		ali.conf.features.supportedFeatures.nStretch.pattern = "lines";
		ali.conf.features.supportedFeatures.repeat.pattern = "";
		ali.conf.features.supportedFeatures.invertedRepeat.form = "rect";
		ali.conf.features.supportedFeatures.invertedRepeat.pattern = "woven";
		var linearKaryoCoords = ali.getLinearKaryoCoords();
		var linearFeatureCoords = ali.getLinearFeatureCoords(linearKaryoCoords);
		ali.drawLinearFeatures(linearFeatureCoords);
		expect(ali.svgD3.selectAll('.feature').size()).toEqual(4);
	});
	it('there should be exactly four features of different feature groups in a test svg, the patterns and forms of them are changed via the configuration', function(){
		var svg = $('<svg></svg>');
		var ali = new AliTV(svg);
		ali.setData({karyo: karyo12, features: features19});
		ali.setFilters(filters17);
		ali.conf.features.showAllFeatures = true;
		ali.conf.features.supportedFeatures.gene.form = "arrow";
		ali.conf.features.supportedFeatures.gene.pattern = "";
		var linearKaryoCoords = ali.getLinearKaryoCoords();
		var linearFeatureCoords = ali.getLinearFeatureCoords(linearKaryoCoords);
		ali.drawLinearFeatures(linearFeatureCoords);
		expect(ali.svgD3.selectAll('.feature').size()).toEqual(4);
	});
	// The next few tests are important for the coverage but a specific testing on the style is not possible, because grunt and SpecRunner have different results.
	// Therefore there are only tests which check if the feature exists in the DOM.
	it('there should be exactly one feature of a non-supported feature group, which should be drawn as it is set in the default configuration of the fallback style', function(){
		var svg = $('<svg></svg>');
		var ali = new AliTV(svg);
		ali.setData({karyo: karyo12, features: features20});
		ali.setFilters(filters17);
		ali.conf.features.showAllFeatures = true;
		var linearKaryoCoords = ali.getLinearKaryoCoords();
		var linearFeatureCoords = ali.getLinearFeatureCoords(linearKaryoCoords);
		ali.drawLinearFeatures(linearFeatureCoords);
		expect(ali.svgD3.selectAll('.feature').size()).toEqual(1);
	});
	it('there should be exactly one feature of a non-supported feature group, which should be drawn as a rect with the line pattern (the fallback style is changed via the configuration)', function(){
		var svg = $('<svg></svg>');
		var ali = new AliTV(svg);
		ali.setData({karyo: karyo12, features: features20});
		ali.setFilters(filters17);
		ali.conf.features.showAllFeatures = true;
		ali.conf.features.fallbackStyle.pattern = "lines";
		var linearKaryoCoords = ali.getLinearKaryoCoords();
		var linearFeatureCoords = ali.getLinearFeatureCoords(linearKaryoCoords);
		ali.drawLinearFeatures(linearFeatureCoords);
		expect(ali.svgD3.selectAll('.feature').size()).toEqual(1);
	});
	it('there should be exactly one feature of a non-supported feature group, which should be drawn as a rect with the circles pattern (the fallback style is changed via the configuration)', function(){
		var svg = $('<svg></svg>');
		var ali = new AliTV(svg);
		ali.setData({karyo: karyo12, features: features20});
		ali.setFilters(filters17);
		ali.conf.features.showAllFeatures = true;
		ali.conf.features.fallbackStyle.pattern = "woven";
		var linearKaryoCoords = ali.getLinearKaryoCoords();
		var linearFeatureCoords = ali.getLinearFeatureCoords(linearKaryoCoords);
		ali.drawLinearFeatures(linearFeatureCoords);
		expect(ali.svgD3.selectAll('.feature').size()).toEqual(1);
	});
	it('there should be exactly one feature of a non-supported feature group, which should be drawn as a rect with the crosslines pattern (the fallback style is changed via the configuration)', function(){
		var svg = $('<svg></svg>');
		var ali = new AliTV(svg);
		ali.setData({karyo: karyo12, features: features20});
		ali.setFilters(filters17);
		ali.conf.features.showAllFeatures = true;
		ali.conf.features.fallbackStyle.pattern = "crosslines";
		var linearKaryoCoords = ali.getLinearKaryoCoords();
		var linearFeatureCoords = ali.getLinearFeatureCoords(linearKaryoCoords);
		ali.drawLinearFeatures(linearFeatureCoords);
		expect(ali.svgD3.selectAll('.feature').size()).toEqual(1);
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
	it('no genome labels are drawn when the configuration for showAllLabels and showGenomeLabels are both false', function(){
		var svg = $('<svg></svg>');
		var ali = new AliTV(svg);
		ali.setData(data);
		ali.setFilters(filters);
		ali.conf.labels.showAllLabels = false;
		ali.conf.labels.genome.showGenomeLabels = false;
		ali.drawLinear();
		expect(ali.svgD3.selectAll('.genomeLabelGroup').size()).toEqual(0);
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


describe('The drawLinearTickLabels method is supposed to add labels to the ticks', function(){
	var svg = $('<svg></svg>');
	var ali = new AliTV(svg);
	it('drawLinearTickLabels method is supposed to be a function', function(){
		expect(typeof ali.drawLinearTickLabels).toEqual('function');
	});
	it('the ticks should be labeled and because every 10th tick is labeled, the svg contains 6 labels, 3 labels on each strand', function(){
		ali.setData({karyo:karyo6});
		ali.setFilters(filters6);
		ali.conf.labels.ticks.showTickLabels = false;
		var linearKaryoCoords = ali.getLinearKaryoCoords();
		var ticks = ali.getLinearTickCoords(linearKaryoCoords);
		ali.drawLinearTicks(ticks, linearKaryoCoords);
		ali.drawLinearTickLabels(ticks);
		expect(ali.svgD3.selectAll('.tickLabel').size()).toEqual(4);
	});
	it('the ticks should be labeled', function(){
		ali.setData(data);
		ali.setFilters(filters);
		ali.conf.labels.ticks.showTickLabels = true;
		ali.drawLinear();
		expect(ali.svgD3.selectAll('.tickLabel').size()).toEqual(6);
	});
	it('the ticks are not labeled because the default value is set false', function(){
		ali.setData(data);
		ali.setFilters(filters);
		ali.conf.labels.ticks.showTickLabels = false;
		ali.drawLinear();
		expect(ali.svgD3.selectAll('.tickLabel').size()).toEqual(0);
	});
});

describe('The setLinkInvisible method is supposed to push a link to ali.filters.links.invisibleLinks', function(){
	var svg = $('<svg></svg>');
	var ali = new AliTV(svg);
	it('setLinkInvisible method is supposed to be a function', function(){
		expect(typeof ali.setLinkInvisible).toEqual('function');
	});
	it('the method is assigned with an id of a link, the link is pushed to ali.fiters.links.invisibleLinks', function(){
		ali.setData(data2);
		ali.setFilters(filters);
		ali.visibleLinks = {};
		ali.visibleLinks["l1"] = {'source': 'f1', 'target': 'f2', 'identity': 90};
		var linkID = "l1";
		var expectedInvisibleLinks = {"l1": {'source': 'f1', 'target': 'f2', 'identity': 90}};
		expect(ali.setLinkInvisible(linkID)).toEqual(expectedInvisibleLinks);
	})
});

describe('The getInvisibleLinks mehtod is supposed to count the elements in ali.filters.links.invisibleLinks and return them as a number', function(){
	var svg = $('<svg></svg>');
	var ali = new AliTV(svg);
	it('getInvisibleLinks method is supposed to be a function', function(){
		expect(typeof ali.getInvisibleLinks).toEqual('function');
	});
	it('the getInvisibleLinks method returns the number of links which are set invisible', function(){
		ali.setData({karyo: karyo9, features: features10, links: links13});
		ali.setFilters(filters18);
		ali.visibleLinks = {};
		ali.visibleLinks["l1"] = {'source': 'f1', 'target': 'f4', 'identity': 30};
		ali.visibleLinks["l2"] = {'source': 'f2', 'target': 'f5', 'identity': 99};
		ali.visibleLinks["l3"] = {'source': 'f3', 'target': 'f6', 'identity': 88};
		ali.setLinkInvisible("l1");
		ali.setLinkInvisible("l2");
		ali.setLinkInvisible("l3");
		var invisibleLinks = ali.getInvisibleLinks();
		expect(invisibleLinks).toEqual(3);
	})
});

describe('The showInvisibleLink method is supposed to restore a selected link which is set invisible', function(){
	var svg = $('<svg></svg>');
	var ali = new AliTV(svg);
	it('showInvisibleLink method is supposed to be a function', function(){
		expect(typeof ali.showInvisibleLink).toEqual('function');
	});
	it('the showInvisibleLink method is supposed to remove invisibleLinks from ali.filters.links.invisibleLinks', function(){
		ali.setData({karyo: karyo9, features: features10, links: links13});
		ali.setFilters(filters18);
		ali.visibleLinks = {};
		ali.visibleLinks["l1"] = {'source': 'f1', 'target': 'f4', 'identity': 30};
		ali.visibleLinks["l2"] = {'source': 'f2', 'target': 'f5', 'identity': 99};
		ali.visibleLinks["l3"] = {'source': 'f3', 'target': 'f6', 'identity': 88};
		ali.setLinkInvisible("l1");
		ali.setLinkInvisible("l2");
		ali.setLinkInvisible("l3");
		var invisibleLinks = ali.getInvisibleLinks();
		expect(invisibleLinks).toEqual(3);
		ali.showInvisibleLink("l2");
		invisibleLinks = ali.getInvisibleLinks();
		expect(invisibleLinks).toEqual(2);
	})
});

describe("The clearAli method is supposed to remove all svg groups of ali", function(){
	var svg = $('<svg></svg>');
	var ali = new AliTV(svg);
	it('clearAli method is supposed to be a function', function(){
		expect(typeof ali.clearAli).toEqual('function');
	});
	it('clearAli method is supposed to remove all svg groups (karyos, links, features, ticks, tree, labels', function(){
		ali.setData(data8);
		ali.setFilters(filters);
		ali.conf.labels.chromosome.showChromosomeLabels = true;
		ali.drawLinear();
		ali.clearAli();
		expect(ali.svgD3.selectAll('.karyoGroup').size()).toEqual(0);
		expect(ali.svgD3.selectAll('.linkGroup').size()).toEqual(0);
		expect(ali.svgD3.selectAll('.featureGroup').size()).toEqual(0);
		expect(ali.svgD3.selectAll('.genomeLabelGroup').size()).toEqual(0);
		expect(ali.svgD3.selectAll('.tickGroup').size()).toEqual(0);
		expect(ali.svgD3.selectAll('.tickLabelGroup').size()).toEqual(0);
		expect(ali.svgD3.selectAll('.chromosomeLabelGroup').size()).toEqual(0);
	});
});

describe('The setFeatureInvisible method is supposed to push a feature to ali.filters.features.invisibleFeatures', function(){
	var svg = $('<svg></svg>');
	var ali = new AliTV(svg);
	it('setFeatureInvisible method is supposed to be a function', function(){
		expect(typeof ali.setFeatureInvisible).toEqual('function');
	});
	it('the method is assigned with an id of a feature, the feature is pushed to ali.fiters.features.invisibleFeatures', function(){
		ali.setData({karyo: karyo13, links: links, features: features21});
		ali.setFilters(filters19);
		var featureID = "0_gene";
		var expectedInvisibleFeatures = {"0_gene": {'karyo': 'c1_gi', 'start': 100, 'end': 200, 'name': "f1"}};
		expect(ali.setFeatureInvisible(featureID)).toEqual(expectedInvisibleFeatures);
	})
});

describe('The getInvisibleFeatures mehtod is supposed to count the elements in ali.filters.features.invisibleFeatures and return them as a number', function(){
	var svg = $('<svg></svg>');
	var ali = new AliTV(svg);
	it('getInvisibleFeatures method is supposed to be a function', function(){
		expect(typeof ali.getInvisibleFeatures).toEqual('function');
	});
	it('the getInvisibleFeatures method returns the number of features which are set invisible', function(){
		ali.setData({karyo: karyo13, links: links, features: features21});
		ali.setFilters(filters19);
		ali.setFeatureInvisible("0_gene");
		ali.setFeatureInvisible("1_gene");
		var invisibleFeatures = ali.getInvisibleFeatures();
		expect(invisibleFeatures).toEqual(2);
	})
});

describe('The showInvisibleFeature method is supposed to restore a selected feature which is set invisible', function(){
	var svg = $('<svg></svg>');
	var ali = new AliTV(svg);
	it('showInvisibleFeature method is supposed to be a function', function(){
		expect(typeof ali.showInvisibleFeature).toEqual('function');
	});
	it('the showInvisibleFeature method is supposed to remove invisibleFeatures from ali.filters.features.invisibleFeatures', function(){
		ali.setData({karyo: karyo13, links: links, features: features21});
		ali.setFilters(filters19);
		ali.setFeatureInvisible("0_gene");
		ali.setFeatureInvisible("1_gene");
		var invisibleFeatures = ali.getInvisibleFeatures();
		expect(invisibleFeatures).toEqual(2);
		ali.showInvisibleFeature("1_gene");
		invisibleFeatures = ali.getInvisibleFeatures();
		expect(invisibleFeatures).toEqual(1);
	})
});

describe('The removeLinksOutsideVisibleRegion method is supposed to remove links outside the visible region', function(){
	var svg = $('<svg></svg>');
	var ali = new AliTV(svg);
	it('removeLinksOutsideVisibleRegion method is supposed to be a function', function(){
		expect(typeof ali.removeLinksOutsideVisibleRegion).toEqual('function');
	});
	ali.setCanvasHeight(200);
	ali.setCanvasWidth(200);
	var linearLinkCoords = [{ 'linkID': "0", 'source0': {'x': 0, 'y': 0}, 'source1': {'x': 100, 'y': 0}, 'target0': {'x': 100, 'y': 100}, 'target1': {'x': 200, 'y': 100}}, //fullyVisible
	                        { 'linkID': "1", 'source0': {'x': -100, 'y': 0}, 'source1': {'x': -1, 'y': 0}, 'target0': {'x': 0, 'y': 100}, 'target1': {'x': 100, 'y': 100}}, //partlyVisible
	                        { 'linkID': "2", 'source0': {'x': -100, 'y': 0}, 'source1': {'x': -1, 'y': 0}, 'target0': {'x': 201, 'y': 100}, 'target1': {'x': 300, 'y': 100}}]; //notVisible (crossing)
	var filteredFull = ali.removeLinksOutsideVisibleRegion(linearLinkCoords, false);
	var filteredHalf = ali.removeLinksOutsideVisibleRegion(linearLinkCoords, true);
	it('removeLinksOutsideVisibleRegion method filters links completely outside region', function(){
		expect(filteredFull).toEqual([linearLinkCoords[0],linearLinkCoords[1]]);
	});
	it('removeLinksOutsideVisibleRegion method filters links half outside region if requested', function(){
		expect(filteredHalf).toEqual([linearLinkCoords[0]]);
	});
});

describe('Mousedown inside of the svg should append a selection rect if layout is linear', function(){
	it('in the linear layout exactly one selection rect should be added', function(){
		var svg = $('<svg></svg>');
		var ali = new AliTV(svg);
		ali.svg.d3Trigger("mousedown");
		expect(ali.svgD3.selectAll("rect.selection").size()).toEqual(1);
	});
	it('in the linear layout exactly one selection rect should be added even after multiple mousedowns', function(){
		var svg = $('<svg></svg>');
		var ali = new AliTV(svg);
		ali.svg.d3Trigger("mousedown");
		ali.svg.d3Trigger("mousedown");
		expect(ali.svgD3.selectAll("rect.selection").size()).toEqual(1);
	});
	it('the second mousedown should preserve the x and y coordinates of the first one', function(){
		// If the mouseup event happens outside the svg the selection rect remains and keeps adjusting to mousemove
		// Often the click is only used to trigger a new mouseup in this case the new coordinates should not be set as start for the selection rect.
		var svg = $('<svg></svg>');
		var ali = new AliTV(svg);
		var xOld=342,xNew=234,yOld=23,yNew=892;
		ali.svg.d3TriggerAt("mousedown",xOld,yOld);
		ali.svg.d3TriggerAt("mousedown",xNew,yNew);
		expect(Number(ali.svgD3.selectAll("rect.selection").attr("x"))).toEqual(xOld);
		expect(Number(ali.svgD3.selectAll("rect.selection").attr("y"))).toEqual(yOld);
	});
	it('the selection rect should have the same x and y coordinates as the mousedown event', function(){
		var svg = $('<svg></svg>');
		var ali = new AliTV(svg);
		var x = 17;
		var y = 39;
		ali.svg.d3TriggerAt("mousedown", x, y);
		expect(Number(ali.svgD3.selectAll("rect.selection").attr("x"))).toEqual(x);
		expect(Number(ali.svgD3.selectAll("rect.selection").attr("y"))).toEqual(y);
	});
	it('in the circular layout no selection rect should be added', function(){
		var svg = $('<svg></svg>');
		var ali = new AliTV(svg);
		ali.conf.layout = "circular";
		ali.svg.d3Trigger("mousedown");
		expect(ali.svgD3.selectAll("rect.selection").size()).toEqual(0);
	});
});

describe('Mousemove inside the svg should modify the selection rect if it exists (linear layout, after mousedown)', function(){
	it('the width and height should correspond to the coordinates of mousedown and mousemove', function(){
		var svg = $('<svg></svg>');
		var ali = new AliTV(svg);
		var xStart = 17;
		var yStart = 39;
		var xEnd = 243;
		var yEnd = 341;
		ali.svg.d3TriggerAt("mousedown", xStart, yStart);
		ali.svg.d3TriggerAt("mousemove", xEnd, yEnd);
		expect(Number(ali.svgD3.selectAll("rect.selection").attr("x"))).toEqual(Math.min(xStart, xEnd));
		expect(Number(ali.svgD3.selectAll("rect.selection").attr("y"))).toEqual(Math.min(yEnd, yStart));
		expect(Number(ali.svgD3.selectAll("rect.selection").attr("width"))).toEqual(Math.abs(xEnd - xStart));
		expect(Number(ali.svgD3.selectAll("rect.selection").attr("height"))).toEqual(Math.abs(yEnd - yStart));
	});
	it('the width and height should correspond to the coordinates of mousedown and mousemove also when negative', function(){
		var svg = $('<svg></svg>');
		var ali = new AliTV(svg);
		var xStart = 325;
		var yStart = 332;
		var xEnd = 23;
		var yEnd = 71;
		ali.svg.d3TriggerAt("mousedown", xStart, yStart);
		ali.svg.d3TriggerAt("mousemove", xEnd, yEnd);
		expect(Number(ali.svgD3.selectAll("rect.selection").attr("x"))).toEqual(Math.min(xStart, xEnd));
		expect(Number(ali.svgD3.selectAll("rect.selection").attr("y"))).toEqual(Math.min(yEnd, yStart));
		expect(Number(ali.svgD3.selectAll("rect.selection").attr("width"))).toEqual(Math.abs(xEnd - xStart));
		expect(Number(ali.svgD3.selectAll("rect.selection").attr("height"))).toEqual(Math.abs(yEnd - yStart));
	});
});

describe('Mouseup updates filters to set genome_region appropriatly, selection rect is removed', function(){
	it('the mouseup event removes all selection rects', function(){
		var svg = $('<svg></svg>');
		var ali = new AliTV(svg);
		ali.setData(data);
		ali.setFilters($.extend(true, {}, filters));
		ali.drawLinear();
		var xStart = 17;
		var yStart = 39;
		var xEnd = 243;
		var yEnd = 341;
		ali.svg.d3TriggerAt("mousedown", xStart, yStart);
		ali.svg.d3Trigger("mousemove");
		ali.svg.d3TriggerAt("mouseup", xEnd, yEnd);
		expect(ali.svgD3.selectAll("rect.selection").size()).toEqual(0);
	});
	it('the mouseup event updates the filters according to the selection rect', function(){
		var svg = $('<svg></svg>');
		var ali = new AliTV(svg);
		ali.setData(data);
		ali.setFilters($.extend(true, {}, filters));
		ali.setCanvasHeight(1000);
		ali.setCanvasWidth(1000);
		ali.conf.labels.genome.showGenomeLabels = false;
		ali.drawLinear();
		var xStart = 0;
		var yStart = 0;
		var xEnd = 500;
		var yEnd = 500;
		ali.svg.d3TriggerAt("mousedown", xStart, yStart);
		ali.svg.d3TriggerAt("mousemove", xEnd, yEnd);
		ali.svg.d3TriggerAt("mouseup", xEnd, yEnd);
		expect(ali.filters.karyo.genome_region["0"].start).toEqual(0);
		expect(ali.filters.karyo.genome_region["0"].end).toEqual(1000);
		expect(typeof ali.filters.karyo.genome_region["1"].start).toEqual('undefined');
		expect(typeof ali.filters.karyo.genome_region["1"].end).toEqual('undefined');
	});
});

describe('The updateGenomeRegionBySvgRect method is supposed to update genome_region filters according to a rect on the svg', function(){
	it('updateGenomeRegionBySvgRect method is supposed to be a function', function(){
		var svg = $('<svg></svg>');
		var ali = new AliTV(svg);
		expect(typeof ali.updateGenomeRegionBySvgRect).toEqual('function');
	});
	it('updateGenomeRegionBySvgRect updates genome_region filters in a simple case (2 genomes, 2 chromosomes)', function(){
		var svg = $('<svg></svg>');
		var ali = new AliTV(svg);
		ali.setData(data);
		ali.setFilters($.extend(true, {}, filters));
		ali.setCanvasHeight(1000);
		ali.setCanvasWidth(1000);
		ali.conf.labels.genome.showGenomeLabels = false;
		ali.drawLinear();
		var selection = {x:0, y:0, width:500, height: 500};
		ali.updateGenomeRegionBySvgRect(selection);
		expect(ali.filters.karyo.genome_region["0"].start).toEqual(0);
		expect(ali.filters.karyo.genome_region["0"].end).toEqual(1000);
		expect(typeof ali.filters.karyo.genome_region["1"].start).toEqual('undefined');
		expect(typeof ali.filters.karyo.genome_region["1"].end).toEqual('undefined');
	});
	it('updateGenomeRegionBySvgRect should not work if no karyo is in the y range', function(){
		var svg = $('<svg></svg>');
		var ali = new AliTV(svg);
		ali.setData(data);
		ali.setFilters($.extend(true, {}, filters));
		ali.setCanvasHeight(1000);
		ali.setCanvasWidth(1000);
		ali.conf.labels.genome.showGenomeLabels = false;
		ali.drawLinear();
		var selection = {x:0, y:250, width:500, height: 500};
		ali.updateGenomeRegionBySvgRect(selection);
		expect(typeof ali.filters.karyo.genome_region["0"].start).toEqual('undefined');
		expect(typeof ali.filters.karyo.genome_region["0"].end).toEqual('undefined');
		expect(typeof ali.filters.karyo.genome_region["1"].start).toEqual('undefined');
		expect(typeof ali.filters.karyo.genome_region["1"].end).toEqual('undefined');
	});
	it('updateGenomeRegionBySvgRect should work for multiple genomes in the y range', function(){
		var svg = $('<svg></svg>');
		var ali = new AliTV(svg);
		ali.setData(data);
		ali.setFilters($.extend(true, {}, filters));
		ali.setCanvasHeight(1000);
		ali.setCanvasWidth(1000);
		ali.conf.labels.genome.showGenomeLabels = false;
		ali.drawLinear();
		var selection = {x:0, y:0, width:500, height: 1000};
		ali.updateGenomeRegionBySvgRect(selection);
		expect(ali.filters.karyo.genome_region["0"].start).toEqual(0);
		expect(ali.filters.karyo.genome_region["0"].end).toEqual(1000);
		expect(ali.filters.karyo.genome_region["1"].start).toEqual(0);
		expect(ali.filters.karyo.genome_region["1"].end).toEqual(1000);
	});
	it('updateGenomeRegionBySvgRect should work for already set filters (apply twice consecutively)', function(){
		var svg = $('<svg></svg>');
		var ali = new AliTV(svg);
		ali.setData(data);
		ali.setFilters($.extend(true, {}, filters));
		ali.setCanvasHeight(1000);
		ali.setCanvasWidth(1000);
		ali.conf.labels.genome.showGenomeLabels = false;
		ali.drawLinear();
		var selection = {x:0, y:0, width:500, height: 500};
		ali.updateGenomeRegionBySvgRect(selection);
		ali.updateGenomeRegionBySvgRect(selection);
		expect(ali.filters.karyo.genome_region["0"].start).toEqual(0);
		expect(ali.filters.karyo.genome_region["0"].end).toEqual(500);
		expect(typeof ali.filters.karyo.genome_region["1"].start).toEqual('undefined');
		expect(typeof ali.filters.karyo.genome_region["1"].end).toEqual('undefined');
	});
	it('updateGenomeRegionBySvgRect should work when alignmentRegion is transformed', function(){
		var svg = $('<svg></svg>');
		var ali = new AliTV(svg);
		ali.setData(data);
		ali.setFilters($.extend(true, {}, filters));
		ali.setCanvasHeight(1000);
		ali.setCanvasWidth(1000);
		ali.conf.labels.genome.showGenomeLabels = true;
		ali.drawLinear();
		transformX = ali.conf.graphicalParameters.genomeLabelWidth;
		var selection = {x:transformX, y:0, width:500, height: 500};
		ali.updateGenomeRegionBySvgRect(selection);
		expect(ali.filters.karyo.genome_region["0"].start).toEqual(0);
		expect(ali.filters.karyo.genome_region["0"].end).toEqual(1000);
		expect(typeof ali.filters.karyo.genome_region["1"].start).toEqual('undefined');
		expect(typeof ali.filters.karyo.genome_region["1"].end).toEqual('undefined');
	});
});

describe('The changeChromosomeVisibility method is supposed to set a selected chromosome invisible', function(){
	var svg = $('<svg></svg>');
	var ali = new AliTV(svg);
	beforeEach(function(done){
		ali.setData({karyo: karyo14, links: links, features: features21});
		ali.setFilters(filters20);
		var chromosomeName = "species_1";
		ali.changeChromosomeVisibility(chromosomeName);
		done();
	});
	it('changeChromosomeVisibility method is supposed to be a function', function(){
		expect(typeof ali.changeChromosomeVisibility).toEqual('function');
	});
	it("the method is supposed to set the visibility of a selected chromosome equal false", function(){
		setTimeout(function(){
			expect(ali.filters.karyo.chromosomes["c1_gi"].visible).toEqual(false);		
			done();
		}, 1000);
	});
});

describe('The getInvisibleChromosomes method is supposed to count all chromosomes which are set invisible', function(){
	var svg = $('<svg></svg>');
	var ali = new AliTV(svg);
	it('getInvisibleChromosomes method is supposed to be a function', function(){
		expect(typeof ali.getInvisibleChromosomes).toEqual('function');
	});
	it("the method is supposed to return the number of all chromosomes which are set invisible", function(){
		ali.setData(data);
		ali.setFilters(filters);
		ali.filters.karyo.chromosomes["c1"].visible = false;
		expect(ali.getInvisibleChromosomes()).toEqual(1);
	});
});

describe('The changeGenomeOrder method is supposed to change the order of the genomes in filters.karyo.chromosomes.genome_order', function(){
	var svg = $('<svg></svg>');
	var ali = new AliTV(svg);
	it('changeGenomeOrder method is supposed to be a function', function(){
		expect(typeof ali.changeGenomeOrder).toEqual('function');
	});
	it('the method is supposed to change the order of two genomes in the testdata by pushing down', function(){
		ali.setData(data);
		ali.setFilters(filters);
		var expectedOrder = [1, 0];
		var order = ali.changeGenomeOrder(1, -1);
		expect(expectedOrder).toEqual(order);
	});
	it('the method is supposed to change the order of three genomes in the testdata by pushing up', function(){
		ali.setData({karyo: karyo3, links: links, features: features});
		ali.setFilters(filters3);
		var expectedOrder = [0, 2, 1];
		var order = ali.changeGenomeOrder(2, 1);
		expect(expectedOrder).toEqual(order);
	});
	it('the method is supposed to change the order of three genomes in the testdata by pushing down', function(){
		ali.setData({karyo: karyo9, links: links, features: features});
		ali.setFilters(filters3);
		var expectedOrder = [1, 2, 0];
		var order = ali.changeGenomeOrder(0, 1);
		expect(expectedOrder).toEqual(order);
	});
});

describe('The changeChromosomeOrientation method is supposed to change the orientation of an assigned chromosome', function(){
	var svg = $('<svg></svg>');
	var ali = new AliTV(svg);
	it('changeChromosomeOrientation method is supposed to be a function', function(){
		expect(typeof ali.changeChromosomeOrientation).toEqual('function');
	});
	it("the method is supposed to set the orientation of the assigned chromosome from reverse equal false to reverse equal true", function(){
		ali.setData(data);
		ali.setFilters(filters);
		ali.filters.karyo.chromosomes["c1"].reverse = false;
		expect(ali.changeChromosomeOrientation("c1")).toEqual(true);
	});
	it("the method is supposed to set the orientation of the assigned chromosome from reverse equal true to reverse equal false", function(){
		ali.setData(data);
		ali.setFilters(filters);
		ali.filters.karyo.chromosomes["c2"].reverse = true;
		expect(ali.changeChromosomeOrientation("c2")).toEqual(false);
	});
});

describe('The changeChromosomeOrder method is supposed to change the order of chromosomes for one genome', function(){
	var svg = $('<svg></svg>');
	var ali = new AliTV(svg);
	it('changeChromosomeOrder method is supposed to be a function', function(){
		expect(typeof ali.changeChromosomeOrder).toEqual('function');
	});
	it('the method is supposed to change the order of three chromosomes in the testdata', function(){
		ali.setData({karyo: karyo2, links: links, features: features});
		ali.setFilters(filters3);
		var expectedOrder = ["c1", "c3", "c2"];
		var order = ali.changeChromosomeOrder("c3", -1);
		expect(expectedOrder).toEqual(order);
	});
	it('the method is supposed to change the order of more chromosomes on the destdata', function(){
		ali.setData({karyo: karyo12, links: links, features: features});
		ali.setFilters(filters17);
		var expectedOrder = ["c1", "c3", "c2", "c4", "c5"];
		var order = ali.changeChromosomeOrder("c2", 1);
		expect(expectedOrder).toEqual(order);
	});
	it('the method is supposed to change the order of two chromosomes on the testdata', function(){
		ali.setData(data);
		ali.setFilters(filters);
		var expectedOrder = ["c1", "c2"];
		var order = ali.changeChromosomeOrder("c1", 1);
		expect(expectedOrder).toEqual(order);
	});
	it('the method is supposed to change the order of one chromosomes on the testdata', function(){
		ali.setData({karyo: karyo8, links: links, features: features});
		ali.setFilters(filters10);
		var expectedOrder = ["c2", "c1", "c3", "c4", "c5", "c6", "c7"];
		var order = ali.changeChromosomeOrder("c1", -1);
		expect(expectedOrder).toEqual(order);
	});
});

