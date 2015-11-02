/* global d3: false */
/* global $: false */
/* global _: false */
/* global document: false */
/* global textures: false */
/* global circles: false */
/* global bootbox: false */

// use const instead of var as soon as EcmaScript 6 (ES6 is widely used)
var AliTV_VERSION = "0.3.6";

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
	 * @property {Object}  karyo                                   - the chromosome information
	 * @property {Object}  karyo.chromosomes                       - the chromosome details, karyo IDs as keys
	 * @property {Number}  karyo.chromosomes.genome_id             - number of genome to which this chromosome belongs
	 * @property {Number}  karyo.chromosomes.length                - length in bp
	 * @property {String}  karyo.chromosomes.seq                   - sequence of the chromosome
	 * @property {Object}  features                                - the feature information, feature type as keys
	 * @property {Object}  features.link                           - the link feature information, feature IDs as keys
	 * @property {String}  features.link.karyo                     - the karyo ID
	 * @property {Number}  features.link.start                     - start position on the sequence
	 * @property {Number}  features.link.end                       - end position on the sequence
	 * @property {Array}   features.<type>                         - the feature information fot type <type>
	 * @property {String}  features.<type>.karyo                   - the karyo ID
	 * @property {String}  features.<type>.name                    - the name of the feature
	 * @property {Number}  features.<type>.start                   - start position on the sequence
	 * @property {Number}  features.<type>.end                     - end position on the sequence
	 * @property {Object}  links                                   - the link information, <source_genome> (sgen) as keys
	 * @property {Object}  links.<sgen>                            - the link information, <target_genome> (tgen) as keys
	 * @property {Object}  links.<sgen>.<tgen>                     - the link information, feature_id (fid) as key
	 * @property {Object}  links.<sgen>.<tgen>.<fid>               - the link information, feature_id (fid) as key
	 * @property {String}  links.<sgen>.<tgen>.<fid>.source        - source feature of the link
	 * @property {String}  links.<sgen>.<tgen>.<fid>.target        - target feature of the link
	 * @property {Number}  links.<sgen>.<tgen>.<fid>.identity      - identity of the link
	 */
	this.data = {};
	/**
	 * property to store data specific drawing options (structure highly dependent on data structure)
	 * @property {Object}  filters                      				 - the data dependent displaying information
	 * @property {Object}  filters.karyo                        		 - the chromosome dependent displaying information
	 * @property {Boolean} filters.skipChromosomesWithoutVisibleLinks	 - If a chromosome has no visible links, because they are filtered, it is possible to skip this chromosome.
	 * @property {Boolean} filters.showAllChromosomes					 - Allows to show all chromosomes, even if when they are set not visible.
	 * @property {Boolean} filters.onlyShowAdjacentLinks				 - Allows to show only adjacent links or all links.			
	 * @property {Array}   filters.karyo.order                  		 - array of chromosome IDs in the desired order (circular layout)
	 * @property {Array}   filters.karyo.genome_order          		 	 - array of genome IDs in the desired order (linear layout)
	 * @property {Object}  filters.karyo.chromosomes           			 - the chromosome drawing details, karyo IDs as keys
	 * @property {Boolean} filters.karyo.chromosomes.reverse    		 - should the sequence be treated as its reverse (complement)
	 * @property {Boolean} filters.karyo.chromosomes.visible    		 - should the sequence be displayed at all
	 * @property {Object}  filters.karyo.genome_region                   - An object that can contain genome_ids as keys and regions as values
	 * @property {Object}  filters.karyo.genome_region.<genome_id>		 - region object with optional "start" and "end" values
	 * @property {Object}  filters.karyo.genome_region.<genome_id>.start - start value in bp, this position in the genome scale (including gaps between chromosomes) will be at the start of the drawing area (left).
	 * @property {Object}  filters.karyo.genome_region.<genome_id>.end	 - end value in bp, this position in the genome scale (including gaps between chromosomes) will be at the end of the drawing area (right).
	 * @property {Number}  filters.links.minLinkIdentity	    		 - The minimum identity of links which should be draw.
	 * @property {Number}  filters.links.maxLinkIdentity    			 - The maximum identity of links which should be draw.
	 * @property {Number}  filters.links.minLinkLength  				 - The minimum length of links, which should be draw in bp.
	 * @property {Number}  filters.links.maxLinkLength  				 - The maximum length of links, which should be draw in bp.
	 */
	this.filters = {};
	/**
	 * property to store configuration options
	 * @property {Object}  linear                                  - The configuration options for the linear layout.
	 * @property {String}  linear.startLineColor                   - The start color of the color gradient for drawing karyos according to their genomeId
	 * @property {String}  linear.endLineColor                     - The end color of the color gradient.
	 * @property {String}  linear.hideHalfVisibleLinks			   - If true - do not show links with only one end in a visible region.
	 * @property {Object}  circular                                - The configuration options for the circular layout.
	 * @property {Number}  circular.tickSize                       - The size of the ticks in pixels. 
	 * @property {Number}  minLinkIdentity                         - The minimum of the link identity the user wants to color.
	 * @property {Number}  maxLinkIdentity                         - The maximum of the link identity the user wants to color.
	 * @property {Number}  midLinkIdentity                         - The middle of the link identity the user wants to color.
	 * @property {String}  minLinkIdentityColor                    - The color of the minimum link.
	 * @property {String}  maxLinkIdentityColor                    - The color of the maximum link.
	 * @property {String}  midLinkIdentityColor                    - The color of the middle link.  
	 * @property {Number}  minLinkLength						   - The minimum length of a link:
	 * @property {Number}  maxLinkLength						   - The maximum length of a link.
	 * @property {Object}  graphicalParameters                     - The configuration options for all graphical parameters.
	 * @property {Number}  graphicalParameters.canvasWidth         - The width of the alignment drawing area in px.
	 * @property {Number}  graphicalParameters.canvasHeight        - The height of the alignment drawing area in px.
	 * @property {Number}  graphicalParameters.karyoHeight         - The height of each chromosome in px.
	 * @property {Number}  graphicalParameters.karyoDistance       - The horizontal distance between adjacent chromosomes of the same genome in bp.
	 * @property {Number}  graphicalParameters.linkKaryoDistance   - The vertical distance between chromosomes and links in px.
	 * @property {Number}  graphicalParameters.tickDistance        - The distance in bp of ticks on the drawn chromosomes.
	 * @property {Number}  graphicalParameters.treeWidth		   - The width of the svg drawing area, where the tree should be shown.
	 * @property {Number}  graphicalParameters.genomeLabelWidth    - The width of the svg drawing area, where the genome labels should be shown.
	 * @property {Number}  graphicalParameters.fade				   - The value which is used for the opacity of links by the fadeLinks method.
	 * @property {Number}  graphicalParameters.buttonWidth		   - The width of the drawing area for the offset buttons.
	 * @property {String}  layout                                  - Contains the current layout, this means linear or circular.
	 * @property {Object}  tree									   - Contains the configuration objects for drawing a tree.
	 * @property {Boolean} tree.drawTree						   - With this option it is possible to draw a phylogenetic tree ext to the chromosomes.
	 * @property {Boolean} tree.orientation						   - Defines where the tree should be drawn.
	 * @property {Object}  features								   - Contains the configuration for feature groups.
	 * @property {Boolean} features.showAllFeatures				   - Defines if all features are drawn or not.
	 * @property {Object}  features.gene						   - Contains the configuration for genes.
	 * @property {String}  features.gene.form					   - Defines the shape of a gene.
	 * @property {String}  features.gene.color					   - Defines the color of a gene.
	 * @property {Number}  features.gene.height					   - Defines the height of the drawn gene onto the chromosome.
	 * @property {Boolean} features.gene.visible				   - Defines if a gene is drawn or not.
	 * @property {Object}  features.invertedRepeat				   - Contains the configuration for inverted repeats.
	 * @property {String}  features.invertedRepeat.form			   - Defines the shape of an inverted repeat.
	 * @property {String}  features.invertedRepeat.color		   - Defines the color of an inverted repeat.
	 * @property {Number}  features.invertedRepeat.height		   - Defines the height of the drawn inverted repeat onto the chromosome.
	 * @property {Boolean} features.invertedRepeat.visible		   - Defines if an inverted repeat is drawn or not.
	 * @property {Object}  features.nStretch				   	   - Contains the configuration for n stretch.
	 * @property {String}  features.nStretch.form			   	   - Defines the shape of a n stretch.
	 * @property {String}  features.nStretch.color		   		   - Defines the color of a n stretch.
	 * @property {Number}  features.nStretch.height		   		   - Defines the height of the drawn n stretch onto the chromosome.
	 * @property {Boolean} features.nStretch.visible		   	   - Defines if an inverted n stretch is drawn or not.
	 * @property {Object}  features.repeat				   		   - Contains the configuration for inverted repeats.
	 * @property {String}  features.repeat.form			   		   - Defines the shape of a repeat.
	 * @property {String}  features.repeat.color		   		   - Defines the color of a repeat.
	 * @property {Number}  features.repeat.height		   		   - Defines the height of the drawn repeat onto the chromosome.
	 * @property {Boolean} features.repeat.visible		   		   - Defines if an repeat is drawn or not.
	 * @property {Object}  features.fallback				   	   - Contains the configuration for non-supported feature classes.
	 * @property {String}  features.fallback.form			   	   - Defines the shape of a non-supported feature groups.
	 * @property {String}  features.fallback.color		   		   - Defines the color of a non-supported feature group.
	 * @property {Number}  features.fallback.height		   		   - Defines the height of the drawn non-supported feature group onto the chromosome.
	 * @property {Boolean} features.fallback.visible		   	   - Defines if an non-supported feature group is drawn or not.
	 * @property {Object}  labels								   - The configuration options for the text labels.
	 * @property {Boolean} labels.ticks							   - Contains the configuration for the labeling of the chromosome scale.
	 * @property {Boolean} labels.ticks.showTicks				   - Defines if ticks are drawn.
	 * @property {Boolean} labels.ticks.showTickLabels			   - Defines if tick labels are drawn.
	 * @property {String}  labels.ticks.color					   - Defines the color of ticks and their labels.
	 * @property {Object}  labels.genome					   	   - Contains the configurations for the genome labels.
	 * @property {Boolean} labels.genome.showGenomeLabels 		   - Defines if genome labels are shown or not.
	 * @property {String}  labels.genome.color					   - Defines the color of genome labels.
	 * @property {Number}  labels.genome.size					   - Defines the size of genome labels.
	 * @property {Object}  offset								   - Contains values for the offset
	 * @property {Boolean} offset.isSet							   - Defines if an offset is setted or not.
	 * @property {Number}  offset.distance						   - The value for shifting the chromosomes.
	 */
	this.conf = {
		linear: {
			startLineColor: "#49006a",
			endLineColor: "#1d91c0",
			hideHalfVisibleLinks: false
		},
		circular: {
			tickSize: 5
		},
		graphicalParameters: {
			canvasWidth: 1000,
			canvasHeight: 1000,
			karyoHeight: 30,
			karyoDistance: 10,
			linkKaryoDistance: 20,
			tickLabelFrequency: 10,
			tickDistance: 100,
			treeWidth: 300,
			genomeLabelWidth: 150,
			fade: 0.1,
			buttonWidth: 90
		},
		minLinkIdentity: 40,
		maxLinkIdentity: 100,
		midLinkIdentity: 60,
		minLinkIdentityColor: "#D21414",
		maxLinkIdentityColor: "#1DAD0A",
		midLinkIdentityColor: "#FFEE05",
		minLinkLength: 100,
		maxLinkLength: 5000,
		layout: "linear",
		tree: {
			drawTree: false,
			orientation: "left"
		},
		features: {
			showAllFeatures: false,
			supportedFeatures: {
				gene: {
					form: "rect",
					color: "#E2EDFF",
					height: 30,
					visible: false
				},
				invertedRepeat: {
					form: "arrow",
					color: "#e7d3e2",
					height: 30,
					visible: false,
					pattern: "woven"
				},
				nStretch: {
					form: "rect",
					color: "#000000",
					height: 30,
					visible: false,
					pattern: "lines"
				},
				repeat: {
					form: "rect",
					color: "#56cd0f",
					height: 30,
					visible: false,
					pattern: "woven"
				}
			},
			fallbackStyle: {
				form: "rect",
				color: "#787878",
				height: 30,
				visible: false
			}
		},
		labels: {
			ticks: {
				showTicks: true,
				showTickLabels: true,
				color: "#000000",
				size: 10
			},
			genome: {
				showGenomeLabels: true,
				color: "#000000",
				size: 25
			}
		},
		offset: {
			isSet: false,
			distance: 1000
		}
	};
	/**
	 * property to cache calculated values
	 * @property {Object}  cache                      				 - the data dependent displaying information
	 * @property {Object}  cache.linear                        		 - the chromosome dependent displaying information
	 * @property {Object}  cache.linear.maxGenomeSize	      		 - the chromosome dependent displaying information
	 */
	this.cache = {
		'linear': {}
	};
	/**
	 * array of registered onChange callback functions
	 * @property {Array} onChangeCallbacks             				 - array of callback functions
	 */
	this.onChangeCallbacks = [];
	/**
	 * boolean that indicates whether AliTV is inside transaction, see functions startTransaction and endTransaction
	 * @property {boolean} inTransaction             				 - is AliTV currently in transaction
	 */
	this.inTransaction = false;
	// Initialize svg size
	this.setSvgWidth(this.getCanvasWidth());
	this.setSvgHeight(this.getCanvasHeight());
	var that = this;
	// add mouse event handlers for the selection rect (inspired by http://bl.ocks.org/lgersman/5311083)
	this.svgD3.on("mousedown", function() {
		// only procede in the linear case and if no selection rect exists.
		if (that.conf.layout !== "linear" || that.svgD3.selectAll("rect.selection").size() > 0) {
			return;
		}
		var p = d3.mouse(this);
		that.svgD3.append("rect")
			.attr({
				rx: 6,
				ry: 6,
				class: "selection",
				x: p[0],
				y: p[1],
				width: 0,
				height: 0
			});
	}).on("mousemove", function() {
		var s = that.svgD3.select("rect.selection");
		if (!s.empty()) {
			var p = d3.mouse(this),
				d = {
					x: Number(s.attr("x")),
					y: Number(s.attr("y")),
					width: Number(s.attr("width")),
					height: Number(s.attr("height"))
				},
				move = {
					x: p[0] - d.x,
					y: p[1] - d.y
				};

			// this somewhat strange code is required to correct for lag between multiple calls from mousemove
			// this code is likely executed more than once concurrently when the mouse pointer is moved too fast.
			// therefore the selection box may loose the right coordinates if the mouse is moved rapidly.
			if (move.x < 1 || (move.x * 2 < d.width)) {
				d.x = p[0];
				d.width -= move.x;
			} else {
				d.width = move.x;
			}

			if (move.y < 1 || (move.y * 2 < d.height)) {
				d.y = p[1];
				d.height -= move.y;
			} else {
				d.height = move.y;
			}

			s.attr(d);
		}
	}).on("mouseup", function() {
		var s = that.svgD3.selectAll("rect.selection");
		if (s.size() > 0) {
			var rect = {
				x: Number(s.attr("x")),
				y: Number(s.attr("y")),
				width: Number(s.attr("width")),
				height: Number(s.attr("height"))
			};
			if (rect.width >= 10) {
				that.updateGenomeRegionBySvgRect(rect);
				that.drawLinear();
			}
			s.remove();
		}
	});
}

/**
 * Extends the existing conf of the AliTV object.
 * New features override the existing ones if conflicting. Non-conflicting configuration values are kept.
 * For the required format see the documentation of the conf property.
 * If you need to override the entire conf object write directly to the conf property of your AliTV object.
 * This is not recommended as AliTV will not function properly if some conf values are not set.
 * @author Markus Ankenbrand <markus.ankenbrand@uni-wuerzburg.de>
 * @param {Object} conf - Object containing conf values
 */
AliTV.prototype.setConf = function(conf) {
	jQuery.extend(true, this.conf, conf);
	this.triggerChange();
};

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
	this.triggerChange();
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
	if (this.filters.links === undefined) {
		this.filters.links = {};
	}
	if (this.filters.features === undefined) {
		this.filters.features = {};
	}
	if (this.filters.links.invisibleLinks === undefined) {
		this.filters.links.invisibleLinks = {};
	}
	if (this.filters.features.invisibleFeatures === undefined) {
		this.filters.features.invisibleFeatures = {};
	}
	if (this.data.karyo !== undefined) {
		this.filters.links.maxLinkLength = this.getMaxChromosomeLength();
	}
	this.triggerChange();
};

/**
 * Calculates coordinates for the chromosomes to draw in the linear layout.
 * This function operates on the data property of the object and therefore needs no parameters.
 * This function is primarily meant for internal usage, the user should not need to call this directly.
 * The function also updates the value cache.linear.maxGenomeSize
 * @author Markus Ankenbrand <markus.ankenbrand@uni-wuerzburg.de>
 * @returns {Array} Array containing one Object for each element in data.karyo of the form {karyo: 'karyo_name', x:0, y:0, width:10, height:10}
 */
AliTV.prototype.getLinearKaryoCoords = function() {
	var linearKaryoCoords = [];
	var genome_order = this.filters.karyo.genome_order;
	var conf = this.conf;
	var genomeDistance = this.getGenomeDistance();
	var that = this;
	var visibleChromosomes = that.filterChromosomes();
	var orderOfVisibleChromosomes = that.filterChromosomeOrder(visibleChromosomes);
	var genomeScale = {};

	var total = [];
	var current = [];
	var i;
	// Initialize total with the negative of one karyoDistance - as there is one space less then karyos per genome
	for (i = 0; i < genome_order.length; i++) {
		total.push(-conf.graphicalParameters.karyoDistance);
		current.push(0);
	}

	$.each(visibleChromosomes, function(key, value) {
		total[genome_order.indexOf(value.genome_id)] += value.length + conf.graphicalParameters.karyoDistance;
	});
	var maxTotalSize = Math.max.apply(null, total);
	that.cache.linear.maxGenomeSize = maxTotalSize;

	// Calculate genome specific scales
	var getGenomeScale = function(gid) {
		var genomeSvgScale = d3.scale.linear()
			.domain([0, maxTotalSize]);
		var genome_start = 0;
		var genome_region = that.filters.karyo.genome_region || {};
		if (typeof(genome_region[gid] || {}).start !== 'undefined') {
			genome_start = genome_region[gid].start;
		}
		var genome_end = maxTotalSize;
		if (typeof(genome_region[gid] || {}).end !== 'undefined') {
			genome_end = genome_region[gid].end;
		} else {
			genome_end += genome_start;
		}
		// The calculation of the range for the scale depends on ideas of the intercept theorem
		genomeSvgScale.range([conf.graphicalParameters.canvasWidth * genome_start / (genome_start - genome_end),
			conf.graphicalParameters.canvasWidth * (maxTotalSize - genome_start) / (genome_end - genome_start)
		]);
		return genomeSvgScale;
	};

	for (i = 0; i < genome_order.length; i++) {
		genomeScale[genome_order[i]] = getGenomeScale(genome_order[i]);
	}

	for (i = 0; i < orderOfVisibleChromosomes.length; i++) {
		var key = orderOfVisibleChromosomes[i];
		var value = visibleChromosomes[key];
		var coord = {
			'karyo': key,
			'y': genome_order.indexOf(value.genome_id) * genomeDistance,
			'height': conf.graphicalParameters.karyoHeight,
			'genome': value.genome_id
		};
		var genome2svgScale = genomeScale[value.genome_id];

		if (this.filters.karyo.chromosomes[key].reverse === false) {
			coord.width = genome2svgScale(value.length) - genome2svgScale(0);
			coord.x = genome2svgScale(current[genome_order.indexOf(value.genome_id)]);
		} else {
			coord.x = genome2svgScale(current[genome_order.indexOf(value.genome_id)] + value.length);
			coord.width = genome2svgScale(0) - genome2svgScale(value.length);
		}
		current[genome_order.indexOf(value.genome_id)] += value.length + conf.graphicalParameters.karyoDistance;
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
	var visibleChromosomes = that.filterChromosomes();
	var visibleLinks = that.filterLinks(visibleChromosomes);
	var karyoMap = {};
	$.each(coords, function(key, value) {
		karyoMap[value.karyo] = key;
	});
	$.each(visibleLinks, function(key, value) {
		var link = {};
		link.linkID = key;
		link.source0 = {};
		link.source1 = {};
		link.target0 = {};
		link.target1 = {};
		var splitLink = {};
		splitLink.linkID = key;
		splitLink.source0 = {};
		splitLink.source1 = {};
		splitLink.target0 = {};
		splitLink.target1 = {};
		var splitPart;
		var linkSource;
		var linkTarget;
		var feature1 = that.data.features.link[value.source];
		var feature2 = that.data.features.link[value.target];
		var karyo1 = that.data.karyo.chromosomes[feature1.karyo];
		var karyo2 = that.data.karyo.chromosomes[feature2.karyo];
		var karyo1Coords = coords[karyoMap[feature1.karyo]];
		var karyo2Coords = coords[karyoMap[feature2.karyo]];
		var genomePosition1 = that.filters.karyo.genome_order.indexOf(karyo1.genome_id);
		var genomePosition2 = that.filters.karyo.genome_order.indexOf(karyo2.genome_id);
		var lengthOfFeature1 = Math.abs(that.data.features.link[value.source].end - that.data.features.link[value.source].start);
		var lengthOfFeature2 = Math.abs(that.data.features.link[value.target].end - that.data.features.link[value.target].start);

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

		var shift1 = (that.filters.karyo.chromosomes[feature1.karyo].offset === undefined ? 0 : that.filters.karyo.chromosomes[feature1.karyo].offset);
		var shift2 = (that.filters.karyo.chromosomes[feature2.karyo].offset === undefined ? 0 : that.filters.karyo.chromosomes[feature2.karyo].offset);

		var linkTargetScale = d3.scale.linear()
			.domain([0, karyo2.length])
			.range([karyo2Coords.x, karyo2Coords.x + karyo2Coords.width]);

		var linkSourceScale = d3.scale.linear()
			.domain([0, karyo1.length])
			.range([karyo1Coords.x, karyo1Coords.x + karyo1Coords.width]);

		link.source0.x = linkSourceScale((feature1.start + shift1 + karyo1.length) % karyo1.length) === linkSourceScale(0) && (feature1.start > feature1.end && feature1.start + shift1 === karyo1.length) ? linkSourceScale(karyo1.length) : linkSourceScale((feature1.start + shift1 + karyo1.length) % karyo1.length);
		link.source0.y = karyo1Coords.y + karyo1Coords.height + conf.graphicalParameters.linkKaryoDistance;
		link.source1.x = linkSourceScale((feature1.end + shift1 + karyo1.length) % karyo1.length) === linkSourceScale(0) && !(feature1.start > feature1.end && feature1.end + shift1 === 0) ? linkSourceScale(karyo1.length) : linkSourceScale((feature1.end + shift1 + karyo1.length) % karyo1.length);
		link.source1.y = karyo1Coords.y + karyo1Coords.height + conf.graphicalParameters.linkKaryoDistance;

		link.target0.x = linkTargetScale((feature2.start + shift2 + karyo2.length) % karyo2.length) === linkTargetScale(0) && (feature2.start + shift2 === karyo2.length && feature2.start > feature2.end) ? linkTargetScale(karyo2.length) : linkTargetScale((feature2.start + shift2 + karyo2.length) % karyo2.length);
		link.target0.y = karyo2Coords.y - conf.graphicalParameters.linkKaryoDistance;
		link.target1.x = linkTargetScale((feature2.end + shift2 + karyo2.length) % karyo2.length) === linkTargetScale(0) && !(feature2.start > feature2.end && feature2.end + shift2 === 0) ? linkTargetScale(karyo2.length) : linkTargetScale((feature2.end + shift2 + karyo2.length) % karyo2.length);
		link.target1.y = karyo2Coords.y - conf.graphicalParameters.linkKaryoDistance;

		if ((feature1.start < feature1.end && link.source0.x > link.source1.x && that.filters.karyo.chromosomes[feature1.karyo].reverse === false) || (feature1.start < feature1.end && link.source0.x < link.source1.x && that.filters.karyo.chromosomes[feature1.karyo].reverse === true)) {
			splitPart = (feature1.end + shift1 + karyo1.length) % karyo1.length / Math.abs(feature1.start - feature1.end);

			linkTarget = link.target1.x;
			link.source1.x = linkSourceScale(karyo1.length);
			link.target1.x = linkTargetScale(feature2.start > feature2.end ? Math.min(feature2.end, feature2.start) + splitPart * Math.abs(feature2.start - feature2.end) : Math.min(feature2.end, feature2.start) + (1 - splitPart) * Math.abs(feature2.start - feature2.end));

			splitLink.source0.x = linkSourceScale(0);
			splitLink.source0.y = link.source0.y;
			splitLink.source1.x = linkSourceScale((feature1.end + shift1 + karyo1.length) % karyo1.length) === linkSourceScale(0) && !(feature1.start > feature1.end && feature1.end + shift1 === 0) ? linkSourceScale(karyo1.length) : linkSourceScale((feature1.end + shift1 + karyo1.length) % karyo1.length);
			splitLink.source1.y = link.source1.y;

			splitLink.target0.x = linkTargetScale(feature2.start > feature2.end ? Math.min(feature2.end, feature2.start) + splitPart * Math.abs(feature2.start - feature2.end) : Math.min(feature2.end, feature2.start) + (1 - splitPart) * Math.abs(feature2.start - feature2.end));
			splitLink.target0.y = link.target0.y;
			splitLink.target1.x = linkTarget;
			splitLink.target1.y = link.target1.y;

			linearLinkCoords.push(splitLink);
			linearLinkCoords.push(link);
		} else if ((feature2.start < feature2.end && link.target0.x > link.target1.x && that.filters.karyo.chromosomes[feature2.karyo].reverse === false) || (feature2.start < feature2.end && link.target0.x < link.target1.x && that.filters.karyo.chromosomes[feature2.karyo].reverse === true)) {
			splitPart = (feature2.end + shift2 + karyo2.length) % karyo2.length / Math.abs(feature2.start - feature2.end);
			linkSource = link.source1.x;

			link.source1.x = linkSourceScale(feature1.start > feature1.end ? Math.min(feature1.start, feature1.end) + splitPart * Math.abs(feature1.start - feature1.end) : Math.min(feature1.start, feature1.end) + (1 - splitPart) * Math.abs(feature1.start - feature1.end));
			link.target1.x = linkTargetScale(karyo2.length);

			splitLink.source0.x = linkSourceScale(feature1.start > feature1.end ? Math.min(feature1.start, feature1.end) + splitPart * Math.abs(feature1.start - feature1.end) : Math.min(feature1.start, feature1.end) + (1 - splitPart) * Math.abs(feature1.start - feature1.end));
			splitLink.source0.y = link.source0.y;
			splitLink.source1.x = linkSource;
			splitLink.source1.y = link.source1.y;

			splitLink.target0.x = linkTargetScale(0);
			splitLink.target0.y = link.target0.y;
			splitLink.target1.x = linkTargetScale((feature2.end + shift2 + karyo2.length) % karyo2.length) === linkTargetScale(0) && !(feature2.start > feature2.end && feature2.end + shift2 === 0) ? linkTargetScale(karyo2.length) : linkTargetScale((feature2.end + shift2 + karyo2.length) % karyo2.length);
			splitLink.target1.y = link.target1.y;

			linearLinkCoords.push(splitLink);
			linearLinkCoords.push(link);
		} else if ((feature1.start > feature1.end && link.source0.x < link.source1.x && that.filters.karyo.chromosomes[feature1.karyo].reverse === false) || (feature1.start > feature1.end && link.source0.x > link.source1.x && that.filters.karyo.chromosomes[feature1.karyo].reverse === true)) {
			splitPart = (feature1.start + shift1 + karyo1.length) % karyo1.length / Math.abs(feature1.start - feature1.end);
			linkTarget = link.target1.x;

			link.source1.x = linkSourceScale(0);
			link.target1.x = linkTargetScale(feature2.start + splitPart * (Math.abs(feature2.start - feature2.end)));

			splitLink.source0.x = linkSourceScale(karyo1.length);
			splitLink.source0.y = link.source0.y;
			splitLink.source1.x = linkSourceScale((feature1.end + shift1 + karyo1.length) % karyo1.length) === linkSourceScale(0) && !(feature1.start > feature1.end && feature1.end + shift1 === 0) ? linkSourceScale(karyo1.length) : linkSourceScale((feature1.end + shift1 + karyo1.length) % karyo1.length);
			splitLink.source1.y = link.source1.y;

			splitLink.target0.x = linkTargetScale(feature2.start + splitPart * (Math.abs(feature2.start - feature2.end)));
			splitLink.target0.y = link.target0.y;
			splitLink.target1.x = linkTarget;
			splitLink.target1.y = link.target1.y;

			linearLinkCoords.push(splitLink);
			linearLinkCoords.push(link);
		} else if ((feature2.start > feature2.end && link.target0.x < link.target1.x && that.filters.karyo.chromosomes[feature2.karyo].reverse === false) || (feature2.start > feature2.end && link.target0.x > link.target1.x && that.filters.karyo.chromosomes[feature2.karyo].reverse === true)) {
			splitPart = (feature2.start + shift2 + karyo2.length) % karyo2.length / Math.abs(feature2.start - feature2.end);
			linkSource = link.source1.x;

			link.source1.x = linkSourceScale(feature1.start + splitPart * (Math.abs(feature1.start - feature1.end)));
			link.target1.x = linkTargetScale(0);

			splitLink.source0.x = linkSourceScale(feature1.start + splitPart * (Math.abs(feature1.start - feature1.end)));
			splitLink.source0.y = link.source0.y;
			splitLink.source1.x = linkSource;
			splitLink.source1.y = link.source1.y;

			splitLink.target0.x = linkTargetScale(karyo2.length);
			splitLink.target0.y = link.target0.y;
			splitLink.target1.x = linkTargetScale((feature2.end + shift2 + karyo2.length) % karyo2.length) === linkTargetScale(0) && !(feature2.start > feature2.end && feature2.end + shift2 === 0) ? linkTargetScale(karyo2.length) : linkTargetScale((feature2.end + shift2 + karyo2.length) % karyo2.length);
			splitLink.target1.y = link.target1.y;

			linearLinkCoords.push(splitLink);
			linearLinkCoords.push(link);

		} else {
			linearLinkCoords.push(link);
		}
	});
	linearLinkCoords = this.removeLinksOutsideVisibleRegion(linearLinkCoords, this.conf.linear.hideHalfVisibleLinks);
	return linearLinkCoords;
};

/**
 * This function draws the karyos in the linear layout, color them according to their genome_id and add some events to the chromosome.
 * @author Markus Ankenbrand and Sonja Hohlfeld
 * @param {Array} The array containing the coordinates as returned by getLinearKaryoCoords()
 */
AliTV.prototype.drawLinearKaryo = function(linearKaryoCoords) {
	var that = this;

	function dragEvent() {
		that.svgD3.selectAll('.karyoGroup')
			.attr("x", d3.event.x - parseInt(that.svgD3.selectAll('.karyoGroup').attr("width")) / 2)
			.attr("y", d3.event.y - parseInt(that.svgD3.selectAll('.karyoGroup').attr("height")) / 2);
	}

	var drag = d3.behavior.drag()
		.on("drag", dragEvent);

	that.svgD3.selectAll(".karyoGroup").remove();
	that.getAlignmentRegion().append("g")
		.attr("class", "karyoGroup")
		.selectAll("path")
		.data(linearKaryoCoords)
		.enter()
		.append("rect")
		.attr("class", "karyo")
		.attr("id", function(d) {
			return that.data.karyo.chromosomes[d.karyo].genome_id + ", " + d.karyo;
		})
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
			that.fadeLinks(g, that.conf.graphicalParameters.fade);
		})
		.on("mouseout", function(g) {
			that.fadeLinks(g, 1);
		})
		.on("click", function(g) {
			that.changeChromosomeOrientation(g.karyo);
			that.drawLinear();
		})
		.style("fill", function(d) {
			return that.colorKaryoByGenomeId(that.data.karyo.chromosomes[d.karyo].genome_id);
		})
		.call(drag);
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

	return color(that.filters.karyo.genome_order.indexOf(genomeId));
};

/**
 * This function calculates the tick coords and operates on the chromosomes and need the length in bp and the width in px of the karyo.
 * @author Sonja Hohlfeld
 * @param {Array} The array containing the coordinates as returned by getLinearKaryoCoords()
 * @return {Array} The array containing the tick coordinates as shown in the following example.
 * 				   Ticks for one chromosome have to be adjacent and in the order from start to end.
 * @example linearTickCoords = [{id: 'c1', x1: 0, x2: 0, y1: 860, y2: 910}, {id: 'c2', x1: 0, x2: 0, y1: 660, y2:710}]
 */

AliTV.prototype.getLinearTickCoords = function(karyoCoords) {
	var that = this;
	var linearTickCoords = [];

	$.each(karyoCoords, function(key, value) {
		var ticks = [];
		var shift;
		shift = (that.filters.karyo.chromosomes[value.karyo].offset === undefined ? 0 : that.filters.karyo.chromosomes[value.karyo].offset);
		var scale = d3.scale.linear()
			.domain([0, that.data.karyo.chromosomes[value.karyo].length])
			.range([value.x, value.x + value.width]);

		var chromosomePosition = 0;
		for (var i = 0; chromosomePosition < that.data.karyo.chromosomes[value.karyo].length; i++) {
			var currentTick = scale((chromosomePosition + shift + that.data.karyo.chromosomes[value.karyo].length) % that.data.karyo.chromosomes[value.karyo].length);

			chromosomePosition += that.conf.graphicalParameters.tickDistance;
			var coords = {};
			coords.id = value.karyo;
			coords.x1 = currentTick;
			coords.x2 = currentTick;

			if (i % that.conf.graphicalParameters.tickLabelFrequency === 0 && (that.conf.labels.ticks.showTickLabels === true)) {
				coords.y1 = value.y - 10;
				coords.y2 = value.y + value.height + 10;
			} else {
				coords.y1 = value.y - 5;
				coords.y2 = value.y + value.height + 5;
			}
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
	this.getAlignmentRegion().selectAll(".tickGroup").remove();
	that.getAlignmentRegion().append("g")
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
		.style("stroke", that.getTickLabelColor());
};

/**
 * This method is supposed to label the ticks with configurable tick labels.
 * @author Sonja Hohlfeld
 * @param linearTickCoords
 */
AliTV.prototype.drawLinearTickLabels = function(linearTickCoords) {
	var that = this;

	var lastID = '';
	var counter = 0;
	var filteredLinearTickCoords = [];
	$.each(linearTickCoords, function(key, value) {
		if (lastID !== value.id) {
			lastID = value.id;
			counter = 0;
		}
		if (counter % that.conf.graphicalParameters.tickLabelFrequency === 0) {
			var myValue = {};
			$.extend(true, myValue, value);
			myValue.counter = counter;
			filteredLinearTickCoords.push(myValue);
		}
		counter++;
	});

	var labels = that.getAlignmentRegion().append("g")
		.attr("class", "tickLabelGroup")
		.selectAll("path")
		.data(filteredLinearTickCoords)
		.enter();

	labels.append("text")
		.attr("class", "tickLabel")
		.attr("x", function(d) {
			return d.x1 - 3;
		})
		.attr("y", function(d) {
			return d.y1;
		})
		.text(function(d) {
			return d.counter * that.conf.graphicalParameters.tickDistance + " bp";
		})
		.attr("font-size", that.getTickLabelSize() + "px")
		.attr("fill", that.getTickLabelColor());

	labels.append("text")
		.attr("class", "tickLabel")
		.attr("x", function(d) {
			return d.x2 - 3;
		})
		.attr("y", function(d) {
			return d.y2 + 6;
		})
		.text(function(d) {
			return d.counter * that.conf.graphicalParameters.tickDistance + " bp";
		})
		.attr("font-size", that.getTickLabelSize() + "px")
		.attr("fill", that.getTickLabelColor());
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
			return that.data.features.link[that.visibleLinks[d.linkID].source].karyo != g.karyo && that.data.features.link[that.visibleLinks[d.linkID].target].karyo != g.karyo;
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

	this.getAlignmentRegion().selectAll(".linkGroup").remove();
	this.getAlignmentRegion().append("g")
		.attr("class", "linkGroup")
		.selectAll("path")
		.data(linearLinkCoords)
		.enter()
		.append("path")
		.attr("class", "link")
		.attr("id", function(d) {
			return d.linkID;
		})
		.attr("d", coordsToPath)
		.style("fill", function(d) {
			return that.colorLinksByIdentity(that.visibleLinks[d.linkID].identity);
		})
		.style("display", function(d) {
			if (d.linkID in that.filters.links.invisibleLinks) {
				return "none";
			}
		});
};


/**
 * This function draws the data in the linear layout.
 * It operates on the data of the object and therefore needs no parameters.
 * It draws directly on the svg and therefore has no return value.
 * @author Markus Ankenbrand <markus.ankenbrand@uni-wuerzburg.de>
 */
AliTV.prototype.drawLinear = function() {
	this.clearAli();
	this.getAlignmentRegion().remove();
	this.getAlignmentRegion();

	var karyoCoords = this.getLinearKaryoCoords();
	var linearTickCoords = this.getLinearTickCoords(karyoCoords);
	this.drawLinearTicks(linearTickCoords);
	this.drawLinearKaryo(karyoCoords);
	var linkCoords = this.getLinearLinkCoords(karyoCoords);
	this.drawLinearLinks(linkCoords);
	this.drawFeatureLegend();
	this.drawLinkIdentityLegend();

	if (this.conf.labels.ticks.showTickLabels === true) {
		this.drawLinearTickLabels(linearTickCoords);
	}

	if (this.conf.labels.genome.showGenomeLabels === true) {
		var linearGenomeLabelCoords = this.getGenomeLabelCoords();
		this.drawLinearGenomeLabels(linearGenomeLabelCoords);
		this.setSvgWidth(this.conf.graphicalParameters.canvasWidth + this.conf.graphicalParameters.genomeLabelWidth);
	}

	var linearFeatureCoords = this.getLinearFeatureCoords(karyoCoords);
	this.drawLinearFeatures(linearFeatureCoords);

	if (this.conf.tree.drawTree === true && this.hasTree() === true) {
		this.drawPhylogeneticTree();
		this.setSvgWidth(this.conf.graphicalParameters.canvasWidth + this.conf.graphicalParameters.treeWidth);
	}

	if (this.conf.tree.drawTree === true && this.conf.labels.genome.showGenomeLabels) {
		this.setSvgWidth(this.conf.graphicalParameters.canvasWidth + this.conf.graphicalParameters.treeWidth + this.conf.graphicalParameters.genomeLabelWidth);
	}

	if (this.conf.tree.drawTree === true && this.conf.tree.orientation === "left") {
		this.getAlignmentRegion().attr("transform", "translate(" + this.conf.graphicalParameters.treeWidth + ", 0)");
	}
	if (this.conf.tree.drawTree === true && this.conf.tree.orientation === "right" && this.conf.labels.genome.showGenomeLabels === false) {
		this.svgD3.selectAll(".treeGroup").attr("transform", "translate(" + this.conf.graphicalParameters.canvasWidth + ", 0)");
	}
	if (this.conf.labels.genome.showGenomeLabels === true) {
		this.getAlignmentRegion().attr("transform", "translate(" + this.conf.graphicalParameters.genomeLabelWidth + ", 0)");
		if (this.conf.tree.drawTree === true && this.conf.tree.orientation === "right") {
			this.svgD3.selectAll(".treeGroup").attr("transform", "translate(" + (this.conf.graphicalParameters.canvasWidth + this.conf.graphicalParameters.genomeLabelWidth) + ", 0)");
		}
	}
	if ((this.conf.labels.genome.showGenomeLabels === true) && this.conf.tree.drawTree === true && this.conf.tree.orientation === "left") {
		this.getAlignmentRegion().attr("transform", "translate(" + (this.conf.graphicalParameters.treeWidth + this.conf.graphicalParameters.genomeLabelWidth) + ", 0)");
	}
	// move feature legend below the alignment area and adjust svg height
	this.getLegendRegion().attr("transform", "translate(0," + this.conf.graphicalParameters.canvasHeight + ")");
	if (typeof this.getLegendRegion().node().getBBox !== "undefined") {
		this.setSvgHeight(this.conf.graphicalParameters.canvasHeight + this.getLegendRegion().node().getBBox().height + this.getLegendRegion().node().getBBox().y);
	}

	this.conf.layout = "linear";
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
	var spacer = this.conf.graphicalParameters.karyoDistance;
	var current = -spacer;
	$.each(this.data.karyo.chromosomes, function(key, value) {
		total += value.length + spacer;
	});
	for (var i = 0; i < this.filters.karyo.order.length; i++) {
		var key = this.filters.karyo.order[i];
		var value = this.data.karyo.chromosomes[key];
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

	var visibleChromosomes = that.filterChromosomes();
	var visibleLinks = that.filterLinks(visibleChromosomes);

	$.each(visibleLinks, function(key, value) {
		var link = {};
		link.linkID = key;

		var feature1 = that.data.features.link[value.source];
		var feature2 = that.data.features.link[value.target];
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
			chromosomePosition += that.conf.graphicalParameters.tickDistance;
		}
	});
	return circularTickCoords;
};

/**
 * This function draws the karyos in the circular layout, color them according to their genome_id and add some eventHandlers.
 * @author Markus Ankenbrand
 * @param {Array} The array containing the coordinates as returned by getCircularKaryoCoords()
 */
AliTV.prototype.drawCircularKaryo = function(coords) {
	var that = this;
	this.svgD3.selectAll(".karyoGroup").remove();
	var outerRadius = this.getOuterRadius();
	this.svgD3.append("g")
		.attr("class", "karyoGroup")
		.attr("transform", "translate(" + this.conf.graphicalParameters.canvasWidth / 2 + "," + this.conf.graphicalParameters.canvasHeight / 2 + ")")
		.selectAll("path")
		.data(coords)
		.enter()
		.append("path")
		.attr("d", d3.svg.arc().innerRadius(outerRadius - this.conf.graphicalParameters.karyoHeight).outerRadius(outerRadius))
		.attr("class", "karyo")
		.style("fill", function(d) {
			return that.colorKaryoByGenomeId(that.data.karyo.chromosomes[d.karyo].genome_id);
		})
		.on("mouseover", function(g) {
			that.fadeLinks(g, 0.1);
		})
		.on("mouseout", function(g) {
			that.fadeLinks(g, 1);
		})
		.on("click", function(g) {
			that.filters.karyo.chromosomes[g.karyo].reverse = !that.filters.karyo.chromosomes[g.karyo].reverse;
			that.drawCircular();
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
		.attr("transform", "translate(" + this.conf.graphicalParameters.canvasWidth / 2 + "," + this.conf.graphicalParameters.canvasHeight / 2 + ")")
		.selectAll("path")
		.data(coords)
		.enter()
		.append("path")
		.attr("d", function(d) {
			var startPoint = d3.svg.line.radial()([
				[that.getOuterRadius() + that.conf.circular.tickSize, d]
			]);
			var endPoint = d3.svg.line.radial()([
				[that.getOuterRadius(), d]
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
		.attr("transform", "translate(" + this.conf.graphicalParameters.canvasWidth / 2 + "," + this.conf.graphicalParameters.canvasHeight / 2 + ")")
		.selectAll("path")
		.data(circularLinkCoords)
		.enter()
		.append("path")
		.attr("class", "link")
		.attr("d", d3.svg.chord().radius(this.getOuterRadius() - this.conf.graphicalParameters.karyoHeight - this.conf.graphicalParameters.linkKaryoDistance))
		.style("fill", function(d) {
			return that.colorLinksByIdentity(that.visibleLinks[d.linkID].identity);
		});
};

/**
 * This function draws the data in the circular layout.
 * It operates on the data of the object and therefore needs no parameters.
 * It draws directly on the svg and therefore has no return value.
 * @author Markus Ankenbrand <markus.ankenbrand@uni-wuerzburg.de>
 */
AliTV.prototype.drawCircular = function() {
	this.clearAli();
	var karyoCoords = this.getCircularKaryoCoords();
	var tickCoords = this.getCircularTickCoords(karyoCoords);
	this.drawCircularTicks(tickCoords);
	this.drawCircularKaryo(karyoCoords);
	var linkCoords = this.getCircularLinkCoords(karyoCoords);
	this.drawCircularLinks(linkCoords);
	this.conf.layout = "circular";
	this.triggerChange();
};

/**
 * This function returns the information of the spacer between two chromosomes which is set in the configuration.
 * @returns {Number} The actual spacer.
 * @author Sonja Hohlfeld
 */

AliTV.prototype.getKaryoSpacer = function() {
	return this.conf.graphicalParameters.karyoDistance;
};


/**
 * This function replaces the old spacer with the new spacer in the config-object.
 * It is called by a blur()-event, when the decription field loses focus.
 * When the method gets a wrong spacer it throws an error message.
 * @param {Number} The function gets the spacer which can be set by the user.
 * @throws Will throw an error if the argument is Sorry, you entered an empty value. Please try it again..
 * @throws Will throw an error if the argument is not a number.
 * @throws Will throw an error if the argument is less than 0 or equal to 0.
 * @author Sonja Hohlfeld
 */

AliTV.prototype.setKaryoSpacer = function(spacer) {
	if (spacer === "") {
		throw "Sorry, you entered an empty value. Please try it again.";
	} else if (isNaN(spacer)) {
		throw "Sorry, you entered not a number. Please try it again.";
	} else if (spacer <= 0) {
		throw "Sorry, the entered value is too small. Please, insert one which is not less than 0.";
	} else {
		this.conf.graphicalParameters.karyoDistance = spacer;
		this.triggerChange();
		return this.conf.graphicalParameters.karyoDistance;
	}
};

/**
 * This function returns the height of the chromosomes between two genomes which is set in the configuration.
 * @returns {Number} The actual height of chromosomes.
 * @author Sonja Hohlfeld
 */

AliTV.prototype.getKaryoHeight = function() {
	return this.conf.graphicalParameters.karyoHeight;
};

/**
 * This function replaces the old height of the chromosomes with the new value in the config-object.
 * It is called by a blur()-event, when the decription field loses focus.
 * When the method gets a wrong value it throws an error message.
 * @param {Number} The function gets the height of chromosomes which can be set by the user.
 * @throws Will throw an error if the argument is empty.
 * @throws Will throw an error if the argument is not a number.
 * @throws Will throw an error if the argument is less than 0 or equal to 0.
 * @author Sonja Hohlfeld
 */

AliTV.prototype.setKaryoHeight = function(height) {
	if (height === "") {
		throw "Sorry, you entered an empty value. Please try it again.";
	} else if (isNaN(height)) {
		throw "Sorry, you entered not a number. Please try it again.";
	} else if (height <= 0) {
		throw "Sorry, the entered value is too small. Please, insert one which is not less than 0.";
	} else {
		height = Number(height);
		this.conf.graphicalParameters.karyoHeight = height;
		this.triggerChange();
		return this.conf.graphicalParameters.karyoHeight;
	}
};

/**
 * This function returns the width of the svg drawing area.
 * @returns {Number} The width of canvas.
 * @author Sonja Hohlfeld
 */

AliTV.prototype.getCanvasWidth = function() {
	return this.conf.graphicalParameters.canvasWidth;
};

/**
 * This function replaces the old width of the drawing area for the alignment.
 * When the method gets a wrong value it throws an error message.
 * @param {Number} The function gets the width of the svg drawing area which can be set by the user.
 * @throws Will throw an error if the argument is empty.
 * @throws Will throw an error if the argument is not a number.
 * @throws Will throw an error if the argument is less than 0 or equal to 0.
 * @author Sonja Hohlfeld
 */

AliTV.prototype.setCanvasWidth = function(width) {
	if (width === "") {
		throw "Sorry, you entered an empty value. Please try it again.";
	} else if (isNaN(width)) {
		throw "Sorry, you entered not a number. Please try it again.";
	} else if (width <= 0) {
		throw "Sorry, the entered value is too small. Please, insert one which is not less than 0.";
	} else {
		width = Number(width);
		this.conf.graphicalParameters.canvasWidth = width;
		this.triggerChange();
		return this.conf.graphicalParameters.canvasWidth;
	}
};

/**
 * This function returns the height of the svg drawing area.
 * @returns {Number} The height of canvas.
 * @author Sonja Hohlfeld
 */

AliTV.prototype.getCanvasHeight = function() {
	return this.conf.graphicalParameters.canvasHeight;
};


/**
 * This function replaces the old height of the drawing area for the alignment.
 * When the method gets a wrong value it throws an error message.
 * @param {Number} The function gets the height of the svg drawing area which can be set by the user.
 * @throws Will throw an error if the argument is empty.
 * @throws Will throw an error if the argument is not a number.
 * @throws Will throw an error if the argument is less than 0 or equal to 0.
 * @author Sonja Hohlfeld
 */

AliTV.prototype.setCanvasHeight = function(height) {
	if (height === "") {
		throw "Sorry, you entered an empty value. Please try it again.";
	} else if (isNaN(height)) {
		throw "Sorry, you entered not a number. Please try it again.";
	} else if (height <= 0) {
		throw "Sorry, the entered value is too small. Please, insert one which is not less than 0.";
	} else {
		height = Number(height);
		this.conf.graphicalParameters.canvasHeight = height;
		this.triggerChange();
		return this.conf.graphicalParameters.canvasHeight;
	}
};

/**
 * This function returns the distance of the chromosome ticks in bp.
 * @returns {Number} The tick distance in bp.
 * @author Sonja Hohlfeld
 */

AliTV.prototype.getTickDistance = function() {
	var json = this.getJSON();
	return json.conf.graphicalParameters.tickDistance;
};

/**
 * This function replaces the old distance between ticks with the new distance in the config-object.
 * It is called by a blur()-event, when the decription field loses focus.
 * When the method gets a wrong value it throws an error message.
 * @param {Number} The function gets the distance between ticks which can be set by the user.
 * @throws Will throw an error if the argument is empty.
 * @throws Will throw an error if the argument is not a number.
 * @throws Will throw an error if the argument is less than 0 or equal to 0.
 * @author Sonja Hohlfeld
 */

AliTV.prototype.setTickDistance = function(distance) {
	if (distance === "") {
		throw "Sorry, you entered an empty value. Please try it again.";
	} else if (isNaN(distance)) {
		throw "Sorry, you entered not a number. Please try it again.";
	} else if (distance <= 0) {
		throw "Sorry, the entered value is too small. Please, insert one which is not less than 0.";
	} else {
		distance = Number(distance);
		this.conf.graphicalParameters.tickDistance = distance;
		this.triggerChange();
		return this.conf.graphicalParameters.tickDistance;
	}
};

/**
 * This function returns the current layout.
 * @returns {String} The current layout: linear or circular.
 * @author Sonja Hohlfeld
 */

AliTV.prototype.getLayout = function() {
	return this.conf.layout;
};

/**
 * This function should draw the equal layout according to the current layout.
 * @param {String} The current layout, this means circular or linear.
 * @author Sonja Hohlfeld
 */

AliTV.prototype.drawEqualLayout = function(layout) {
	if (layout === "linear") {
		this.drawLinear();
		return this.conf.layout;
	} else {
		this.drawCircular();
		return this.conf.layout;
	}
};

/**
 * This function returns the current width of the phylogenetic tree.
 * @returns {Number} The current tree width.
 * @author Sonja Hohlfeld
 */

AliTV.prototype.getTreeWidth = function() {
	return this.conf.graphicalParameters.treeWidth;
};

/**
 * This function replaces the old tree width with the new tree width in the config-object.
 * When the method gets a wrong value it throws an error message.
 * @param {Number} The function gets the width of a phylogenetic tree which can be set by the user.
 * @throws Will throw an error if the argument is empty.
 * @throws Will throw an error if the argument is not a number.
 * @throws Will throw an error if the argument is less than 0 or equal to 0.
 * @author Sonja Hohlfeld
 */

AliTV.prototype.setTreeWidth = function(treeWidth) {
	if (treeWidth === "") {
		throw "Sorry, you entered an empty value. Please try it again.";
	} else if (isNaN(treeWidth)) {
		throw "Sorry, you entered not a number. Please try it again.";
	} else if (treeWidth <= 0) {
		throw "Sorry, the entered value is too small. Please, insert one which is not less than 0.";
	} else {
		treeWidth = Number(treeWidth);
		this.conf.graphicalParameters.treeWidth = treeWidth;
		this.triggerChange();
		return this.conf.graphicalParameters.treeWidth;
	}
};

/**
 * This function calculates the appropriate outerRadius of the circular layout for the current svg dimensions.
 * @returns {Number} outerRadius - the outer radius in px
 * @author Markus Ankenbrand
 */
AliTV.prototype.getOuterRadius = function() {
	var outerRadius = 0.45 * Math.min(this.getCanvasHeight(), this.getCanvasWidth());
	return outerRadius;
};

/**
 * This function calculates the appropriate genomeDistance of the linear layout for the current svg height.
 * @returns {Number} genomeDistance - the distance between genomes in the linear layout.
 * @author Sonja Hohlfeld
 */
AliTV.prototype.getGenomeDistance = function() {
	var genomeDistance = (this.getCanvasHeight() - this.getKaryoHeight()) / (this.filters.karyo.genome_order.length - 1);
	return Math.round(genomeDistance);
};

/**
 * This function returns the current frequency of tick labels.
 * @returns {Number} Returns the frequency of the tick labels.
 * @author Sonja Hohlfeld
 */
AliTV.prototype.getTickLabelFrequency = function() {
	var tickLabelFrequency = this.conf.graphicalParameters.tickLabelFrequency;
	return tickLabelFrequency;
};

/**
 * This function replaces the old frequency of tick labels with the new tick label frequency in the config-object.
 * @param tickLabelFrequency: the frequency of tick labels which is returned by getTickLabelFrequency.
 * @throws Will throw an error if the argument is empty.
 * @throws Will throw an error if the argument is not a number.
 * @throws Will throw an error if the argument is less than 0 or equal to 0.
 * @author Sonja Hohlfeld
 */
AliTV.prototype.setTickLabelFrequency = function(tickLabelFrequency) {
	if (tickLabelFrequency === "") {
		throw "Sorry, you entered an empty value. Please try it again.";
	} else if (isNaN(tickLabelFrequency)) {
		throw "Sorry, you entered not a number. Please try it again.";
	} else if (tickLabelFrequency <= 0) {
		throw "Sorry, the entered value is too small. Please, insert one which is not less than 0.";
	} else {
		tickLabelFrequency = Number(tickLabelFrequency);
		this.conf.graphicalParameters.tickLabelFrequency = tickLabelFrequency;
		this.triggerChange();
		return this.conf.graphicalParameters.tickLabelFrequency;
	}
};

/**
 * This function returns the specified property of the given supported feature.
 * @param {String} groupId - The group ID of the desired supported feature.
 * @param {String} property - The desired property of the feature (e.g. color, form, ...).
 * @throws Will throw an error if the feature groupId is not supported.
 * @throws Will throw an error if the property is undefined in the feature group.
 * @returns {String} The value of the property of the given supported feature.
 * @author Markus Ankenbrand
 */
AliTV.prototype.getFeatureProperty = function(groupId, property) {
	if (typeof this.conf.features.supportedFeatures[groupId] === 'undefined') {
		throw "Not a supported feature.";
	}
	if (typeof this.conf.features.supportedFeatures[groupId][property] === 'undefined') {
		throw "Not a supported property.";
	}
	var prop = this.conf.features.supportedFeatures[groupId][property];
	return prop;
};

/**
 * This function replaces the old color of the specified supported feature with the new color in the config-object.
 * @param {String} groupId - the supported feature groupId for which the color should be set.
 * @param {String} property - The desired property of the feature (e.g. color, form, ...).
 * @param value: the new value for the property of the supported feature.
 * @throws Will throw an error if the feature is not supported.
 * @throws Will throw an error if the argument is empty.
 * @author Markus Ankenbrand
 */
AliTV.prototype.setFeatureProperty = function(groupId, property, val) {
	if (typeof this.conf.features.supportedFeatures[groupId] === "undefined") {
		throw "Not a supported feature.";
	}
	if (val === "") {
		throw "Sorry, you entered an empty value. Please try it again.";
	}
	this.conf.features.supportedFeatures[groupId][property] = val;
	this.triggerChange();
	return this.conf.features.supportedFeatures[groupId][property];
};

/**
 * This function returns an array which contains the color of the first and the last genome. 
 * The colors are defined in the conf-object.
 * @returns {Array} The color of the first and the last genome.
 * @author Sonja Hohlfeld
 */
AliTV.prototype.getGenomeColor = function() {
	var color = [];
	color.push(this.conf.linear.startLineColor);
	color.push(this.conf.linear.endLineColor);
	return color;
};

/**
 * This function replaces the old colors of the start genome and the end genome with the new ones.
 * @param color: the array contains the startLineColor and the endLineColor which is returned by getGenomeColor.
 * @throws Will throw an error if the argument is empty.
 * @author Sonja Hohlfeld
 */
AliTV.prototype.setGenomeColor = function(color) {
	var newColor = [];
	if (color === "") {
		throw "Sorry, you entered an empty value. Please try it again.";
	} else {
		this.conf.linear.startLineColor = color[0];
		this.conf.linear.endLineColor = color[1];
		newColor.push(this.conf.linear.startLineColor);
		newColor.push(this.conf.linear.endLineColor);
		this.triggerChange();
		return newColor;
	}
};

/**
 * This function returns an array which contains the color of the minLinkIdentity and the maxLinkIdentity. 
 * The colors are defined in the conf-object.
 * @returns {Array} The color of the links with the minimal and maximal identity.
 * @author Sonja Hohlfeld
 */
AliTV.prototype.getLinkColor = function() {
	var color = [];
	color.push(this.conf.minLinkIdentityColor);
	color.push(this.conf.midLinkIdentityColor);
	color.push(this.conf.maxLinkIdentityColor);
	return color;
};

/**
 * This function replaces the old colors for the minimal and maximal link identity by the new ones.
 * @param color: the array contains the minLinkIdentityColor and the maxLinkIdentityColor which is returned by getLinkColor.
 * @throws Will throw an error if the argument is empty.
 * @author Sonja Hohlfeld
 */
AliTV.prototype.setLinkColor = function(color) {
	var newColor = [];
	if (color === "") {
		throw "Sorry, you entered an empty value. Please try it again.";
	} else {
		this.conf.minLinkIdentityColor = color[0];
		this.conf.midLinkIdentityColor = color[1];
		this.conf.maxLinkIdentityColor = color[2];
		newColor.push(this.conf.minLinkIdentityColor);
		newColor.push(this.conf.midLinkIdentityColor);
		newColor.push(this.conf.maxLinkIdentityColor);
		this.triggerChange();
		return newColor;
	}
};

/**
 * This method should call other filter functions in order to filter the visible chromosomes.
 * @returns visibleChromosomes: returns only chromosomes which are visible
 * @author Sonja Hohlfeld
 */
AliTV.prototype.filterChromosomes = function() {
	var visibleChromosomes = this.data.karyo.chromosomes;
	if (this.filters.showAllChromosomes === false) {
		visibleChromosomes = this.filterVisibleChromosomes(visibleChromosomes);
	} else {
		return visibleChromosomes;
	}
	if (this.filters.skipChromosomesWithoutVisibleLinks === true) {
		visibleChromosomes = this.filterChromosomeWithoutVisibleLinks(visibleChromosomes);
	}
	return visibleChromosomes;
};

/**
 *This method should filter all chromosome which are set visible in conf.filters.karyo.chromosomes[<chromosome>].visible
 * @param visibleChromosomes: the method gets all current visible chromosomes.
 * @returns filteredChromosomes: the method returns only chromosomes whose visibility is set true
 * @author Sonja Hohlfeld 
 */
AliTV.prototype.filterVisibleChromosomes = function(visibleChromosomes) {
	var that = this;
	var filteredChromosomes = {};
	$.each(visibleChromosomes, function(key, value) {
		if (that.filters.karyo.chromosomes[key].visible === true) {
			filteredChromosomes[key] = value;
		}
	});
	return filteredChromosomes;
};

/**
 * This method should filter all chromosome which have no visible links with the current configurations
 * @param visibleChromosomes: the method gets all current visible chromosomes.
 * @returns filteredChromosomes: the method returns only chromosomes which have visible links
 * @author Sonja Hohlfeld 
 */
AliTV.prototype.filterChromosomeWithoutVisibleLinks = function(visibleChromosomes) {
	var that = this;
	var filteredChromosomes = {};
	var filteredLinks = that.filterLinks(visibleChromosomes);
	$.each(visibleChromosomes, function(key, value) {
		var currentChromosome = key;
		var valueOfCurrentChromosome = value;
		$.each(filteredLinks, function(key, value) {
			if (that.data.features.link[value.source].karyo === currentChromosome && (currentChromosome in filteredChromosomes) === false || that.data.features.link[value.target].karyo === currentChromosome && (currentChromosome in filteredChromosomes) === false) {
				filteredChromosomes[currentChromosome] = valueOfCurrentChromosome;
			}
		});
	});
	return filteredChromosomes;
};

/**
 * This method is supposed to filter the order of chromosomes according to all visible chromosomes.
 * @param visibleChromosomes: gets all visible chromosomes
 * @return chromosomeOrder: returns the order of the visible chromosomes
 * @author Sonja Hohlfeld
 */
AliTV.prototype.filterChromosomeOrder = function(visibleChromosomes) {
	var orderOfVisibleChromosomes = [];
	var keysOfVisibleChromosomes = [];
	$.each(visibleChromosomes, function(key, value) {
		keysOfVisibleChromosomes.push(key);
	});
	$.each(this.filters.karyo.order, function(key, value) {
		if (keysOfVisibleChromosomes.indexOf(value) !== -1) {
			orderOfVisibleChromosomes.push(value);
		}
	});
	return orderOfVisibleChromosomes;
};

/**
 * This method should call functions in order to filter the links.
 * The nested link data structure with genome_ids as keys is returned as a flat structure with link_ids as keys.
 * The filteredLinks are also saved as an object property.
 * @param visibleChromosomes: gets the chromosomes which are visible in the current configurations.
 * @returns visibleLinks: return all links which are visible
 * @author Sonja Hohlfeld and Markus Ankenbrand
 */
AliTV.prototype.filterLinks = function(visibleChromosomes) {
	this.visibleLinks = this.filterLinksByAdjacency();
	this.visibleLinks = this.filterVisibleLinks(this.visibleLinks, visibleChromosomes);
	this.visibleLinks = this.filterLinksByIdentity(this.visibleLinks);
	this.visibleLinks = this.filterLinksByLength(this.visibleLinks);
	return this.visibleLinks;
};

/**
 * This method should filter the visible links according to visible chromosomes
 * @param visibleLinks: contains all currently visible links.
 * @param visibleChromosomes: contains the chromosomes, which are visible in the current configurations in order to filter all links, which have no target or source chromosome.
 * @return visibleLinks: returns only links which source or target are in visible chromosomes
 * @author Sonja Hohlfeld and Markus Ankenbrand
 */
AliTV.prototype.filterVisibleLinks = function(visibleLinks, visibleChromosomes) {
	var that = this;
	var filteredLinks = {};
	var listOfVisibleChromosomes = [];
	$.each(visibleChromosomes, function(key, value) {
		listOfVisibleChromosomes.push(key);
	});
	$.each(visibleLinks, function(key, value) {
		var targetKaryo = that.data.features.link[value.target].karyo;
		var sourceKaryo = that.data.features.link[value.source].karyo;
		if (listOfVisibleChromosomes.indexOf(targetKaryo) !== -1 && listOfVisibleChromosomes.indexOf(sourceKaryo) !== -1 && (value in filteredLinks) === false) {
			filteredLinks[key] = value;
		}
	});
	return filteredLinks;
};
/**
 * This method should filter links according to their identity.
 * @returns filteredLinks: return all links which are visible with the current configuration.
 * @param visibleLinks: gets all current visible links.
 * @author Sonja Hohlfeld
 */
AliTV.prototype.filterLinksByIdentity = function(visibleLinks) {
	var minIdentity = this.filters.links.minLinkIdentity;
	var maxIdentity = this.filters.links.maxLinkIdentity;
	var filteredLinks = {};
	$.each(visibleLinks, function(key, value) {
		var currentLink = value;
		if (currentLink.identity >= minIdentity && currentLink.identity <= maxIdentity) {
			filteredLinks[key] = currentLink;
		}
	});
	return filteredLinks;
};

/**
 * This method should filter links according to their length.
 * @returns filteredLinks: return all links which are visible with the current configuration.
 * @param visibleLinks: gets all current visible links.
 * @author Sonja Hohlfeld
 */
AliTV.prototype.filterLinksByLength = function(visibleLinks) {
	var minLength = this.filters.links.minLinkLength;
	var maxLength = this.filters.links.maxLinkLength;
	var that = this;
	var filteredLinks = {};
	$.each(visibleLinks, function(key, value) {
		var currentLink = value;
		var sourceFeature = currentLink.source;
		var targetFeature = currentLink.target;
		var lengthOfSourceFeature = Math.abs(that.data.features.link[sourceFeature].end - that.data.features.link[sourceFeature].start);
		var lengthOfTargetFeature = Math.abs(that.data.features.link[targetFeature].end - that.data.features.link[targetFeature].start);
		if (lengthOfSourceFeature >= minLength && lengthOfSourceFeature <= maxLength || lengthOfTargetFeature >= minLength && lengthOfTargetFeature <= maxLength) {
			filteredLinks[key] = currentLink;
		}
	});
	return filteredLinks;
};

/**
 * This method should filter links according to their adjacency (if the according option is set and the layout is linear).
 * The nested link data structure with genome_ids as keys is returned as a flat structure with link_ids as keys.
 * @return filteredLinks: returns only links which are between chromosomes of adjacent genomes (if needed) in a flat link object.
 * @author Sonja Hohlfeld and Markus Ankenbrand
 */
AliTV.prototype.filterLinksByAdjacency = function() {
	var that = this;
	var filteredLinks = {};
	if (this.filters.onlyShowAdjacentLinks === true && this.conf.layout === 'linear') {
		for (var i = 0; i < that.filters.karyo.genome_order.length - 1; i++) {
			var genome0 = that.filters.karyo.genome_order[i];
			var genome1 = that.filters.karyo.genome_order[i + 1];
			var links01 = ((typeof that.data.links[genome0] === 'undefined' || typeof that.data.links[genome0][genome1] === 'undefined') ? {} : that.data.links[genome0][genome1]);
			var links10 = ((typeof that.data.links[genome1] === 'undefined' || typeof that.data.links[genome1][genome0] === 'undefined') ? {} : that.data.links[genome1][genome0]);
			filteredLinks = $.extend(filteredLinks, links01);
			filteredLinks = $.extend(filteredLinks, links10);
		}
	} else {
		// combine all links into a single object
		$.each(that.data.links, function(key, value) {
			$.each(value, function(k, v) {
				if (key !== k || that.filters.showIntraGenomeLinks) {
					filteredLinks = $.extend(filteredLinks, v);
				}
			});
		});
	}
	return filteredLinks;
};

/**
 * This method is supposed to draw a phylogenetic tree next to the chromosomes.
 * In the default configuration the tree is not drawn, but the user can set drawTree equal true and this method wil be called.
 * @author {Sonja Hohlfeld}
 */
AliTV.prototype.drawPhylogeneticTree = function() {
	var that = this;
	var treeData;
	try {
		treeData = this.rotateTreeToGenomeOrder();
	} catch (err) {
		that.svgD3.append("g")
			.attr("class", "treeGroup")
			.append("text")
			.attr("class", "treeWarningLabel")
			.attr("x", that.conf.graphicalParameters.treeWidth / 2)
			.attr("y", that.conf.graphicalParameters.canvasHeight / 2)
			.text("WARNING: Genome order not concordant with tree")
			.attr("font-family", "sans-serif")
			.attr("font-size", "20px")
			.attr("fill", "#ff0000")
			.attr("transform", "rotate(-90, " + (that.conf.graphicalParameters.treeWidth / 2) + "," + (that.conf.graphicalParameters.canvasHeight / 2) + ")")
			.style("text-anchor", "middle");
		return;
	}
	// Create a tree "canvas"
	var genomeDistance = that.getGenomeDistance();

	//Initialize the tree size. Every node of the tree has its own "spacer", therefore it is important not only use the canvas height, but you need
	// the canveas height and the genome distance - the heigth of one karyo in order to draw the branches in the right position. So we have exactly 6 branches, but one is not in the drawing area.
	var tree = d3.layout.tree()
		.size([that.conf.graphicalParameters.canvasHeight + genomeDistance - that.conf.graphicalParameters.karyoHeight, that.conf.graphicalParameters.treeWidth])
		.separation(function() {
			return 1;
		});

	// Preparing the data for the tree layout, convert data into an array of nodes
	var nodes = tree.nodes(treeData);
	// Create an array with all the links
	var links = tree.links(nodes);

	//Now you want to draw every branch in the middle of a chromosome. Therefore you must move it the negative half of a chromosome height and negative the half of the genome distance in y direction.
	if (this.conf.tree.orientation === "left") {
		that.svgD3.append("g")
			.attr("class", "treeGroup")
			.attr("style", "fill:none;stroke:#000;stroke-width:2px;")
			.selectAll("path")
			.data(links)
			.enter()
			.append("path")
			.attr("class", "branch")
			.attr("d", function(d) {
				return "M" + d.source.y + "," + d.source.x + "H" + d.target.y + "V" + d.target.x;
			})
			.attr("transform", "translate(0, " + 0.5 * (that.conf.graphicalParameters.karyoHeight - genomeDistance) + ")");

	} else {
		that.svgD3.append("g")
			.attr("class", "treeGroup")
			.attr("style", "fill:none;stroke:#000;stroke-width:2px;")
			.attr("transform", "translate(" + that.conf.graphicalParameters.canvasWidth + ", 0)")
			.selectAll("path")
			.data(links)
			.enter()
			.append("path")
			.attr("class", "branch")
			.attr("d", function(d) {
				return "M" + (that.conf.graphicalParameters.treeWidth - d.source.y) + "," + d.source.x + "H" + (that.conf.graphicalParameters.treeWidth - d.target.y) + "V" + d.target.x;
			})
			.attr("transform", "translate(0, " + 0.5 * (that.conf.graphicalParameters.karyoHeight - genomeDistance) + ")");
	}

};

/**
 * This method should check if the user provides tree data.
 * @returns {Boolean} Returns true when tree data exists and false when there is no tree data.
 * @author Sonja Hohlfeld
 */
AliTV.prototype.hasTree = function() {
	if (typeof this.data.tree === "undefined" || $.isEmptyObject(this.data.tree) === true || this.data.tree === null) {
		return false;
	} else {
		return true;
	}
};


/**
 * Calculates coordinates for different shapes according to the different feature classes in order to draw in the linear layout.
 * This function operates on the linearKaryoCoords.
 * This function is primarily meant for internal usage, the user should not need to call this directly.
 * @author Sonja Hohlfeld
 * @param {Array} linearKaryoCoords: contains the coordinates for all chromosomes of the form: {karyo: 'karyo_name', x:0, y:0, width:10, height:10}.
 * @returns {Array} linearFeatureCoords: contains the coordinates for feature classes of the form: {id: "featureId", x:0, y:0, width: 45, height: 10}
 */
AliTV.prototype.getLinearFeatureCoords = function(linearKaryoCoords) {
	var that = this;
	var linearFeatureCoords = [];

	$.each(that.data.features, function(type, features) {
		// skip link features
		if (type === "link") {
			return true;
		}
		$.each(features, function(key, value) {
			var featureKaryo = value.karyo;
			var currentY;
			var currentWidth;
			var currentX;
			var currentFeature = {};
			var featureId = value.name;
			var start;
			var end;
			var splitFeature;
			var shift = (that.filters.karyo.chromosomes[featureKaryo].offset === undefined ? 0 : that.filters.karyo.chromosomes[featureKaryo].offset);
			$.each(linearKaryoCoords, function(key, value) {
				if (featureKaryo === value.karyo) {
					currentY = value.y;
					currentX = value.x;
					currentWidth = value.width;
				}
			});
			var featureStyle = ((typeof that.conf.features.supportedFeatures[type] !== 'undefined') ? that.conf.features.supportedFeatures[type] : that.conf.features.fallbackStyle);
			if (featureStyle.visible === false && that.conf.features.showAllFeatures === false) {
				// skip if the feature type should not be visible
				return true;
			}

			var featureScale = d3.scale.linear()
				.domain([0, that.data.karyo.chromosomes[featureKaryo].length])
				.range([currentX, currentX + currentWidth]);

			if (featureStyle.form === "rect") {
				currentFeature = {
					"id": featureId,
					"type": type,
					"karyo": value.karyo
				};

				if (value.strand === undefined) {
					currentFeature.y = currentY;
					currentFeature.height = that.conf.graphicalParameters.karyoHeight;
				} else if (value.strand === "+") {
					currentFeature.y = currentY;
					currentFeature.height = 1 / 5 * that.conf.graphicalParameters.karyoHeight;
				} else if (value.strand === "-") {
					currentFeature.y = currentY + 4 / 5 * that.conf.graphicalParameters.karyoHeight;
					currentFeature.height = 1 / 5 * that.conf.graphicalParameters.karyoHeight;
				}


				currentFeature.width = featureScale(Math.max(value.end, value.start)) - featureScale(Math.min(value.start, value.end));
				currentFeature.x = featureScale((Math.min(value.start, value.end) + shift + that.data.karyo.chromosomes[featureKaryo].length) % that.data.karyo.chromosomes[featureKaryo].length);

				start = featureScale((Math.min(value.end, value.start) + shift + that.data.karyo.chromosomes[featureKaryo].length) % that.data.karyo.chromosomes[featureKaryo].length);
				end = featureScale((Math.max(value.end, value.start) + shift + that.data.karyo.chromosomes[featureKaryo].length) % that.data.karyo.chromosomes[featureKaryo].length);

				if (that.filters.karyo.chromosomes[featureKaryo].reverse === false && (start > end)) {
					currentFeature.width = featureScale(that.data.karyo.chromosomes[featureKaryo].length) - start;
					linearFeatureCoords.push(currentFeature);

					splitFeature = {
						"x": featureScale(0),
						"width": end - featureScale(0),
						"id": featureId,
						"type": type,
						"karyo": value.karyo,
						"height": that.conf.graphicalParameters.karyoHeight,
						"y": currentY
					};
					linearFeatureCoords.push(splitFeature);
				} else if (that.filters.karyo.chromosomes[featureKaryo].reverse === true && (start < end)) {
					currentFeature.x = end;
					currentFeature.width = featureScale(0) - end;
					linearFeatureCoords.push(currentFeature);

					splitFeature = {
						"x": featureScale(that.data.karyo.chromosomes[featureKaryo].length),
						"width": start,
						"id": featureId,
						"type": type,
						"karyo": value.karyo,
						"height": that.conf.graphicalParameters.karyoHeight,
						"y": currentY
					};
					linearFeatureCoords.push(splitFeature);
				} else {
					linearFeatureCoords.push(currentFeature);
				}
			} else if (featureStyle.form === "arrow") {
				currentFeature = {
					"type": type,
					"id": value.name,
					"karyo": value.karyo
				};
				currentFeature.path = [];
				if (value.strand === undefined) {
					start = featureScale((Math.abs(value.start) + shift + that.data.karyo.chromosomes[featureKaryo].length) % that.data.karyo.chromosomes[featureKaryo].length) === featureScale(0) ? featureScale(that.data.karyo.chromosomes[featureKaryo].length) : featureScale((Math.abs(value.start) + shift + that.data.karyo.chromosomes[featureKaryo].length) % that.data.karyo.chromosomes[featureKaryo].length);
					end = featureScale((Math.abs(value.end) + shift + that.data.karyo.chromosomes[featureKaryo].length) % that.data.karyo.chromosomes[featureKaryo].length) === featureScale(0) ? featureScale(that.data.karyo.chromosomes[featureKaryo].length) : featureScale((Math.abs(value.end) + shift + that.data.karyo.chromosomes[featureKaryo].length) % that.data.karyo.chromosomes[featureKaryo].length);

					if (value.start < value.end && start > end && that.filters.karyo.chromosomes[featureKaryo].reverse === false) {
						currentFeature.path.push({
							x: start,
							y: currentY + 1 / 5 * that.conf.graphicalParameters.karyoHeight
						}, {
							x: start + (featureScale(that.data.karyo.chromosomes[featureKaryo].length) - start),
							y: currentY + 1 / 5 * that.conf.graphicalParameters.karyoHeight
						}, {
							x: start + (featureScale(that.data.karyo.chromosomes[featureKaryo].length) - start),
							y: currentY + that.conf.graphicalParameters.karyoHeight - 1 / 5 * that.conf.graphicalParameters.karyoHeight
						}, {
							x: start,
							y: currentY + that.conf.graphicalParameters.karyoHeight - 1 / 5 * that.conf.graphicalParameters.karyoHeight
						});

						splitFeature = {
							"type": type,
							"id": value.name,
							"karyo": value.karyo
						};
						splitFeature.path = [];
						splitFeature.path.push({
							x: featureScale(0),
							y: currentY + 1 / 5 * that.conf.graphicalParameters.karyoHeight
						}, {
							x: featureScale(0) + 5 / 6 * (end - featureScale(0)),
							y: currentY + 1 / 5 * that.conf.graphicalParameters.karyoHeight
						}, {
							x: featureScale(0) + 5 / 6 * (end - featureScale(0)),
							y: currentY
						}, {
							x: end,
							y: currentY + 1 / 2 * that.conf.graphicalParameters.karyoHeight
						}, {
							x: featureScale(0) + 5 / 6 * (end - featureScale(0)),
							y: currentY + that.conf.graphicalParameters.karyoHeight
						}, {
							x: featureScale(0) + 5 / 6 * (end - featureScale(0)),
							y: currentY + that.conf.graphicalParameters.karyoHeight - 1 / 5 * that.conf.graphicalParameters.karyoHeight
						}, {
							x: featureScale(0),
							y: currentY + that.conf.graphicalParameters.karyoHeight - 1 / 5 * that.conf.graphicalParameters.karyoHeight
						});
						linearFeatureCoords.push(splitFeature);
					} else if (value.start > value.end && start < end && that.filters.karyo.chromosomes[featureKaryo].reverse === false) {
						currentFeature.path.push({
							x: featureScale(0),
							y: currentY + 1 / 5 * that.conf.graphicalParameters.karyoHeight
						}, {
							x: start,
							y: currentY + 1 / 5 * that.conf.graphicalParameters.karyoHeight
						}, {
							x: start,
							y: currentY + that.conf.graphicalParameters.karyoHeight - 1 / 5 * that.conf.graphicalParameters.karyoHeight
						}, {
							x: featureScale(0),
							y: currentY + that.conf.graphicalParameters.karyoHeight - 1 / 5 * that.conf.graphicalParameters.karyoHeight
						});

						splitFeature = {
							"type": type,
							"id": value.name,
							"karyo": value.karyo
						};
						splitFeature.path = [];
						splitFeature.path.push({
							x: featureScale(that.data.karyo.chromosomes[featureKaryo].length),
							y: currentY + 1 / 5 * that.conf.graphicalParameters.karyoHeight
						}, {
							x: featureScale(that.data.karyo.chromosomes[featureKaryo].length) - 5 / 6 * (featureScale(that.data.karyo.chromosomes[featureKaryo].length) - end),
							y: currentY + 1 / 5 * that.conf.graphicalParameters.karyoHeight
						}, {
							x: featureScale(that.data.karyo.chromosomes[featureKaryo].length) - 5 / 6 * (featureScale(that.data.karyo.chromosomes[featureKaryo].length) - end),
							y: currentY
						}, {
							x: featureScale(that.data.karyo.chromosomes[featureKaryo].length) - (featureScale(that.data.karyo.chromosomes[featureKaryo].length) - end),
							y: currentY + 1 / 2 * that.conf.graphicalParameters.karyoHeight
						}, {
							x: featureScale(that.data.karyo.chromosomes[featureKaryo].length) - 5 / 6 * (featureScale(that.data.karyo.chromosomes[featureKaryo].length) - end),
							y: currentY + that.conf.graphicalParameters.karyoHeight
						}, {
							x: featureScale(that.data.karyo.chromosomes[featureKaryo].length) - 5 / 6 * (featureScale(that.data.karyo.chromosomes[featureKaryo].length) - end),
							y: currentY + that.conf.graphicalParameters.karyoHeight - 1 / 5 * that.conf.graphicalParameters.karyoHeight
						}, {
							x: featureScale(that.data.karyo.chromosomes[featureKaryo].length),
							y: currentY + that.conf.graphicalParameters.karyoHeight - 1 / 5 * that.conf.graphicalParameters.karyoHeight
						});
						linearFeatureCoords.push(splitFeature);
					} else if (value.start < value.end && start < end && that.filters.karyo.chromosomes[featureKaryo].reverse === true) {
						currentFeature.path.push({
							x: featureScale(that.data.karyo.chromosomes[featureKaryo].length),
							y: currentY + 1 / 5 * that.conf.graphicalParameters.karyoHeight
						}, {
							x: featureScale(that.data.karyo.chromosomes[featureKaryo].length) + start,
							y: currentY + 1 / 5 * that.conf.graphicalParameters.karyoHeight
						}, {
							x: featureScale(that.data.karyo.chromosomes[featureKaryo].length) + start,
							y: currentY + that.conf.graphicalParameters.karyoHeight - 1 / 5 * that.conf.graphicalParameters.karyoHeight
						}, {
							x: featureScale(that.data.karyo.chromosomes[featureKaryo].length),
							y: currentY + that.conf.graphicalParameters.karyoHeight - 1 / 5 * that.conf.graphicalParameters.karyoHeight
						});

						splitFeature = {
							"type": type,
							"id": value.name,
							"karyo": value.karyo
						};
						splitFeature.path = [];
						splitFeature.path.push({
							x: featureScale(0),
							y: currentY + 1 / 5 * that.conf.graphicalParameters.karyoHeight
						}, {
							x: featureScale(0) - 5 / 6 * (featureScale(0) - end),
							y: currentY + 1 / 5 * that.conf.graphicalParameters.karyoHeight
						}, {
							x: featureScale(0) - 5 / 6 * (featureScale(0) - end),
							y: currentY
						}, {
							x: featureScale(0) - (featureScale(0) - end),
							y: currentY + 1 / 2 * that.conf.graphicalParameters.karyoHeight
						}, {
							x: featureScale(0) - 5 / 6 * (featureScale(0) - end),
							y: currentY + that.conf.graphicalParameters.karyoHeight
						}, {
							x: featureScale(0) - 5 / 6 * (featureScale(0) - end),
							y: currentY + that.conf.graphicalParameters.karyoHeight - 1 / 5 * that.conf.graphicalParameters.karyoHeight
						}, {
							x: featureScale(0),
							y: currentY + that.conf.graphicalParameters.karyoHeight - 1 / 5 * that.conf.graphicalParameters.karyoHeight
						});
						linearFeatureCoords.push(splitFeature);
					} else if (value.start > value.end && start > end && that.filters.karyo.chromosomes[featureKaryo].reverse === true) {
						currentFeature.path.push({
							x: featureScale(0),
							y: currentY + 1 / 5 * that.conf.graphicalParameters.karyoHeight
						}, {
							x: start,
							y: currentY + 1 / 5 * that.conf.graphicalParameters.karyoHeight
						}, {
							x: start,
							y: currentY + that.conf.graphicalParameters.karyoHeight - 1 / 5 * that.conf.graphicalParameters.karyoHeight
						}, {
							x: featureScale(0),
							y: currentY + that.conf.graphicalParameters.karyoHeight - 1 / 5 * that.conf.graphicalParameters.karyoHeight
						});

						splitFeature = {
							"type": type,
							"id": value.name,
							"karyo": value.karyo
						};
						splitFeature.path = [];
						splitFeature.path.push({
							x: featureScale(that.data.karyo.chromosomes[featureKaryo].length),
							y: currentY + 1 / 5 * that.conf.graphicalParameters.karyoHeight
						}, {
							x: featureScale(that.data.karyo.chromosomes[featureKaryo].length) - 5 / 6 * (featureScale(that.data.karyo.chromosomes[featureKaryo].length) - end),
							y: currentY + 1 / 5 * that.conf.graphicalParameters.karyoHeight
						}, {
							x: featureScale(that.data.karyo.chromosomes[featureKaryo].length) - 5 / 6 * (featureScale(that.data.karyo.chromosomes[featureKaryo].length) - end),
							y: currentY
						}, {
							x: featureScale(that.data.karyo.chromosomes[featureKaryo].length) - (featureScale(that.data.karyo.chromosomes[featureKaryo].length) - end),
							y: currentY + 1 / 2 * that.conf.graphicalParameters.karyoHeight
						}, {
							x: featureScale(that.data.karyo.chromosomes[featureKaryo].length) - 5 / 6 * (featureScale(that.data.karyo.chromosomes[featureKaryo].length) - end),
							y: currentY + that.conf.graphicalParameters.karyoHeight
						}, {
							x: featureScale(that.data.karyo.chromosomes[featureKaryo].length) - 5 / 6 * (featureScale(that.data.karyo.chromosomes[featureKaryo].length) - end),
							y: currentY + that.conf.graphicalParameters.karyoHeight - 1 / 5 * that.conf.graphicalParameters.karyoHeight
						}, {
							x: featureScale(that.data.karyo.chromosomes[featureKaryo].length),
							y: currentY + that.conf.graphicalParameters.karyoHeight - 1 / 5 * that.conf.graphicalParameters.karyoHeight
						});
						linearFeatureCoords.push(splitFeature);
					} else {
						currentFeature.path.push({
							x: start,
							y: currentY + 1 / 5 * that.conf.graphicalParameters.karyoHeight
						}, {
							x: start + 5 / 6 * (featureScale(value.end) - featureScale(value.start)),
							y: currentY + 1 / 5 * that.conf.graphicalParameters.karyoHeight
						}, {
							x: start + 5 / 6 * (featureScale(value.end) - featureScale(value.start)),
							y: currentY
						}, {
							x: end,
							y: currentY + 1 / 2 * that.conf.graphicalParameters.karyoHeight
						}, {
							x: start + 5 / 6 * (featureScale(value.end) - featureScale(value.start)),
							y: currentY + that.conf.graphicalParameters.karyoHeight
						}, {
							x: start + 5 / 6 * (featureScale(value.end) - featureScale(value.start)),
							y: currentY + that.conf.graphicalParameters.karyoHeight - 1 / 5 * that.conf.graphicalParameters.karyoHeight
						}, {
							x: start,
							y: currentY + that.conf.graphicalParameters.karyoHeight - 1 / 5 * that.conf.graphicalParameters.karyoHeight
						});
					}
				} else if (value.strand === "+") {
					currentFeature.path.push({
						x: currentX + (Math.abs(value.start) * currentWidth) / that.data.karyo.chromosomes[featureKaryo].length,
						y: currentY + 1 / 25 * that.conf.graphicalParameters.karyoHeight
					}, {
						x: currentX + (Math.abs(value.start) * currentWidth) / that.data.karyo.chromosomes[featureKaryo].length + 5 / 6 * ((value.end - value.start) * currentWidth) / that.data.karyo.chromosomes[featureKaryo].length,
						y: currentY + 1 / 25 * that.conf.graphicalParameters.karyoHeight
					}, {
						x: currentX + (Math.abs(value.start) * currentWidth) / that.data.karyo.chromosomes[featureKaryo].length + 5 / 6 * ((value.end - value.start) * currentWidth) / that.data.karyo.chromosomes[featureKaryo].length,
						y: currentY
					}, {
						x: currentX + (Math.abs(value.start) * currentWidth) / that.data.karyo.chromosomes[featureKaryo].length + ((value.end - value.start) * currentWidth) / that.data.karyo.chromosomes[featureKaryo].length,
						y: currentY + 1 / 10 * that.conf.graphicalParameters.karyoHeight
					}, {
						x: currentX + (Math.abs(value.start) * currentWidth) / that.data.karyo.chromosomes[featureKaryo].length + 5 / 6 * ((value.end - value.start) * currentWidth) / that.data.karyo.chromosomes[featureKaryo].length,
						y: currentY + 1 / 5 * that.conf.graphicalParameters.karyoHeight
					}, {
						x: currentX + (Math.abs(value.start) * currentWidth) / that.data.karyo.chromosomes[featureKaryo].length + 5 / 6 * ((value.end - value.start) * currentWidth) / that.data.karyo.chromosomes[featureKaryo].length,
						y: currentY + 1 / 5 * that.conf.graphicalParameters.karyoHeight - 1 / 25 * that.conf.graphicalParameters.karyoHeight
					}, {
						x: currentX + (Math.abs(value.start) * currentWidth) / that.data.karyo.chromosomes[featureKaryo].length,
						y: currentY + 1 / 5 * that.conf.graphicalParameters.karyoHeight - 1 / 25 * that.conf.graphicalParameters.karyoHeight
					});
				} else if (value.strand === "-") {
					currentFeature.path.push({
						x: currentX + (Math.abs(value.start) * currentWidth) / that.data.karyo.chromosomes[featureKaryo].length,
						y: currentY + (4 / 5 + 1 / 25) * that.conf.graphicalParameters.karyoHeight
					}, {
						x: currentX + (Math.abs(value.start) * currentWidth) / that.data.karyo.chromosomes[featureKaryo].length + 5 / 6 * ((value.end - value.start) * currentWidth) / that.data.karyo.chromosomes[featureKaryo].length,
						y: currentY + (4 / 5 + 1 / 25) * that.conf.graphicalParameters.karyoHeight
					}, {
						x: currentX + (Math.abs(value.start) * currentWidth) / that.data.karyo.chromosomes[featureKaryo].length + 5 / 6 * ((value.end - value.start) * currentWidth) / that.data.karyo.chromosomes[featureKaryo].length,
						y: currentY + 4 / 5 * that.conf.graphicalParameters.karyoHeight
					}, {
						x: currentX + (Math.abs(value.start) * currentWidth) / that.data.karyo.chromosomes[featureKaryo].length + ((value.end - value.start) * currentWidth) / that.data.karyo.chromosomes[featureKaryo].length,
						y: currentY + (4 / 5 + 1 / 10) * that.conf.graphicalParameters.karyoHeight
					}, {
						x: currentX + (Math.abs(value.start) * currentWidth) / that.data.karyo.chromosomes[featureKaryo].length + 5 / 6 * ((value.end - value.start) * currentWidth) / that.data.karyo.chromosomes[featureKaryo].length,
						y: currentY + that.conf.graphicalParameters.karyoHeight
					}, {
						x: currentX + (Math.abs(value.start) * currentWidth) / that.data.karyo.chromosomes[featureKaryo].length + 5 / 6 * ((value.end - value.start) * currentWidth) / that.data.karyo.chromosomes[featureKaryo].length,
						y: currentY + 24 / 25 * that.conf.graphicalParameters.karyoHeight
					}, {
						x: currentX + (Math.abs(value.start) * currentWidth) / that.data.karyo.chromosomes[featureKaryo].length,
						y: currentY + 24 / 25 * that.conf.graphicalParameters.karyoHeight
					});
				}
				linearFeatureCoords.push(currentFeature);
			}
		});
	});
	return linearFeatureCoords;
};

/**
 * This function draws the features on the karyos in the linear layout, color them according to the configuration.
 * @author Sonja Hohlfeld
 * @param {Array} The array containing the coordinates of the features as returned by getLinearFeatureCoords()
 */
AliTV.prototype.drawLinearFeatures = function(linearFeatureCoords) {
	var that = this;

	that.getAlignmentRegion().selectAll(".featureGroup").remove();
	var shapes = that.getAlignmentRegion().append("g")
		.attr("class", "featureGroup")
		.selectAll("path")
		.data(linearFeatureCoords)
		.enter();

	var lines = textures.lines()
		.background(function(d) {
			if (d.type in that.conf.features.supportedFeatures === true) {
				return that.conf.features.supportedFeatures[d.type].color;
			} else {
				return that.conf.features.fallbackStyle.color;
			}
		})
		.thicker();

	shapes.call(lines);


	var woven = textures.paths()
		.d("woven")
		.background("orange")
		.thicker();

	shapes.call(woven);

	var counter = 0;
	shapes.append("rect")
		.filter(function(d) {
			if (d.type in that.conf.features.supportedFeatures === true) {
				return that.conf.features.supportedFeatures[d.type].form === "rect" && (that.conf.features.supportedFeatures[d.type].visible === true || that.conf.features.showAllFeatures === true);
			} else {
				return that.conf.features.fallbackStyle.form === "rect";
			}
		})
		.attr("class", "feature")
		.attr("id", function(d, i) {
			var position = that.data.features[d.type].indexOf(that.data.features[d.type][counter]);
			if (counter < that.data.features[d.type].length - 1) {
				counter++;
			} else {
				counter = 0;
			}
			return position + "_" + d.type;
		})
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
		.style("fill", function(d) {
			var pattern;
			var color;
			if (d.type in that.conf.features.supportedFeatures === true) {
				pattern = that.conf.features.supportedFeatures[d.type].pattern;
				if (pattern === "lines") {
					return lines.url();
				} else if (pattern === "woven") {
					return woven.url();
				} else {
					color = that.conf.features.supportedFeatures[d.type].color;
					return color;
				}
			} else {
				pattern = that.conf.features.fallbackStyle.pattern;
				if (pattern === "lines") {
					return lines.url();
				} else if (pattern === "woven") {
					return woven.url();
				} else {
					color = that.conf.features.fallbackStyle.color;
					return color;
				}
			}
		})
		.style("display", function(d) {
			var featureId = $(this).attr("id");
			if (featureId in that.filters.features.invisibleFeatures) {
				return "none";
			}
		});


	var lineFunction = d3.svg.line()
		.x(function(d) {
			return d.x;
		})
		.y(function(d) {
			return d.y;
		})
		.interpolate("linear");

	shapes.append("path")
		.filter(function(d) {
			if (d.type in that.conf.features.supportedFeatures === true) {
				return that.conf.features.supportedFeatures[d.type].form === "arrow" && (that.conf.features.supportedFeatures[d.type].visible === true || that.conf.features.showAllFeatures === true);
			}
		})
		.each(function(d, i) {
			d3.select(this)
				.attr("class", "feature")
				.attr("id", function(d) {
					var position = that.data.features[d.type].indexOf(that.data.features[d.type][counter]);
					if (counter < that.data.features[d.type].length - 1) {
						counter++;
					} else {
						counter = 0;
					}
					return position + "_" + d.type;
				})
				.attr("d", lineFunction(d.path))
				.attr("fill", function(d) {
					var pattern;
					var color;
					pattern = that.conf.features.supportedFeatures[d.type].pattern;
					if (pattern === "lines") {
						return lines.url();
					} else if (pattern === "woven") {
						return woven.url();
					} else {
						color = that.conf.features.supportedFeatures[d.type].color;
						return color;
					}
				})
				.style("display", function(d) {
					var featureId = $(this).attr("id");
					if (featureId in that.filters.features.invisibleFeatures) {
						return "none";
					}
				});
		});
};

/**
 * This method is supposed to calculate the coordinates for genome labels.
 * This is called if the configuration of addGenomeLables is true.
 * @returns genomeLabelCoords: returns an array which contains the coords for the genome labels.
 * @author Sonja Hohlfeld
 */
AliTV.prototype.getGenomeLabelCoords = function() {
	var that = this;
	var linearGenomeLabelCoords = [];
	var genomeDistance = that.getGenomeDistance();
	$.each(that.filters.karyo.genome_order, function(key, value) {
		var genome = {
			name: value,
			x: 1 / 2 * that.conf.graphicalParameters.genomeLabelWidth,
			y: key * genomeDistance + 0.9 * that.conf.graphicalParameters.karyoHeight
		};
		linearGenomeLabelCoords.push(genome);
	});
	return linearGenomeLabelCoords;
};

/**
 * This function is supposed to draw the text labels for genomes.
 * @param linearGenomeLabelCoords: gets the coords of the genome labels whcih is returned by getGenomeLabelCoords.
 * @author Sonja Hohlfeld
 */
AliTV.prototype.drawLinearGenomeLabels = function(linearGenomeLabelCoords) {
	var that = this;
	this.svgD3.selectAll(".genomeLabelGroup").remove();
	that.svgD3.append("g")
		.attr("class", "genomeLabelGroup")
		.selectAll("path")
		.data(linearGenomeLabelCoords)
		.enter()
		.append("text")
		.attr("class", "genomeLabel")
		.attr("x", function(d) {
			return d.x;
		})
		.attr("y", function(d) {
			return d.y;
		})
		.text(function(d) {
			return d.name;
		})
		.attr("font-family", "sans-serif")
		.attr("font-size", that.getGenomeLabelSize() + "px")
		.attr("fill", that.getGenomeLabelColor())
		.style("text-anchor", "middle");

	if (that.conf.tree.drawTree === true && that.conf.tree.orientation === "left") {
		that.svgD3.selectAll(".genomeLabelGroup").attr("transform", "translate(" + that.conf.graphicalParameters.treeWidth + ", 0)");
	}
};

/**
 * This function returns the width of the svg.
 * @returns {Number} The width of svg.
 * @author Markus Ankenbrand
 */

AliTV.prototype.getSvgWidth = function() {
	return Number(this.svg.attr("width"));
};

/**
 * This function sets the width of the svg - it does not effect the size of the canvas, tree, etc.
 * When the method gets a wrong value it throws an error message.
 * @param {Number} width - the desired width of the svg set by the user.
 * @throws Will throw an error if the argument is empty.
 * @throws Will throw an error if the argument is not a number.
 * @throws Will throw an error if the argument is less than 0 or equal to 0.
 * @author Markus Ankenbrand
 */

AliTV.prototype.setSvgWidth = function(width) {
	if (width === "") {
		throw "Sorry, you entered an empty value. Please try it again.";
	} else if (isNaN(width)) {
		throw "Sorry, you entered not a number. Please try it again.";
	} else if (width <= 0) {
		throw "Sorry, the entered value is too small. Please, insert one which is not less than 0.";
	} else {
		width = Number(width);
		if (this.conf.offset.isSet === true) {
			this.svg.attr("width", width + this.conf.graphicalParameters.buttonWidth);
		} else {
			this.svg.attr("width", width);
		}
		this.triggerChange();
	}
};

/**
 * This function returns the height of the svg.
 * @returns {Number} The height of svg.
 * @author Markus Ankenbrand
 */

AliTV.prototype.getSvgHeight = function() {
	return Number(this.svg.attr("height"));
};


/**
 * This function sets the height of the svg - it does not effect the size of the canvas, tree, etc.
 * When the method gets a wrong value it throws an error message.
 * @param {Number} height - the desired height of the svg set by the user.
 * @throws Will throw an error if the argument is empty.
 * @throws Will throw an error if the argument is not a number.
 * @throws Will throw an error if the argument is less than 0 or equal to 0.
 * @author Markus Ankenbrand
 */

AliTV.prototype.setSvgHeight = function(height) {
	if (height === "") {
		throw "Sorry, you entered an empty value. Please try it again.";
	} else if (isNaN(height)) {
		throw "Sorry, you entered not a number. Please try it again.";
	} else if (height <= 0) {
		throw "Sorry, the entered value is too small. Please, insert one which is not less than 0.";
	} else {
		height = Number(height);
		this.svg.attr("height", height);
		this.triggerChange();
	}
};

/**
 * This function returns the content of the svg as a text string.
 * @returns {String} The content of the svg.
 * @author Markus Ankenbrand
 */

AliTV.prototype.getSvgAsText = function() {
	var svgText = this.svg[0].outerHTML;
	svgText = svgText.replace(/&quot;/g, "");
	return svgText;
};

/**
 * This function returns the content of the AliTV object as a single object containing data, filters and conf.
 * @returns {Object} The content of the AliTV object.
 * @author Markus Ankenbrand
 */

AliTV.prototype.getJSON = function() {
	return {
		data: this.data,
		conf: this.conf,
		filters: this.filters
	};
};

/**
 * This is a convenience function to set data, filters and conf of the AliTV object with a single call.
 * @param {Object} json - Object containing any of data, filters and conf.
 * @author Markus Ankenbrand
 */

AliTV.prototype.setJSON = function(json) {
	if (typeof json.data !== 'undefined') {
		this.setData(json.data);
	}
	if (typeof json.filters !== 'undefined') {
		this.setFilters(json.filters);
	}
	if (typeof json.conf !== 'undefined') {
		this.setConf(json.conf);
	}
	this.triggerChange();
};

/**
 * This function returns the color of the genomeLabels. 
 * The color is defined in the conf-object.
 * @returns The color of the genome labels.
 * @author Sonja Hohlfeld
 */
AliTV.prototype.getGenomeLabelColor = function() {
	this.getJSON();
	return this.conf.labels.genome.color;
};

/**
 * This function set a new color for the genome labels.
 * @param color: the current color of genome labels which is returned by getGenomeLabelColor.
 * @throws Will throw an error if the argument is empty.
 * @author Sonja Hohlfeld
 */
AliTV.prototype.setGenomeLabelColor = function(color) {
	if (color === "") {
		throw "Sorry, you entered an empty value. Please try it again.";
	} else {
		this.conf.labels.genome.color = color;
		this.triggerChange();
		return this.conf.labels.genome.color;
	}
};

/**
 * This function returns the size of the genomeLabels. 
 * The size is defined in the conf-object.
 * @returns The size of the genome labels.
 * @author Sonja Hohlfeld
 */
AliTV.prototype.getGenomeLabelSize = function() {
	return this.conf.labels.genome.size;
};

/**
 * This function set a new size for the genome labels.
 * @param size: the current size of genome labels which is returned by getGenomeLabelSize.
 * @param {Number} The function gets the size of genome labels which can be set by the user.
 * @throws Will throw an error if the argument is empty.
 * @throws Will throw an error if the argument is not a number.
 * @throws Will throw an error if the argument is less than 0 or equal to 0.
 * @author Sonja Hohlfeld
 */
AliTV.prototype.setGenomeLabelSize = function(size) {
	if (size === "") {
		throw "Sorry, you entered an empty value. Please try it again.";
	} else if (isNaN(size)) {
		throw "Sorry, you entered not a number. Please try it again.";
	} else if (size <= 0) {
		throw "Sorry, the entered value is too small. Please, insert one which is not less than 0.";
	} else {
		size = Number(size);
		this.conf.labels.genome.size = size;
		this.triggerChange();
		return this.conf.labels.genome.size;
	}
};

/**
 * This function returns the color of the tick Labels. 
 * The color is defined in the conf-object.
 * @returns The color of the tick labels.
 * @author Sonja Hohlfeld
 */
AliTV.prototype.getTickLabelColor = function() {
	return this.conf.labels.ticks.color;
};

/**
 * This function set a new color for the tick labels.
 * @param color: the current color of tick labels which is returned by getTickLabelColor.
 * @throws Will throw an error if the argument is empty.
 * @author Sonja Hohlfeld
 */
AliTV.prototype.setTickLabelColor = function(color) {
	if (color === "") {
		throw "Sorry, you entered an empty value. Please try it again.";
	} else {
		this.conf.labels.ticks.color = color;
		this.triggerChange();
		return this.conf.labels.ticks.color;
	}
};

/**
 * This function returns the size of the tick Labels. 
 * The size is defined in the conf-object.
 * @returns The size of the tick labels.
 * @author Sonja Hohlfeld
 */
AliTV.prototype.getTickLabelSize = function() {
	return this.conf.labels.ticks.size;
};

/**
 * This function set a new size for the tick labels.
 * @param size: the current size of tick labels which is returned by getTickLabelSize.
 * @param {Number} The function gets the size of tick labels which can be set by the user.
 * @throws Will throw an error if the argument is empty.
 * @throws Will throw an error if the argument is not a number.
 * @throws Will throw an error if the argument is less than 0 or equal to 0.
 * @author Sonja Hohlfeld
 */
AliTV.prototype.setTickLabelSize = function(size) {
	if (size === "") {
		throw "Sorry, you entered an empty value. Please try it again.";
	} else if (isNaN(size)) {
		throw "Sorry, you entered not a number. Please try it again.";
	} else if (size <= 0) {
		throw "Sorry, the entered value is too small. Please, insert one which is not less than 0.";
	} else {
		size = Number(size);
		this.conf.labels.ticks.size = size;
		this.triggerChange();
		return this.conf.labels.ticks.size;
	}
};

/**
 * This function gets the id of a selected link, hides it and pushes it to ali.filters.links.selectedLinks.
 * @param selectedLinkID: gets the id of the selected link
 * @returns ali.filters.links.invisibleLinks: returns the links which are invisible in the current settings of ali.filters.links.invisibleLinks.
 * @author Sonja Hohlfeld
 */
AliTV.prototype.setLinkInvisible = function(selectedLinkID) {
	$("#" + selectedLinkID).hide();
	var selectedLink = this.visibleLinks[selectedLinkID];
	this.filters.links.invisibleLinks[selectedLinkID] = selectedLink;
	this.triggerChange();
	return this.filters.links.invisibleLinks;
};

/**
 * This functions gets the number of all links which are in ali.filters.links.invisibleLinks
 * @returns invisibleLinkSize: the number of all Links which are invisible.
 * @author Sonja Hohlfeld
 */
AliTV.prototype.getInvisibleLinks = function() {
	var keylist = [];
	$.each(this.filters.links.invisibleLinks, function(key, value) {
		keylist.push(key);
	});
	var invisibleLinkSize = keylist.length;
	return invisibleLinkSize;
};

/**
 * This function is supposed to get the ID of a selected link, which is hidden and should be restored.
 * The function show the hidden link and delete it from the invisibleLinks-object in ali.filters.links.invisibleLinks
 * @param selectedLinkID: the ID of the links which should be restored.
 * @returns ali.filters.links.hiddenLinks: the current links which are set invisible.
 * @author Sonja Hohlfeld
 */
AliTV.prototype.showInvisibleLink = function(selectedLinkID) {
	$("#" + selectedLinkID).show();
	delete this.filters.links.invisibleLinks[selectedLinkID];
	this.triggerChange();
	return this.filters.links.invisibleLinks;
};

/**
 * This function is supposed to return the value of the longest chromosome.
 * @return maxLinkLength: the value of the longest chromosome in bp.
 * @author Sonja Hohlfeld 
 */
AliTV.prototype.getMaxChromosomeLength = function() {
	var length = [];
	$.each(this.data.karyo.chromosomes, function(key, value) {
		length.push(value.length);
	});
	var maxLength = Math.max.apply(Math, length);
	return maxLength;
};

/**
 * This function is supposed to clear the complete drawing area by removing all children from the svg.
 * @author Sonja Hohlfeld
 */
AliTV.prototype.clearAli = function() {
	this.svgD3.selectAll(".treeGroup").remove();
	this.svgD3.selectAll(".featureGroup").remove();
	this.svgD3.selectAll(".genomeLabelGroup").remove();
	this.svgD3.selectAll(".tickLabelGroup").remove();
	this.svgD3.selectAll(".tickGroup").remove();
	this.svgD3.selectAll(".karyoGroup").remove();
	this.svgD3.selectAll(".linkGroup").remove();
};

/**
 * This function gets a selected feature ID and pushes it to ali.filters.Features.invisibleFeatures.
 * The function marks all features, which are set invisible.
 * @param featureID: gets the ID of the selected feature.
 * @param group: gets the group of the selected feature for example invertedRepeat.
 * @param karyo: gets the chromsome which belongs to the selected feature.
 * @returns ali.filters.features.invisibleFeatures: returns the features which are invisible in the current settings.
 * @author Sonja Hohlfeld
 */

AliTV.prototype.setFeatureInvisible = function(feature) {
	$("#" + feature).hide();
	var split = feature.split("_");
	var id = split[0];
	var group = split[1];
	this.filters.features.invisibleFeatures[feature] = this.data.features[group][id];
	this.triggerChange();
	return this.filters.features.invisibleFeatures;
};

/**
 * This functions gets the number of all features which are in ali.filters.features.invisibleFeatures
 * @returns invisibleFeatureSize: the number of all features which are invisible.
 * @author Sonja Hohlfeld
 */
AliTV.prototype.getInvisibleFeatures = function() {
	var keylist = [];
	$.each(this.filters.features.invisibleFeatures, function(key, value) {
		keylist.push(key);
	});
	var invisibleFeatureSize = keylist.length;
	return invisibleFeatureSize;
};

/**
 * This function is supposed to get the ID of a selected feature, which is hidden and should be restored.
 * The function show the hidden feature and delete it from the invisibleFeatures-object in ali.filters.features.invisibleFeatures
 * @param selectedFeatureId: the Id of the features which should be restored.
 * @returns ali.filters.features.invisibleFeatures: the current features which are set invisible.
 * @author Sonja Hohlfeld
 */
AliTV.prototype.showInvisibleFeature = function(selectedFeatureId) {
	$("#" + selectedFeatureId).show();
	delete this.filters.features.invisibleFeatures[selectedFeatureId];
	this.triggerChange();
	return this.filters.features.invisibleFeatures;
};

/**
 * This function returns the internal alignmentRegion g element as d3 selection. It is created if it does not exist.
 * It also creates and adds the clipPath if it does not exist.
 * @returns {Object} internal alignmentRegion g as d3 selection.
 * @author Markus Ankenbrand
 */
AliTV.prototype.getAlignmentRegion = function() {
	var alignmentRegion = this.svgD3.selectAll(".alignmentRegion");
	if (alignmentRegion.size() < 1) {
		this.svgD3.selectAll("#clip").remove();
		this.svgD3.append("svg:clipPath")
			.attr("id", "clip")
			.append("svg:rect")
			.attr("id", "clip-rect")
			.attr("x", "0")
			.attr("y", "0")
			.attr("width", this.conf.graphicalParameters.canvasWidth)
			.attr("height", this.conf.graphicalParameters.canvasHeight);
		this.svgD3.append("g")
			.attr("class", "alignmentRegion")
			.attr("clip-path", "url(#clip)");
		//.attr("width", 500) //this.conf.graphicalParameters.canvasWidth)
		//.attr("height", this.conf.graphicalParameters.canvasHeight);
		alignmentRegion = this.svgD3.selectAll(".alignmentRegion");
	}
	return alignmentRegion;
};

/**
 * This function returns the internal legendRegion g element as d3 selection. It is created if it does not exist.
 * @returns {Object} internal legendRegion g as d3 selection.
 * @author Markus Ankenbrand
 */
AliTV.prototype.getLegendRegion = function() {
	var legendRegion = this.svgD3.selectAll(".legendRegion");
	if (legendRegion.size() < 1) {
		this.svgD3.append("g")
			.attr("class", "legendRegion");
		legendRegion = this.svgD3.selectAll(".legendRegion");
	}
	return legendRegion;
};

/**
 * This function returns linkCoords with those removed that have their ends outside the visible region.
 * Optionally also links with only one end in the visible region can be removed.
 * @param {Array}   - linearLinkCoords as returned by getLinearLinkCoords
 * @param {boolean} - if true also links with one end inside the visual region will be removed
 * @returns {Array} - filtered linearLinkCoords
 * @author Markus Ankenbrand
 */
AliTV.prototype.removeLinksOutsideVisibleRegion = function(linkCoords, removeHalfVisible) {
	var filteredCoords = [];
	var canvasWidth = this.getCanvasWidth();
	var tooMuch = (removeHalfVisible ? 1 : 2);
	$.each(linkCoords, function(key, value) {
		var out = 0;
		if (Math.max(value.source0.x, value.source1.x) <= 0 || Math.min(value.source0.x, value.source1.x) >= canvasWidth) {
			out++;
		}
		if (Math.max(value.target0.x, value.target1.x) <= 0 || Math.min(value.target0.x, value.target1.x) >= canvasWidth) {
			out++;
		}
		if (out < tooMuch) {
			filteredCoords.push(value);
		}
	});
	return filteredCoords;
};

/**
 * This function updates the genome_region filter according to the specified region on the svg
 * @param {Object}  - rect an object with properties x, y, width and height (relative to the svg)
 * @author Markus Ankenbrand
 */
AliTV.prototype.updateGenomeRegionBySvgRect = function(rect) {
	var that = this;
	var distance = that.getGenomeDistance();
	var karyoHeight = that.getKaryoHeight();
	if (typeof that.filters.karyo.genome_region === 'undefined') {
		that.filters.karyo.genome_region = {};
	}
	for (var i = 0; i < that.filters.karyo.genome_order.length; i++) {
		var genome = that.filters.karyo.genome_order[i];
		if (typeof that.filters.karyo.genome_region[genome] === 'undefined') {
			that.filters.karyo.genome_region[genome] = {};
		}
		var yPosCurrentGenome = i * distance + karyoHeight / 2;
		if (yPosCurrentGenome >= rect.y && yPosCurrentGenome <= rect.y + rect.height) {
			var region = that.filters.karyo.genome_region[genome];
			var start = (region.start || 0);
			var end = (region.end || that.cache.linear.maxGenomeSize + start);
			var translateX = d3.transform(that.svgD3.select('.alignmentRegion').attr("transform")).translate[0];
			var transformToGenomeScale = d3.scale.linear().domain([0 + translateX, that.getCanvasWidth() + translateX]).range([start, end]);
			region.start = transformToGenomeScale(rect.x);
			region.end = transformToGenomeScale(rect.x + rect.width);
		}
	}
	this.triggerChange();
};

/**
 * This function resets the genome_region filter to default for the specified genome
 * @param {String}  - genome_id
 * @author Markus Ankenbrand
 */
AliTV.prototype.resetGenomeRegion = function(genome_id) {
	if (typeof this.filters.karyo.genome_region !== "undefined") {
		this.filters.karyo.genome_region[genome_id] = {};
	}
	this.triggerChange();
};

/**	
 * This function is supposed to change the visibility of a selected chromosome.
 * The function gets the name of a chromosome and set his visibility in filters.karyo.chromosomes equal false or true.
 * @param {String} chromosomeName: the name of the selected chromosome.
 * @author Sonja Hohlfeld
 */
AliTV.prototype.changeChromosomeVisibility = function(chromosomeId) {
	this.filters.karyo.chromosomes[chromosomeId].visible = !this.filters.karyo.chromosomes[chromosomeId].visible;
	this.triggerChange();
	return this.filters.karyo.chromosomes;
};

/**
 * This functions gets the number of all chromosomes which are set invisible.
 * @returns invisibleChromosomeSize: the number of all chromosomes which are invisible.
 * @author Sonja Hohlfeld
 */
AliTV.prototype.getInvisibleChromosomes = function() {
	var invisibleChromosomeSize = 0;
	$.each(this.filters.karyo.chromosomes, function(key, value) {
		if (value.visible === false) {
			invisibleChromosomeSize = invisibleChromosomeSize + 1;
		}
	});
	return invisibleChromosomeSize;
};

/**
 * This function is supposed to swap a genome with its adjacent genomes according to the order of all genomes which is defined in ali.filters.karyo.genome_order.
 * @param {String} name: the name of the selected genome.
 * @param {Number} value: +1 or -1. The number defines if the genome is moved one genome up or down.
 * @author Sonja Hohlfeld
 */
AliTV.prototype.changeGenomeOrder = function(name, value) {
	var that = this;
	var genomePosition = that.filters.karyo.genome_order.indexOf(name);
	var tmp;
	if ((genomePosition !== 0 || (genomePosition === 0 && value === -1)) && (genomePosition !== (that.filters.karyo.genome_order.length - 1) || (genomePosition === (that.filters.karyo.genome_order.length - 1) && value === +1))) {
		var adjacentGenomePosition = genomePosition - value;
		tmp = that.filters.karyo.genome_order[genomePosition];
		that.filters.karyo.genome_order[genomePosition] = that.filters.karyo.genome_order[adjacentGenomePosition];
		that.filters.karyo.genome_order[adjacentGenomePosition] = tmp;
	} else if (genomePosition === 0 && value === +1) {
		tmp = that.filters.karyo.genome_order[genomePosition];
		that.filters.karyo.genome_order[genomePosition] = that.filters.karyo.genome_order[(that.filters.karyo.genome_order.length - 1)];
		that.filters.karyo.genome_order[(that.filters.karyo.genome_order.length - 1)] = tmp;
	} else {
		tmp = that.filters.karyo.genome_order[genomePosition];
		that.filters.karyo.genome_order[genomePosition] = that.filters.karyo.genome_order[0];
		that.filters.karyo.genome_order[0] = tmp;
	}
	this.triggerChange();
	return that.filters.karyo.genome_order;
};

/**
 * This function is supposed to change the orientation of an assigned chromosome from reverse equal false or reverse equal true.
 * @param {String} chromosome: the selected chromosome which orientation should be changed.
 * @retrun {String} ali.filters: return the current settings for the filters.
 * @author {Sonja Hohlfeld}
 */
AliTV.prototype.changeChromosomeOrientation = function(chromosome) {
	this.filters.karyo.chromosomes[chromosome].reverse = !this.filters.karyo.chromosomes[chromosome].reverse;
	this.triggerChange();
	return this.filters.karyo.chromosomes[chromosome].reverse;
};

/**
 * This function is supposed to change the order of chromosomes according to their genome.
 * If a genome has only one chromosomes it is not possible to change the order.
 * @param id: The name of the selected chromosome.
 * @param value: +1 (moves right) and -1 (moves left).
 * @author: Sonja Hohlfeld
 */
AliTV.prototype.changeChromosomeOrder = function(id, value) {
	var that = this;
	var chromosomePosition = that.filters.karyo.order.indexOf(id);
	var order = that.filters.karyo.order;
	var i;

	if (value === +1) {
		i = (chromosomePosition + 1) % order.length;
		while (that.data.karyo.chromosomes[order[i]].genome_id !== that.data.karyo.chromosomes[id].genome_id) {
			i = (i + 1) % order.length;
		}
	} else if (value === -1) {
		i = chromosomePosition - 1;
		i = (i === -1 ? order.length - 1 : i);
		while (that.data.karyo.chromosomes[order[i]].genome_id !== that.data.karyo.chromosomes[id].genome_id) {
			i = (i === 0 ? order.length - 1 : (i - 1));
		}
	}
	var tmp = order[i];
	order[i] = order[chromosomePosition];
	order[chromosomePosition] = tmp;
	this.triggerChange();
	return that.filters.karyo.order;
};

/**
 * This method is supposed to calculate coords for arrows which should be drawn next to selected chromosomes.
 * @param karyo: the key of the selected chromosome
 * @author Sonja Hohlfeld
 */
AliTV.prototype.getOffsetButtonCoords = function(karyo) {
	var coords = [];
	var button = {
		"id": karyo,
		"path1": [],
		"path2": []
	};
	button.path1.push({
		"x": 0,
		"y": this.filters.karyo.genome_order.indexOf(this.data.karyo.chromosomes[karyo].genome_id) * this.getGenomeDistance() + 1 / 2 * this.conf.graphicalParameters.karyoHeight
	}, {
		"x": 1 / 3 * this.conf.graphicalParameters.buttonWidth,
		"y": this.filters.karyo.genome_order.indexOf(this.data.karyo.chromosomes[karyo].genome_id) * this.getGenomeDistance()
	}, {
		"x": 1 / 3 * this.conf.graphicalParameters.buttonWidth,
		"y": this.filters.karyo.genome_order.indexOf(this.data.karyo.chromosomes[karyo].genome_id) * this.getGenomeDistance() + this.conf.graphicalParameters.karyoHeight
	});

	button.path2.push({
		"x": this.conf.graphicalParameters.buttonWidth,
		"y": this.filters.karyo.genome_order.indexOf(this.data.karyo.chromosomes[karyo].genome_id) * this.getGenomeDistance() + 1 / 2 * this.conf.graphicalParameters.karyoHeight
	}, {
		"x": 2 / 3 * this.conf.graphicalParameters.buttonWidth,
		"y": this.filters.karyo.genome_order.indexOf(this.data.karyo.chromosomes[karyo].genome_id) * this.getGenomeDistance() + this.conf.graphicalParameters.karyoHeight
	}, {
		"x": 2 / 3 * this.conf.graphicalParameters.buttonWidth,
		"y": this.filters.karyo.genome_order.indexOf(this.data.karyo.chromosomes[karyo].genome_id) * this.getGenomeDistance()
	});

	coords.push(button);
	return coords;
};

/**
 * This method is supposed the buttons next to the chromosomes in order to make them shiftable.
 * @param buttonCoords: the coords of the buttons which are returned by getOffsetButtonGroup
 * @author: Sonja Hohlfeld
 */
AliTV.prototype.drawOffsetButtonGroup = function(buttonCoords) {
	var that = this;
	var data = buttonCoords;

	var buttons = that.svgD3.append("g")
		.attr("class", "buttonGroup")
		.attr("transform", "translate(" + that.conf.graphicalParameters.canvasWidth + ", 0)")
		.selectAll("path")
		.data(data)
		.enter();

	var lineFunction = d3.svg.line()
		.x(function(d) {
			return d.x;
		})
		.y(function(d) {
			return d.y;
		})
		.interpolate("linear");

	buttons.append("path")
		.each(function(d, i) {
			d3.select(this)
				.attr("class", "button")
				.attr("id", function(d) {
					return "button-" + d.id;
				})
				.attr("orientation", "left")
				.attr("d", lineFunction(d.path1))
				.attr("fill", function(d) {
					return that.colorKaryoByGenomeId(that.filters.karyo.genome_order.indexOf(that.data.karyo.chromosomes[d.id].genome_id));
				})
				.on("mouseover", function() {
					d3.select(this)
						.attr("fill", "black");
				})
				.on("mouseout", function() {
					d3.select(this)
						.attr("fill", function(d) {
							return that.colorKaryoByGenomeId(that.filters.karyo.genome_order.indexOf(that.data.karyo.chromosomes[d.id].genome_id));
						});
				})
				.on("click", function(d) {
					var offset = that.filters.karyo.chromosomes[d.id].offset === undefined ? 0 : that.filters.karyo.chromosomes[d.id].offset;
					that.filters.karyo.chromosomes[d.id].offset = offset - that.conf.offset.distance;
					that.drawLinear();
				});
		});

	buttons.append("path")
		.each(function(d, i) {
			d3.select(this)
				.attr("class", "button")
				.attr("id", function(d) {
					return "button-" + d.id;
				})
				.attr("orientation", "right")
				.attr("d", lineFunction(d.path2))
				.attr("fill", function(d) {
					return that.colorKaryoByGenomeId(that.filters.karyo.genome_order.indexOf(that.data.karyo.chromosomes[d.id].genome_id));
				})
				.on("mouseover", function() {
					d3.select(this)
						.attr("fill", "black");
				})
				.on("mouseout", function() {
					d3.select(this)
						.attr("fill", function(d) {
							return that.colorKaryoByGenomeId(that.filters.karyo.genome_order.indexOf(that.data.karyo.chromosomes[d.id].genome_id));
						});
				})
				.on("click", function(d) {
					var offset = that.filters.karyo.chromosomes[d.id].offset === undefined ? 0 : that.filters.karyo.chromosomes[d.id].offset;
					that.filters.karyo.chromosomes[d.id].offset = offset + that.conf.offset.distance;
					that.drawLinear();
				});
		});

	if (that.conf.labels.genome.showGenomeLabels === true && that.conf.tree.drawTree === true) {
		that.svgD3.selectAll(".buttonGroup").attr("transform", "translate(" + (that.conf.graphicalParameters.canvasWidth + that.conf.graphicalParameters.genomeLabelWidth + that.conf.graphicalParameters.treeWidth) + ", 0)");
	}
};

/**
 * This function returns the offset for shifting chromosomes in bp.
 * @returns {Number} The offset in bp.
 * @author Sonja Hohlfeld
 */

AliTV.prototype.getOffsetDistance = function() {
	var json = this.getJSON();
	return json.conf.offset.distance;
};

/**
 * This function replaces the old distance for shifting chromosomes with the new distance in the config-object.
 * When the method gets a wrong value it throws an error message.
 * @param {Number} The function gets the distance for shifting chromosomes which can be set by the user.
 * @throws Will throw an error if the argument is empty.
 * @throws Will throw an error if the argument is not a number.
 * @author Sonja Hohlfeld
 */

AliTV.prototype.setOffset = function(offset, karyoId) {
	if (offset === "") {
		throw "Sorry, you entered an empty value. Please try it again.";
	} else if (isNaN(offset)) {
		throw "Sorry, you entered not a number. Please try it again.";
	} else {
		this.filters.karyo.chromosomes[karyoId].offset = offset;
		return this.filters.karyo.chromosomes[karyoId].offset;
	}
};

/**	
 * This function is supposed to return an array of supported features
 * @returns {Array} supportedFeatures
 * @author: Sonja Hohlfeld and Markus Ankenbrand
 */
AliTV.prototype.getSupportedFeatures = function() {
	return Object.keys(this.conf.features.supportedFeatures);
};

/**
 * This function is supposed to register callback function which are called upon data change
 * @param {function} callback - callback to be called upon data change
 * @author: Sonja Hohlfeld and Markus Ankenbrand
 */
AliTV.prototype.onDataChange = function(callback) {
	if (typeof callback !== "function") {
		throw "Not a function.";
	}
	this.onChangeCallbacks.push(callback);
};

/**
 * This function is supposed to call all registered callback functions
 * @author: Sonja Hohlfeld and Markus Ankenbrand
 */
AliTV.prototype.triggerChange = function() {
	if (this.inTransaction) {
		return;
	}
	$.each(this.onChangeCallbacks, function(key, value) {
		value();
	});
};

/**
 * This function is supposed to start a transaction and prevent changes from being triggered during that time
 * @author: Markus Ankenbrand
 */
AliTV.prototype.startTransaction = function() {
	this.inTransaction = true;
};

/**
 * This function is supposed to end a transaction, call triggerChange once and allow for new changes to trigger directly.
 * @author: Markus Ankenbrand
 */
AliTV.prototype.endTransaction = function() {
	this.inTransaction = false;
	this.triggerChange();
};

/**
 * This function is supposed to get the parameters for adding a new feature group in conf.features.supportedFeatures.
 * @param group: the name of the new feature group
 * @param form: the form for the group which is used by drawFeatures
 * @param color: the color for the new group
 * @returns {ali.conf.features.supportedFeatures} The current feature groups which are supported by AliTV
 * @author Sonja Hohlfeld
 */
AliTV.prototype.setNewFeature = function(group, form, color) {
	this.conf.features.supportedFeatures[group] = {
		form: form,
		color: color,
		visible: true,
		height: 30
	};
	this.triggerChange();
	return this.conf.features.supportedFeatures[group];
};

/**
 * This function is supposed to generate a tree from the supplied one that matches the current genome_order.
 * @returns {object} tree - the tree in data rotated to match the current genome_order.
 * @author Markus Ankenbrand
 */
AliTV.prototype.rotateTreeToGenomeOrder = function() {
	if (typeof this.data.tree === "undefined") {
		throw "No tree in data.";
	}

	// decorate the tree nodes with lists of their leaf nodes
	var getLeafs = function(subtree) {
		var names = [];
		for (var i = 0; i < subtree.length; i++) {
			if (typeof subtree[i].name !== "undefined") {
				names.push(subtree[i].name);
				subtree[i].leafs = [subtree[i].name];
			} else {
				var leafs = getLeafs(subtree[i].children);
				subtree[i].leafs = leafs;
				names = names.concat(leafs);
			}
		}
		return names;
	};

	var startTree = {};
	jQuery.extend(true, startTree, this.data.tree);
	startTree.leafs = getLeafs(startTree.children);
	// offset from the beginning of the array at which this subtree starts
	startTree.offset = 0;

	var genome_order = this.filters.karyo.genome_order;
	var rotateTree = function(subtree) {
		var j = subtree.offset;
		if (typeof subtree.children !== 'undefined') {
			var ordered_children = [];
			while (j < subtree.offset + subtree.leafs.length) {
				var fail = true;
				for (var i = 0; i < subtree.children.length; i++) {
					if (typeof subtree.children[i].leafs === 'undefined') {
						continue;
					}
					if (subtree.children[i].leafs.indexOf(genome_order[j]) !== -1) {
						fail = false;
						ordered_children.push(subtree.children[i]);
						subtree.children[i].offset = j;
						j += subtree.children[i].leafs.length;
						rotateTree(subtree.children[i]);
						subtree.children.splice(i, 1);
						break;
					}
				}
				if (fail) {
					throw "No rotation can lead to current genome_order.";
				}
			}
			subtree.children = ordered_children;
		}
		delete subtree.offset;
		delete subtree.leafs;
	};

	rotateTree(startTree);

	return startTree;
};

/**
 * This function is supposed to draw a legend for all the supportedFeatures.
 * @author Markus Ankenbrand
 */
AliTV.prototype.drawFeatureLegend = function() {
	var rect = [];
	var rectCol = [];
	var arrow = [];
	var arrowCol = [];
	var that = this;
	$.each(that.conf.features.supportedFeatures, function(key, val) {
		if (!val.visible) {
			return;
		}
		if (val.form === "rect") {
			rect.push(key);
			rectCol.push(val.color);
		} else if (val.form === "arrow") {
			arrow.push(key);
			arrowCol.push(val.color);
		}
	});

	this.getLegendRegion().selectAll(".legendRect").remove();
	this.getLegendRegion().selectAll(".legendArrow").remove();

	this.getLegendRegion().append("g")
		.attr("class", "legendRect")
		.attr("transform", "translate(0,20)");
	this.getLegendRegion().append("g")
		.attr("class", "legendArrow")
		.attr("transform", "translate(" + (this.getSvgWidth() / 3) + ",20)");

	var rectScale = d3.scale.ordinal()
		.domain(rect)
		.range(rectCol);
	var arrowScale = d3.scale.ordinal()
		.domain(arrow)
		.range(arrowCol);

	var arrowShape = [
		[0, 0],
		[10, 0],
		[10, -5],
		[18, 5],
		[10, 15],
		[10, 10],
		[0, 10]
	];
	var lineGenerator = d3.svg.line().x(function(d) {
		return d[0];
	}).y(function(d) {
		return d[1];
	});

	// this does not work in test cases - most likely the d3-legend library is not properly loaded
	// to avoid meaningless fails in tests skip this region if d3.legend is not defined
	if (typeof d3.legend === 'undefined') {
		return;
	}
	var legendArrow = d3.legend.color()
		//d3 symbol creates a path-string, for example
		//"M0,-8.059274488676564L9.306048591020996,
		//8.059274488676564 -9.306048591020996,8.059274488676564Z"
		.shape("path", lineGenerator(arrowShape)) //d3.svg.symbol().type("triangle-up").size(150)())
		.shapePadding(10)
		.scale(arrowScale);

	var legendRect = d3.legend.color()
		.shape("rect")
		.shapePadding(10)
		.scale(rectScale);

	this.getLegendRegion().select(".legendRect")
		.call(legendRect);
	this.getLegendRegion().select(".legendArrow")
		.call(legendArrow);
};


/**
 * This function is supposed to draw a legend for the color code of the link identity.
 * @author Markus Ankenbrand
 */
AliTV.prototype.drawLinkIdentityLegend = function() {
	var legendRegion = this.getLegendRegion();
	legendRegion.selectAll(".legendLinkIdentity").remove();
	legendRegion.selectAll("#linkIdentityGradient").remove();
	var legend = legendRegion.append("defs")
		.append("svg:linearGradient")
		.attr("id", "linkIdentityGradient")
		.attr("x1", "0%")
		.attr("y1", "100%")
		.attr("x2", "100%")
		.attr("y2", "100%")
		.attr("spreadMethod", "pad");
	var transformPercent = d3.scale.linear().range([0, 100]).domain([this.conf.minLinkIdentity, this.conf.maxLinkIdentity]);
	legend.append("stop").attr("offset", "0%").attr("stop-color", this.conf.minLinkIdentityColor).attr("stop-opacity", 1);
	legend.append("stop").attr("offset", transformPercent(this.conf.midLinkIdentity) + "%").attr("stop-color", this.conf.midLinkIdentityColor).attr("stop-opacity", 1);
	legend.append("stop").attr("offset", "100%").attr("stop-color", this.conf.maxLinkIdentityColor).attr("stop-opacity", 1);
	var legendLinkIdentityGroup = legendRegion.append("g")
		.attr("class", "legendLinkIdentity")
		.attr("transform", "translate(" + (this.getSvgWidth() * (2 / 3)) + ", 20)");
	legendLinkIdentityGroup.append("rect").attr("width", 300).attr("height", 20).style("fill", "url(#linkIdentityGradient)");
	var x = d3.scale.linear().range([0, 300]).domain([this.conf.minLinkIdentity, this.conf.maxLinkIdentity]);
	var xAxis = d3.svg.axis().scale(x).orient("bottom");
	legendLinkIdentityGroup.append("g").attr("class", "x axis").attr("style", "font: 10px sans-serif; fill: none; stroke: #000; shape-rendering: crispEdges;").attr("transform", "translate(0, 20)").call(xAxis).append("text").attr("y", 20).attr("x", 150).attr("dy", ".71em").style("text-anchor", "middle").text("Link Identity %");
};

/**
 * This method is supposed to return the current minimal identity of links.
 * @returns minimalLinkIdentity: the minimal identity of links.
 * @author Sonja Hohlfeld
 */
AliTV.prototype.getMinLinkIdentity = function() {
	var minimalLinkIdentity = this.filters.links.minLinkIdentity;
	return minimalLinkIdentity;
};

/**
 * This method is supposed to return the current maximal identity of links.
 * @returns maximalLinkIdentity: the maximal identity of links.
 * @author Sonja Hohlfeld
 */
AliTV.prototype.getMaxLinkIdentity = function() {
	var maximalLinkIdentity = this.filters.links.maxLinkIdentity;
	return maximalLinkIdentity;
};

/**
 * This method is supposed to return the current minimal length of links.
 * @returns minimalLinkLength: the minimal lenght of links.
 * @author Sonja Hohlfeld
 */
AliTV.prototype.getMinLinkLength = function() {
	var minimalLinkLength = this.filters.links.minLinkLength;
	return minimalLinkLength;
};

/**
 * This method is supposed to return the current maximal length of links.
 * @returns maximalLinkLength: the maximal length of links.
 * @author Sonja Hohlfeld
 */
AliTV.prototype.getMaxLinkLength = function() {
	var maximalLinkLength = this.filters.links.maxLinkLength;
	return maximalLinkLength;
};
