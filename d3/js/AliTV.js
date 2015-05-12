/* global d3: false */
/* global $: false */
/* global document: false */

/**
 * Creates an object of type AliTV for drawing whole genome alignment visualizations
 * @author Markus Ankenbrand <markus.ankenbrand@uni-wuerzburg.de> 
 * @constructor
 * @param {Object} svg - jQuery object containing a svg DOM element. Visualizations will be drawn on this svg. Size may be changed by object methods. Previous content will be deleted.
 * @example
 * // initializes an AliTV object (wga) on the svg element with id 'canvas'
 * var svg = $('#canvas');
 * var wga = new AliTV(svg);
 */
function AliTV(svg) {
	/**
	 * property to contain the svg DOM element as jQuery Object
	 */
	this.svg = svg;
	/**
	 * property to contain the svg DOM element as d3 Object
	 */
	this.svgD3 = d3.selectAll(svg);
	/**
	 * property to store the data
	 * @property {Object}  karyo                        - the chromosome information
	 * @property {Object}  karyo.chromosomes            - the chromosome details, karyo IDs as keys
	 * @property {Number}  karyo.chromosomes.genome_id  - number of genome to which this chromosome belongs
	 * @property {Number}  karyo.chromosomes.length     - length in bp
	 * @property {String}  karyo.chromosomes.seq        - sequence of the chromosome
	 * @property {Object}  features                     - the feature information, feature IDs as keys
	 * @property {String}  features.karyo               - the karyo ID
	 * @property {Number}  features.start               - start position on the sequence
	 * @property {Number}  features.end                 - end position on the sequence
	 * @property {Object}  links                        - the link information, link IDs as keys
	 * @property {String}  links.source                 - source feature of the link
	 * @property {String}  links.target                 - target feature of the link
	 * @property {Number}  links.identity               - identity of the link
	 */
	this.data = {};
	/**
	 * property to store data specific drawing options (structure highly dependent on data structure)
	 * @property {Object}  filters                      - the data dependent displaying information
	 * @property {Object}  filters.karyo                        - the chromosome dependent displaying information
	 * @property {Array}   filters.karyo.order                  - array of chromosome IDs in the desired order (circular layout)
	 * @property {Array}   filters.karyo.genome_order           - array of genome IDs in the desired order (linear layout)
	 * @property {Object}  filters.karyo.chromosomes            - the chromosome drawing details, karyo IDs as keys
	 * @property {Boolean} filters.karyo.chromosomes.reverse    - should the sequence be treated as its reverse (complement)
	 * @property {Boolean} filters.karyo.chromosomes.visible    - should the sequence be displayed at all
	 */
	this.filters = {};
	/**
	 * property to store configuration options
	 * @property {Number}  width                      - The width of the svg in px.
	 * @property {Number}  height                     - The height of the svg in px.
	 * @property {Object}  linear                     - The configuration options for the linear layout.
	 * @property {Number}  linear.genomeDistance      - The vertical distance between adjacent genomes in px.
	 * @property {Number}  linear.karyoHeight         - The height of each chromosome in px.
	 * @property {Number}  linear.karyoDistance       - The horizontal distance between adjacent chromosomes of the same genome in bp.
	 * @property {Number}  linear.linkKaryoDistance   - The vertical distance between chromosomes and links in px.
	 * @property {Boolean} linear.drawAllLinks        - Only adjacent links should be drawn, but the user has the possibility to set this value on true, so all links will be drawn.
	 * @property {String}  linear.startLineColor      - The start color of the color gradient for drawing karyos according to their genomeId
	 * @property {String}  linear.endLineColor        - The end color of the color gradient. 
	 * @property {Number}  linear.tickDistance        - The distance in bp of ticks on the drawn chromosomes.
	 * @property {Object}  circular                   - The configuration options for the circular layout.
	 * @property {Number}  circular.karyoHeight       - The height of each chromosome in px.
	 * @property {Number}  circular.karyoDistance     - The distance between adjacent chromosomes on the circle in bp.
	 * @property {Number}  circular.linkKaryoDistance - The vertical distance between chromosomes and links in px.
	 * @property {Number}  circular.outerRadius	      - The outer radius of the circle in px.
	 * @property {Number}  circular.tickDistance      - The distance in bp of ticks on the drawn chromosomes.
	 * @property {Number}  circular.tickSize          - The size of the ticks in pixels. 
	 * @property {Number}  minLinkIdentity            - The minimum of the link identity the user wants to color.
	 * @property {Number}  maxLinkIdentity            - The maximum of the link identity the user wants to color.
	 * @property {Number}  midLinkIdentity            - The middle of the link identity the user wants to color.
	 * @property {String}  minLinkIdentityColor       - The color of the minimum link.
	 * @property {String}  maxLinkIdentityColor       - The color of the maximum link.
	 * @property {String}  midLinkIdentityColor       - The color of the middle link.   
	 */
	this.conf = {
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
	// Initialize svg size
	svg.height(this.conf.height);
	svg.width(this.conf.width);
}

/**
 * Sets the data of the AliTV object.
 * For the required format see the documentation of the data property
 * @author Markus Ankenbrand <markus.ankenbrand@uni-wuerzburg.de>
 * @param {Object} data - Object containing karyo, link and feature information
 * @example
 * var svg = $('#canvas');
 * var wga = new AliTV(svg);
 * var karyo = {
 * 	'chromosomes': {
 * 	'c1': {'genome_id': 0, 'length': 2000, 'seq': null},
 * 	'c2': {'genome_id': 1, 'length': 1000, 'seq': null}
 * 	}
 * };
 * var features = {
 * 	'f1': {'karyo': 'c1', 'start': 300, 'end': 800},
 * 	'f2': {'karyo': 'c2', 'start': 100, 'end': 600}
 * };
 * var links = { "l1":
 * 	{'source': 'f1', 'target': 'f2', 'identity': 90}
 * };
 * wga.setData({'karyo': karyo, 'features': features, 'links': links};
 */
AliTV.prototype.setData = function(data) {
	this.data = data;
};

/**
 * Sets the filters of the AliTV object.
 * For the required format see the documentation of the filters property
 * The filters are highly dependent on the data object and have to resemble its layout
 * @author Markus Ankenbrand <markus.ankenbrand@uni-wuerzburg.de>
 * @param {Object} filters - Object containing data specific drawing information
 * @example
 * var svg = $('#canvas');
 * var wga = new AliTV(svg);
 * var karyo = {
 * 	'chromosomes': {
 * 	'c1': {'genome_id': 0, 'length': 2000, 'seq': null},
 * 	'c2': {'genome_id': 1, 'length': 1000, 'seq': null}
 * 	}
 * };
 * var features = {
 * 	'f1': {'karyo': 'c1', 'start': 300, 'end': 800},
 * 	'f2': {'karyo': 'c2', 'start': 100, 'end': 600}
 * };
 * var links = {"l1":
 * 	{'source': 'f1', 'target': 'f2', 'identity': 90}
 * };
 * wga.setData({'karyo': karyo, 'features': features, 'links': links};
 * var filters = {
 * 	'karyo': {
 * 		'order': ['c1', 'c2'],
 * 		'genome_order': ['0', '1'],
 * 		'chromosomes': {
 * 	 		'c1': {'reverse': false, 'visible': true},
 * 			'c2': {'reverse': false, 'visible': true}
 * 		}
 * 	}
 * };
 * wga.setFilters(filters);
 * wga.drawLinear();
 * wga.drawCircular();
 */
AliTV.prototype.setFilters = function(filters) {
	this.filters = filters;
};

/**
 * Calculates coordinates for the chromosomes to draw in the linear layout.
 * This function operates on the data property of the object and therefore needs no parameters.
 * This function is primarily meant for internal usage, the user should not need to call this directly.
 * @author Markus Ankenbrand <markus.ankenbrand@uni-wuerzburg.de>
 * @returns {Array} Array containing one Object for each element in data.karyo of the form {karyo: 'karyo_name', x:0, y:0, width:10, height:10}
 */
AliTV.prototype.getLinearKaryoCoords = function() {
	var linearKaryoCoords = [];
	var genome_order = this.filters.karyo.genome_order;
	var conf = this.conf;

	var total = [];
	var current = [];
	var i;
	// Initialize total with the negative of one karyoDistance - as there is one space less then karyos per genome
	for (i = 0; i < genome_order.length; i++) {
		total.push(-conf.linear.karyoDistance);
		current.push(0);
	}

	$.each(this.data.karyo.chromosomes, function(key, value) {
		total[genome_order.indexOf(value.genome_id)] += value.length + conf.linear.karyoDistance;
	});

	var maxTotalSize = Math.max.apply(null, total);

	for (i = 0; i < this.filters.karyo.order.length; i++) {
		var key = this.filters.karyo.order[i];
		var value = this.data.karyo.chromosomes[key];
		var coord = {
			'karyo': key,
			'y': genome_order.indexOf(value.genome_id) * conf.linear.genomeDistance,
			'height': conf.linear.karyoHeight,
			'genome': value.genome_id
		};

		if (this.filters.karyo.chromosomes[key].reverse === false) {
			coord.width = (value.length / maxTotalSize) * conf.width;
			coord.x = (current[genome_order.indexOf(value.genome_id)] / maxTotalSize) * conf.width;
		} else {
			coord.x = (current[genome_order.indexOf(value.genome_id)] / maxTotalSize) * conf.width + (value.length / maxTotalSize) * conf.width;
			coord.width = (value.length / maxTotalSize) * conf.width * (-1);
		}
		current[genome_order.indexOf(value.genome_id)] += value.length + conf.linear.karyoDistance;
		linearKaryoCoords.push(coord);

	}
	return linearKaryoCoords;
};

/**
 * Calculate coordinates for the links to draw in the linear layout and uses link-data and karyo-coordinates
 * this function should also check if links are adjacent or not and save this information in the link property "adjacent"
 * This function is primarily meant for internal usage, the user should not need to call this directly
 * @author Sonja Hohlfeld
 * @param {Array} The array containing the coordinates as returned by getLinearKaryoCoords()
 * @returns {Array} Returns an Array which is presented in the following example
 * @example [
 *					{"linkID": "l1", "source0": {"x":0, "y":10}, "target0": {"x": 0, "y":20}, "source1": {"x":10, "y":10}, "target1": {"x":10, "y":20}, "adjacent": true}
 *			]
 */

AliTV.prototype.getLinearLinkCoords = function(coords) {
	var linearLinkCoords = [];
	if (typeof coords === 'undefined') {
		return linearLinkCoords;
	}
	var that = this;
	var conf = this.conf;
	var karyoMap = {};
	$.each(coords, function(key, value) {
		karyoMap[value.karyo] = key;
	});
	$.each(this.data.links, function(key, value) {
		var link = {};
		link.linkID = key;
		link.source0 = {};
		link.source1 = {};
		link.target0 = {};
		link.target1 = {};
		var feature1 = that.data.features[value.source];
		var feature2 = that.data.features[value.target];
		var karyo1 = that.data.karyo.chromosomes[feature1.karyo];
		var karyo2 = that.data.karyo.chromosomes[feature2.karyo];
		var karyo1Coords = coords[karyoMap[feature1.karyo]];
		var karyo2Coords = coords[karyoMap[feature2.karyo]];
		var genomePosition1 = that.filters.karyo.genome_order.indexOf(karyo1.genome_id);
		var genomePosition2 = that.filters.karyo.genome_order.indexOf(karyo2.genome_id);

		if (genomePosition1 > genomePosition2) {
			var tmp = feature1;
			feature1 = feature2;
			feature2 = tmp;
			tmp = karyo1;
			karyo1 = karyo2;
			karyo2 = tmp;
			tmp = karyo1Coords;
			karyo1Coords = karyo2Coords;
			karyo2Coords = tmp;
		}
		link.source0.x = karyo1Coords.x + karyo1Coords.width * feature1.start / karyo1.length;
		link.source0.y = karyo1Coords.y + karyo1Coords.height + conf.linear.linkKaryoDistance;
		link.source1.x = karyo1Coords.x + karyo1Coords.width * feature1.end / karyo1.length;
		link.source1.y = karyo1Coords.y + karyo1Coords.height + conf.linear.linkKaryoDistance;

		link.target0.x = karyo2Coords.x + karyo2Coords.width * feature2.start / karyo2.length;
		link.target0.y = karyo2Coords.y - conf.linear.linkKaryoDistance;
		link.target1.x = karyo2Coords.x + karyo2Coords.width * feature2.end / karyo2.length;
		link.target1.y = karyo2Coords.y - conf.linear.linkKaryoDistance;

		if (Math.abs(genomePosition2 - genomePosition1) === 1) {
			link.adjacent = true;
			linearLinkCoords.push(link);
		} else {
			link.adjacent = false;
			if (conf.linear.drawAllLinks === true) {
				linearLinkCoords.push(link);
			}
		}
	});
	return linearLinkCoords;
};

/**
 * This function draws the karyos in the linear layout, color them according to their genome_id and add some events to the chromosome.
 * @author Markus Ankenbrand and Sonja Hohlfeld
 * @param {Array} The array containing the coordinates as returned by getLinearKaryoCoords()
 */
AliTV.prototype.drawLinearKaryo = function(linearKaryoCoords) {
	var that = this;

	that.svgD3.selectAll(".karyoGroup").remove();
	that.svgD3.append("g")
		.attr("class", "karyoGroup")
		.selectAll("path")
		.data(linearKaryoCoords)
		.enter()
		.append("rect")
		.attr("class", "karyo")
		.attr("x", function(d) {
			if (d.width < 0) {
				return d.x + d.width;
			} else {
				return d.x;
			}
		})
		.attr("y", function(d) {
			return d.y;
		})
		.attr("width", function(d) {
			return Math.abs(d.width);
		})
		.attr("height", function(d) {
			return d.height;
		})
		.on("mouseover", function(g) {
			that.fadeLinks(g, 0.1);
		})
		.on("mouseout", function(g) {
			that.fadeLinks(g, 1);
		})
		.on("click", function(g) {
			that.filters.karyo.chromosomes[g.karyo].reverse = !that.filters.karyo.chromosomes[g.karyo].reverse;
			that.drawLinear();
		})
		.style("fill", function(d) {
			return that.colorKaryoByGenomeId(that.data.karyo.chromosomes[d.karyo].genome_id);
		});
};

/**
 * This function color links according to their identity and is called by drawLinearLinks within the style attribute
 * It operates on the identity value of the links and therefore the identity should be assigned to the function
 * The identity is assigned to a color which is used by the drawLinearLinks function, so the returned value is the RGB farbcode
 * @author Sonja Hohlfeld
 */
AliTV.prototype.colorLinksByIdentity = function(identity) {
	var that = this;
	var linkIdentityDomain = [0, that.conf.minLinkIdentity, that.conf.midLinkIdentity, that.conf.maxLinkIdentity, 100];
	var linkIdentityColorRange = [that.conf.minLinkIdentityColor, that.conf.minLinkIdentityColor, that.conf.midLinkIdentityColor, that.conf.maxLinkIdentityColor, that.conf.maxLinkIdentityColor];
	var color = d3.scale.linear()
		.domain(linkIdentityDomain)
		.range(linkIdentityColorRange);

	return color(identity);
};

/**
 * This function color karyos according to their genome_id and is called by drawLinearKaryo within the style attribute
 * It operates on the genome_id of the links and therefore the genome_id should be assigned to the function
 * The genome_id is assigned to a color which is used by the drawLinearKaryo function, so the returned value is the RGB farbcode
 * @author Sonja Hohlfeld
 */
AliTV.prototype.colorKaryoByGenomeId = function(genomeId) {
	var that = this;
	var genomeOrder = [0, (that.filters.karyo.genome_order.length - 1)];
	var colorRange = [that.conf.linear.startLineColor, that.conf.linear.endLineColor];
	var color = d3.scale.linear()
		.domain(genomeOrder)
		.range(colorRange);

	return color(genomeId);
};

/**
 * This function calculates the tick coords and operates on the chromosomes and need the length in bp and the width in px of the karyo.
 * @author Sonja Hohlfeld
 * @param {Array} The array containing the coordinates as returned by getLinearKaryoCoords()
 * @return {Array} The array containing the tick coordinates as shown in the following example
 * @example linearTickCoords = [[0, 50, 100, 150, 200], [0, 50, 100], [100, 150, 200]]
 */

AliTV.prototype.getLinearTickCoords = function(karyoCoords) {
	var that = this;
	var linearTickCoords = [];
	$.each(karyoCoords, function(key, value) {
		var ticks = [];
		var scale = d3.scale.linear()
			.domain([0, that.data.karyo.chromosomes[value.karyo].length])
			.range([value.x, value.x + value.width]);

		var chromosomePosition = 0;
		while (chromosomePosition <= that.data.karyo.chromosomes[value.karyo].length) {
			ticks.push(scale(chromosomePosition));
			chromosomePosition += that.conf.linear.tickDistance;
			var coords = {};
			coords.x1 = ticks[ticks.length - 1];
			coords.y1 = value.y - 5;
			coords.x2 = ticks[ticks.length - 1];
			coords.y2 = value.y + value.height + 5;
			linearTickCoords.push(coords);
		}
	});
	return linearTickCoords;
};

/**
 * This function draw the ticks in the linear layout.
 * @author Sonja Hohlfeld
 * @param {Array} The array containing the coordinates as returned by getLinearTickCoords()
 */

AliTV.prototype.drawLinearTicks = function(linearTickCoords) {
	var that = this;
	this.svgD3.selectAll(".tickGroup").remove();
	that.svgD3.append("g")
		.attr("class", "tickGroup")
		.selectAll("path")
		.data(linearTickCoords)
		.enter()
		.append("line")
		.attr("class", "tick")
		.attr("x1", function(d) {
			return d.x1;
		})
		.attr("y1", function(d) {
			return d.y1;
		})
		.attr("x2", function(d) {
			return d.x2;
		})
		.attr("y2", function(d) {
			return d.y2;
		})
		.style("stroke", "#000");
};

/**
 * This function is called by a mouse event.
 * If the mouse pointer enters the area of a chromosome all links should be faded out except the the links of the chromosome the mouse points to.
 * If the mouse pointer leaves the area of a chromosome all links should be faded in.
 * @param {Number} The opacity value is a number between 0 and 1 and indicates the degree of the colored link opacity.
 */
AliTV.prototype.fadeLinks = function(g, opacity) {
	var that = this;
	that.svgD3.selectAll(".link")
		.filter(function(d) {
			return that.data.features[that.data.links[d.linkID].source].karyo != g.karyo && that.data.features[that.data.links[d.linkID].target].karyo != g.karyo;
		})
		.transition()
		.style("opacity", opacity);
};

/**
 * This function draws adjacent links in the linear layout
 * @author Sonja Hohlfeld
 * @param {Array} The array linearLinkCoords containing the coordinates of all links as returned by getLinearLinkCoords()
 */

AliTV.prototype.drawLinearLinks = function(linearLinkCoords) {
	var that = this;
	var coordsToPath = function(link) {
		var diagonal = d3.svg.diagonal().source(function(d) {
			return d.source;
		}).target(function(d) {
			return d.target;
		});
		var path1 = diagonal({
			source: link.source0,
			target: link.target0
		});
		var path2 = diagonal({
			source: link.target1,
			target: link.source1
		}).replace(/^M/, 'L');
		var shape = path1 + path2 + 'Z';
		return shape;
	};

	this.svgD3.selectAll(".linkGroup").remove();
	this.svgD3.append("g")
		.attr("class", "linkGroup")
		.selectAll("path")
		.data(linearLinkCoords)
		.enter()
		.append("path")
		.attr("class", "link")
		.attr("d", coordsToPath)
		.style("fill", function(d) {
			return that.colorLinksByIdentity(that.data.links[d.linkID].identity);
		});
};


/**
 * This function draws the data in the linear layout.
 * It operates on the data of the object and therefore needs no parameters.
 * It draws directly on the svg and therefore has no return value.
 * @author Markus Ankenbrand <markus.ankenbrand@uni-wuerzburg.de>
 */
AliTV.prototype.drawLinear = function() {
	var karyoCoords = this.getLinearKaryoCoords();
	var linearTickCoords = this.getLinearTickCoords(karyoCoords);
	this.drawLinearTicks(linearTickCoords);
	this.drawLinearKaryo(karyoCoords);
	var linkCoords = this.getLinearLinkCoords(karyoCoords);
	this.drawLinearLinks(linkCoords);
};

/**
 * Calculates coordinates for the chromosomes to draw in the circular layout.
 * This function operates on the data property of the object and therefore needs no parameters.
 * This function is primarily meant for internal usage, the user should not need to call this directly.
 * @author Markus Ankenbrand <markus.ankenbrand@uni-wuerzburg.de>
 * @returns {Array} Array containing one Object for each element in data.karyo of the form {karyo: 'karyo_name', startAngle:0, endAngle:1}
 */
AliTV.prototype.getCircularKaryoCoords = function() {
	var circularKaryoCoords = [];
	var total = 0;
	var spacer = this.conf.circular.karyoDistance;
	var chromosomes = this.data.karyo.chromosomes;
	var order = this.filters.karyo.order;
	var current = -spacer;
	$.each(chromosomes, function(key, value) {
		total += value.length + spacer;
	});
	for (var i = 0; i < order.length; i++) {
		var key = order[i];
		var value = chromosomes[key];
		var data = {
			"karyo": key,
			"startAngle": ((current + spacer) / total) * (2 * Math.PI),
		};
		current += value.length + spacer;
		data.endAngle = (current / total) * (2 * Math.PI);
		if (this.filters.karyo.chromosomes[key].reverse === true) {
			var startAngle = data.startAngle;
			var endAngle = data.endAngle;
			data.startAngle = endAngle;
			data.endAngle = startAngle;
		}
		circularKaryoCoords.push(data);
	}
	return circularKaryoCoords;
};

/**
 * Calculate coordinates for the links to draw in the cirular layout and uses link-data and karyo-coordinates
 * This function is primarily meant for internal usage, the user should not need to call this directly
 * @author Markus Ankenbrand
 * @param {Array} The array containing the coordinates as returned by getCircularKaryoCoords()
 * @returns {Array} Returns an Array which is presented in the following example
 * @example [
 *					{"linkID": "l1", "source": {"startAngle":1, "endAngle":3}, "target": {"startAngle":4, "endAngle":6}}
 *			]
 */
AliTV.prototype.getCircularLinkCoords = function(coords) {
	var circularLinkCoords = [];
	if (typeof coords === 'undefined') {
		return circularLinkCoords;
	}
	var that = this;
	var karyoMap = {};
	$.each(coords, function(key, value) {
		karyoMap[value.karyo] = key;
	});

	$.each(this.data.links, function(key, value) {
		var link = {};
		link.linkID = key;

		var feature1 = that.data.features[value.source];
		var feature2 = that.data.features[value.target];
		var karyo1 = that.data.karyo.chromosomes[feature1.karyo];
		var karyo2 = that.data.karyo.chromosomes[feature2.karyo];
		var karyo1Coords = coords[karyoMap[feature1.karyo]];
		var karyo2Coords = coords[karyoMap[feature2.karyo]];

		var sourceScale = d3.scale.linear().domain([0, karyo1.length]).range([karyo1Coords.startAngle, karyo1Coords.endAngle]);
		var targetScale = d3.scale.linear().domain([0, karyo2.length]).range([karyo2Coords.startAngle, karyo2Coords.endAngle]);

		link.source = {
			startAngle: sourceScale(feature1.start),
			endAngle: sourceScale(feature1.end)
		};
		link.target = {
			startAngle: targetScale(feature2.start),
			endAngle: targetScale(feature2.end)
		};

		circularLinkCoords.push(link);
	});

	return circularLinkCoords;
};

/**
 * This function calculates the coordinates (angles) for the ticks in the circular layout
 * @author Markus Ankenbrand
 * @param {Array} The array containing the coordinates as returned by getCircularKaryoCoords()
 * @returns {Array} Returns an Array of angles
 */
AliTV.prototype.getCircularTickCoords = function(coords) {
	var that = this;
	var circularTickCoords = [];
	$.each(coords, function(key, value) {
		var karyoLength = that.data.karyo.chromosomes[value.karyo].length;
		var baseToAngle = d3.scale.linear().domain([0, karyoLength]).range([value.startAngle, value.endAngle]);
		var chromosomePosition = 0;
		while (chromosomePosition <= karyoLength) {
			circularTickCoords.push(baseToAngle(chromosomePosition));
			chromosomePosition += that.conf.circular.tickDistance;
		}
	});
	return circularTickCoords;
};

/**
 * This function draws the karyos in the circular layout
 * @author Markus Ankenbrand
 * @param {Array} The array containing the coordinates as returned by getCircularKaryoCoords()
 */
AliTV.prototype.drawCircularKaryo = function(coords) {
	var that = this;
	this.svgD3.selectAll(".karyoGroup").remove();
	var outerRadius = this.conf.circular.outerRadius;
	this.svgD3.append("g")
		.attr("class", "karyoGroup")
		.attr("transform", "translate(" + this.conf.width / 2 + "," + this.conf.height / 2 + ")")
		.selectAll("path")
		.data(coords)
		.enter()
		.append("path")
		.attr("d", d3.svg.arc().innerRadius(outerRadius - this.conf.circular.karyoHeight).outerRadius(outerRadius))
		.attr("class", "karyo")
		.style("fill", function(d) {
			return that.colorKaryoByGenomeId(that.data.karyo.chromosomes[d.karyo].genome_id);
		});
};

/**
 * This function draws the ticks to the karyos in the circular layout
 * @author Markus Ankenbrand
 * @param {Array} The array containing the coordinates as returned by getCircularTickCoords()
 */
AliTV.prototype.drawCircularTicks = function(coords) {
	var that = this;
	that.svgD3.selectAll(".tickGroup").remove();

	that.svgD3.append("g")
		.attr("class", "tickGroup")
		.attr("transform", "translate(" + this.conf.width / 2 + "," + this.conf.height / 2 + ")")
		.selectAll("path")
		.data(coords)
		.enter()
		.append("path")
		.attr("d", function(d) {
			var startPoint = d3.svg.line.radial()([
				[that.conf.circular.outerRadius + that.conf.circular.tickSize, d]
			]);
			var endPoint = d3.svg.line.radial()([
				[that.conf.circular.outerRadius, d]
			]);
			endPoint = endPoint.replace(/^M/, 'L');
			return startPoint + endPoint + "Z";
		})
		.style("stroke", "#000");
};

/**
 * This function draws links in the circular layout
 * @author Markus Ankenbrand
 * @param {Array} The array circularLinkCoords containing the coordinates of all links as returned by getCircularLinkCoords()
 */
AliTV.prototype.drawCircularLinks = function(circularLinkCoords) {
	var that = this;
	this.svgD3.selectAll(".linkGroup").remove();
	this.svgD3.append("g")
		.attr("class", "linkGroup")
		.attr("transform", "translate(" + this.conf.width / 2 + "," + this.conf.height / 2 + ")")
		.selectAll("path")
		.data(circularLinkCoords)
		.enter()
		.append("path")
		.attr("class", "link")
		.attr("d", d3.svg.chord().radius(this.conf.circular.outerRadius - this.conf.circular.karyoHeight - this.conf.circular.linkKaryoDistance))
		.style("fill", function(d) {
			return that.colorLinksByIdentity(that.data.links[d.linkID].identity);
		});
};

/**
 * This function draws the data in the circular layout.
 * It operates on the data of the object and therefore needs no parameters.
 * It draws directly on the svg and therefore has no return value.
 * @author Markus Ankenbrand <markus.ankenbrand@uni-wuerzburg.de>
 */
AliTV.prototype.drawCircular = function() {
	var karyoCoords = this.getCircularKaryoCoords();
	var tickCoords = this.getCircularTickCoords(karyoCoords);
	this.drawCircularTicks(tickCoords);
	this.drawCircularKaryo(karyoCoords);
	var linkCoords = this.getCircularLinkCoords(karyoCoords);
	this.drawCircularLinks(linkCoords);
};

/**
 * This function returns the information of the spacer between two chromosomes which is set in the configuration.
 * @returns {Number} The actual spacer.
 * @author Sonja Hohlfeld
 */

AliTV.prototype.getLinearSpacer = function() {
	return this.conf.linear.karyoDistance;
};


/**
 * This function replaces the old spacer with the new spacer in the config-object.
 * It is called by a blur()-event, when the decription field loses focus.
 * When the mehtod gets a wrong spacer it throws an error message.
 * @param {Number} The function gets the spacer which can be set by the user.
 * @throws Will throw an error if the argument is empty.
 * @throws Will throw an error if the argument is not a number.
 * @throws Will throw an error if the argument is less than 0 or equal to 0.
 * @author Sonja Hohlfeld
 */

AliTV.prototype.setLinearSpacer = function(spacer) {
	if (spacer === "") {
		throw "empty";
	} else if (isNaN(spacer)) {
		throw "not a number";
	} else if (spacer <= 0) {
		throw "spacer is to small, it should be > 0";
	} else {
		spacer = Number(spacer);
		this.conf.linear.karyoDistance = spacer;
		return this.conf.linear.karyoDistance;
	}
};

/**
 * This function returns the information of the spacer between two genomes which is set in the configuration.
 * @returns {Number} The actual genome spacer.
 * @author Sonja Hohlfeld
 */

AliTV.prototype.getLinearGenomeSpacer = function() {
	return this.conf.linear.genomeDistance;
};
