/* global d3: false */
/* global $: false */
/* global _: false */
/* global document: false */
/* global textures: false */
/* global circles: false */

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
	 * @property {Object}  filters                      				- the data dependent displaying information
	 * @property {Object}  filters.karyo                        		- the chromosome dependent displaying information
	 * @property {Boolean} filters.skipChromosomesWithoutVisibleLinks	- If a chromosome has no visible links, because they are filtered, it is possible to skip this chromosome.
	 * @property {Boolean} filters.showAllChromosomes					- Allows to show all chromosomes, even if when they are set not visible.
	 * @property {Boolean} filters.onlyShowAdjacentLinks				- Allows to show only adjacent links or all links.			
	 * @property {Array}   filters.karyo.order                  		- array of chromosome IDs in the desired order (circular layout)
	 * @property {Array}   filters.karyo.genome_order          			- array of genome IDs in the desired order (linear layout)
	 * @property {Object}  filters.karyo.chromosomes           			- the chromosome drawing details, karyo IDs as keys
	 * @property {Boolean} filters.karyo.chromosomes.reverse    		- should the sequence be treated as its reverse (complement)
	 * @property {Boolean} filters.karyo.chromosomes.visible    		- should the sequence be displayed at all
	 * @property {Number}  filters.links.minLinkIdentity	    		- The minimum identity of links which should be draw.
	 * @property {Number}  filters.links.maxLinkIdentity    			- The maximum identity of links which should be draw.
	 * @property {Number}  filters.links.minLinkLength  				- The minimum length of links, which should be draw in bp.
	 * @property {Number}  filters.links.maxLinkLength  				- The maximum length of links, which should be draw in bp.
	 */
	this.filters = {};
	/**
	 * property to store configuration options
	 * @property {Object}  linear                                  - The configuration options for the linear layout.
	 * @property {String}  linear.startLineColor                   - The start color of the color gradient for drawing karyos according to their genomeId
	 * @property {String}  linear.endLineColor                     - The end color of the color gradient. 
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
	 * @property {Boolean} features.gene.labeling				   - Defines if the label for a gene is shown or not.
	 * @property {Object}  features.invertedRepeat				   - Contains the configuration for inverted repeats.
	 * @property {String}  features.invertedRepeat.form			   - Defines the shape of an inverted repeat.
	 * @property {String}  features.invertedRepeat.color		   - Defines the color of an inverted repeat.
	 * @property {Number}  features.invertedRepeat.height		   - Defines the height of the drawn inverted repeat onto the chromosome.
	 * @property {Boolean} features.invertedRepeat.visible		   - Defines if an inverted repeat is drawn or not.
	 * @property {Boolean} features.invertedRepeat.labeling		   - Defines if the label for a inverted repeat is shown or not.
	 * @property {Object}  features.nStretch				   	   - Contains the configuration for n stretch.
	 * @property {String}  features.nStretch.form			   	   - Defines the shape of a n stretch.
	 * @property {String}  features.nStretch.color		   		   - Defines the color of a n stretch.
	 * @property {Number}  features.nStretch.height		   		   - Defines the height of the drawn n stretch onto the chromosome.
	 * @property {Boolean} features.nStretch.visible		   	   - Defines if an inverted n stretch is drawn or not.
	 * @property {Boolean} features.nStretch.labeling		       - Defines if the label for a n stretch is shown or not.
	 * @property {Object}  features.repeat				   		   - Contains the configuration for inverted repeats.
	 * @property {String}  features.repeat.form			   		   - Defines the shape of a repeat.
	 * @property {String}  features.repeat.color		   		   - Defines the color of a repeat.
	 * @property {Number}  features.repeat.height		   		   - Defines the height of the drawn repeat onto the chromosome.
	 * @property {Boolean} features.repeat.visible		   		   - Defines if an repeat is drawn or not.
	 * @property {Boolean} features.repeat.labeling		   		   - Defines if the label for a repeat is shown or not.
	 * @property {Object}  features.fallback				   	   - Contains the configuration for non-supported feature classes.
	 * @property {String}  features.fallback.form			   	   - Defines the shape of a non-supported feature groups.
	 * @property {String}  features.fallback.color		   		   - Defines the color of a non-supported feature group.
	 * @property {Number}  features.fallback.height		   		   - Defines the height of the drawn non-supported feature group onto the chromosome.
	 * @property {Boolean} features.fallback.visible		   	   - Defines if an non-supported feature group is drawn or not.
	 * @property {Boolean} features.fallback.labeling		   	   - Defines if the label for a non-supported feature group is shown or not.
	 * @property {Object}  labels								   - The configuration options for the text labels.
	 * @property {Boolean} labels.showAllLabels					   - With this option it is possible to set labels to genomes, chromosomes and all features.
	 * @property {Boolean} labels.ticks							   - Contains the configuration for the labeling of the chromosome scale.
	 * @property {Boolean} labels.ticks.showTicks				   - Defines if ticks are drawn.
	 * @property {Boolean} labels.ticks.showTickLabels			   - Defines if tick labels are drawn.
	 * @property {String}  labels.ticks.color					   - Defines the color of ticks and their labels.
	 * @property {Object}  labels.chromosomes					   - Contains the configurations for the chromosome labels.
	 * @property {Boolean} labels.chromosomes.showChromosomeLabels - Defines if chromosome labels are shown or not.
	 * @property {String}  labels.chromosomes.color				   - Defines the color of chromosome labels.
	 * @property {Number}  labels.chromosomes.size				   - Defines the size of chromosome labels.
	 * @property {Object}  labels.genome					   	   - Contains the configurations for the genome labels.
	 * @property {Boolean} labels.genome.showGenomeLabels 		   - Defines if genome labels are shown or not.
	 * @property {String}  labels.genome.color					   - Defines the color of genome labels.
	 * @property {Number}  labels.genome.size					   - Defines the size of genome labels.
	 * @property {Object}  labels.features					   	   - Contains the configurations for the feature labels.
	 * @property {Boolean} labels.features.showFeatureLabels 	   - Defines if feature labels are shown or not.
	 */
	this.conf = {
		linear: {
			startLineColor: "#49006a",
			endLineColor: "#1d91c0",
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
			genomeLabelWidth: 150
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
					visible: false,
					labeling: false
				},
				invertedRepeat: {
					form: "arrow",
					color: "#e7d3e2",
					height: 30,
					visible: false,
					pattern: "woven",
					labeling: false
				},
				nStretch: {
					form: "rect",
					color: "#000000",
					height: 30,
					visible: false,
					pattern: "lines",
					labeling: false
				},
				repeat: {
					form: "rect",
					color: "#56cd0f",
					height: 30,
					visible: false,
					pattern: "woven",
					labeling: false
				}
			},
			fallbackStyle: {
				form: "rect",
				color: "#787878",
				height: 30,
				visible: false,
				labeling: false
			}
		},
		labels: {
			ticks: {
				showTicks: true,
				showTickLabels: true,
				color: "#000000",
				size: 10
			},
			chromosome: {
				showChromosomeLabels: false,
				color: "#000000",
				size: 25
			},
			genome: {
				showGenomeLabels: true,
				color: "#000000",
				size: 25
			},
			features: {
				showFeatureLabels: false
			}
		}
	};
	// Initialize svg size
	this.setSvgWidth(this.getCanvasWidth());
	this.setSvgHeight(this.getCanvasHeight());
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
	var genomeDistance = this.getGenomeDistance();
	var that = this;
	var visibleChromosomes = that.filterChromosomes();
	var orderOfVisibleChromosomes = that.filterChromosomeOrder(visibleChromosomes);

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

	for (i = 0; i < orderOfVisibleChromosomes.length; i++) {
		var key = orderOfVisibleChromosomes[i];
		var value = visibleChromosomes[key];
		var coord = {
			'karyo': key,
			'y': genome_order.indexOf(value.genome_id) * genomeDistance,
			'height': conf.graphicalParameters.karyoHeight,
			'genome': value.genome_id
		};

		if (this.filters.karyo.chromosomes[key].reverse === false) {
			coord.width = (value.length / maxTotalSize) * conf.graphicalParameters.canvasWidth;
			coord.x = (current[genome_order.indexOf(value.genome_id)] / maxTotalSize) * conf.graphicalParameters.canvasWidth;
		} else {
			coord.x = (current[genome_order.indexOf(value.genome_id)] / maxTotalSize) * conf.graphicalParameters.canvasWidth + (value.length / maxTotalSize) * conf.graphicalParameters.canvasWidth;
			coord.width = (value.length / maxTotalSize) * conf.graphicalParameters.canvasWidth * (-1);
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
		link.source0.x = karyo1Coords.x + karyo1Coords.width * feature1.start / karyo1.length;
		link.source0.y = karyo1Coords.y + karyo1Coords.height + conf.graphicalParameters.linkKaryoDistance;
		link.source1.x = karyo1Coords.x + karyo1Coords.width * feature1.end / karyo1.length;
		link.source1.y = karyo1Coords.y + karyo1Coords.height + conf.graphicalParameters.linkKaryoDistance;

		link.target0.x = karyo2Coords.x + karyo2Coords.width * feature2.start / karyo2.length;
		link.target0.y = karyo2Coords.y - conf.graphicalParameters.linkKaryoDistance;
		link.target1.x = karyo2Coords.x + karyo2Coords.width * feature2.end / karyo2.length;
		link.target1.y = karyo2Coords.y - conf.graphicalParameters.linkKaryoDistance;

		linearLinkCoords.push(link);

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
		.attr("id", function(d){
			return that.data.karyo.chromosomes[d.karyo].genome_id;
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

	if (that.conf.labels.showAllLabels === true || that.conf.labels.genome.showGenomeLabels === true) {
		that.svgD3.selectAll(".karyoGroup").attr("transform", "translate(" + that.conf.graphicalParameters.genomeLabelWidth + ", 0)");
	}
	if (that.conf.tree.drawTree === true && that.conf.tree.orientation === "left") {
		that.svgD3.selectAll(".karyoGroup").attr("transform", "translate(" + that.conf.graphicalParameters.treeWidth + ", 0)");
	}
	if ((that.conf.labels.showAllLabels === true || that.conf.labels.genome.showGenomeLabels) && that.conf.tree.drawTree === true && that.conf.tree.orientation === "left") {
		that.svgD3.selectAll(".karyoGroup").attr("transform", "translate(" + (that.conf.graphicalParameters.treeWidth + that.conf.graphicalParameters.genomeLabelWidth) + ", 0)");
	}
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
		var scale = d3.scale.linear()
			.domain([0, that.data.karyo.chromosomes[value.karyo].length])
			.range([value.x, value.x + value.width]);

		var chromosomePosition = 0;
		for (var i = 0; chromosomePosition <= that.data.karyo.chromosomes[value.karyo].length; i++) {
			ticks.push(scale(chromosomePosition));
			chromosomePosition += that.conf.graphicalParameters.tickDistance;
			var coords = {};
			coords.id = value.karyo;
			coords.x1 = ticks[ticks.length - 1];
			coords.x2 = ticks[ticks.length - 1];

			if (i % that.conf.graphicalParameters.tickLabelFrequency === 0 && (that.conf.labels.ticks.showTickLabels === true || that.conf.labels.showAllLabels === true)) {
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
		.style("stroke", that.getTickLabelColor());

	if (that.conf.tree.drawTree === true && that.conf.tree.orientation === "left") {
		that.svgD3.selectAll(".tickGroup").attr("transform", "translate(" + that.conf.graphicalParameters.treeWidth + ", 0)");
	}
	if (that.conf.labels.showAllLabels === true || that.conf.labels.genome.showGenomeLabels === true) {
		that.svgD3.selectAll(".tickGroup").attr("transform", "translate(" + that.conf.graphicalParameters.genomeLabelWidth + ", 0)");
	}
	if ((that.conf.labels.showAllLabels === true || that.conf.labels.genome.showGenomeLabels === true) && that.conf.tree.drawTree === true && that.conf.tree.orientation === "left") {
		that.svgD3.selectAll(".tickGroup").attr("transform", "translate(" + (that.conf.graphicalParameters.treeWidth + that.conf.graphicalParameters.genomeLabelWidth) + ", 0)");
	}
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

	var labels = that.svgD3.append("g")
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

	if (that.conf.tree.drawTree === true && that.conf.tree.orientation === "left") {
		that.svgD3.selectAll(".tickLabelGroup").attr("transform", "translate(" + that.conf.graphicalParameters.treeWidth + ", 0)");
	}
	if (that.conf.labels.showAllLabels === true || that.conf.labels.genome.showGenomeLabels === true) {
		that.svgD3.selectAll(".tickLabelGroup").attr("transform", "translate(" + that.conf.graphicalParameters.genomeLabelWidth + ", 0)");
	}
	if ((that.conf.labels.showAllLabels === true || that.conf.labels.genome.showGenomeLabels === true) && that.conf.tree.drawTree === true && that.conf.tree.orientation === "left") {
		that.svgD3.selectAll(".tickLabelGroup").attr("transform", "translate(" + (that.conf.graphicalParameters.treeWidth + that.conf.graphicalParameters.genomeLabelWidth) + ", 0)");
	}
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

	this.svgD3.selectAll(".linkGroup").remove();
	this.svgD3.append("g")
		.attr("class", "linkGroup")
		.selectAll("path")
		.data(linearLinkCoords)
		.enter()
		.append("path")
		.attr("class", "link")
		.attr("id", function(d){
			return d.linkID;
		})
		.attr("d", coordsToPath)
		.style("fill", function(d) {
			return that.colorLinksByIdentity(that.visibleLinks[d.linkID].identity);
		});

	if (that.conf.tree.drawTree === true && that.conf.tree.orientation === "left") {
		that.svgD3.selectAll(".linkGroup").attr("transform", "translate(" + that.conf.graphicalParameters.treeWidth + ", 0)");
	}
	if (that.conf.labels.showAllLabels === true || that.conf.labels.genome.showGenomeLabels === true) {
		that.svgD3.selectAll(".linkGroup").attr("transform", "translate(" + that.conf.graphicalParameters.genomeLabelWidth + ", 0)");
	}
	if ((that.conf.labels.showAllLabels === true || that.conf.labels.genome.showGenomeLabels === true) && that.conf.tree.drawTree === true && that.conf.tree.orientation === "left") {
		that.svgD3.selectAll(".linkGroup").attr("transform", "translate(" + (that.conf.graphicalParameters.treeWidth + that.conf.graphicalParameters.genomeLabelWidth) + ", 0)");
	}
};


/**
 * This function draws the data in the linear layout.
 * It operates on the data of the object and therefore needs no parameters.
 * It draws directly on the svg and therefore has no return value.
 * @author Markus Ankenbrand <markus.ankenbrand@uni-wuerzburg.de>
 */
AliTV.prototype.drawLinear = function() {
	this.svgD3.selectAll(".treeGroup").remove();
	this.svgD3.selectAll(".chromosomeLabelGroup").remove();
	this.svgD3.selectAll(".featureLabelGroup").remove();
	this.svgD3.selectAll(".genomeLabelGroup").remove();
	this.svgD3.selectAll(".tickLabelGroup").remove();

	var karyoCoords = this.getLinearKaryoCoords();
	var linearTickCoords = this.getLinearTickCoords(karyoCoords);
	this.drawLinearTicks(linearTickCoords);
	this.drawLinearKaryo(karyoCoords);
	var linkCoords = this.getLinearLinkCoords(karyoCoords);
	this.drawLinearLinks(linkCoords);

	if (this.conf.labels.ticks.showTickLabels === true) {
		this.drawLinearTickLabels(linearTickCoords);
	}


	if (this.conf.labels.genome.showGenomeLabels === true) {
		var linearGenomeLabelCoords = this.getGenomeLabelCoords();
		this.drawLinearGenomeLabels(linearGenomeLabelCoords);
		this.setSvgWidth(this.conf.graphicalParameters.canvasWidth + this.conf.graphicalParameters.genomeLabelWidth);
	}

	if (this.conf.features.showAllFeatures === true || this.conf.features.supportedFeatures.gene.visible === true || this.conf.features.supportedFeatures.invertedRepeat.visible === true || this.conf.features.supportedFeatures.repeat.visible === true || this.conf.features.supportedFeatures.nStretch.visible === true || this.conf.features.fallbackStyle.visible === true) {
		var linearFeatureCoords = this.getLinearFeatureCoords(karyoCoords);
		this.drawLinearFeatures(linearFeatureCoords);
//		var linearFeatureLabelCoords = this.getFeatureLabelCoords(linearFeatureCoords);
//		this.drawLinearFeatureLabels(linearFeatureLabelCoords);
	}
	if (this.conf.labels.chromosome.showChromosomeLabels === true) {
		var linearChromosomeLabelCoords = this.getChromosomeLabelCoords(karyoCoords);
		this.drawLinearChromosomeLabels(linearChromosomeLabelCoords);
	}

	if (this.conf.tree.drawTree === true && this.hasTree() === true) {
		this.drawPhylogeneticTree();
		this.setSvgWidth(this.conf.graphicalParameters.canvasWidth + this.conf.graphicalParameters.treeWidth);
	}

	if (this.conf.tree.drawTree === true && this.conf.labels.genome.showGenomeLabels) {
		this.setSvgWidth(this.conf.graphicalParameters.canvasWidth + this.conf.graphicalParameters.treeWidth + this.conf.graphicalParameters.genomeLabelWidth);
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
	this.svgD3.selectAll(".treeGroup").remove();
	this.svgD3.selectAll(".featureGroup").remove();
	var karyoCoords = this.getCircularKaryoCoords();
	var tickCoords = this.getCircularTickCoords(karyoCoords);
	this.drawCircularTicks(tickCoords);
	this.drawCircularKaryo(karyoCoords);
	var linkCoords = this.getCircularLinkCoords(karyoCoords);
	this.drawCircularLinks(linkCoords);
	this.conf.layout = "circular";
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
 * @throws Will throw an error if the argument is empty.
 * @throws Will throw an error if the argument is not a number.
 * @throws Will throw an error if the argument is less than 0 or equal to 0.
 * @author Sonja Hohlfeld
 */

AliTV.prototype.setKaryoSpacer = function(spacer) {
	if (spacer === "") {
		throw "empty";
	} else if (isNaN(spacer)) {
		throw "not a number";
	} else if (spacer <= 0) {
		throw "spacer is to small, it should be > 0";
	} else {
		this.conf.graphicalParameters.karyoDistance = spacer;
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
		throw "empty";
	} else if (isNaN(height)) {
		throw "not a number";
	} else if (height <= 0) {
		throw "genome distance is to small, it should be > 0";
	} else {
		height = Number(height);
		this.conf.graphicalParameters.karyoHeight = height;
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
		throw "empty";
	} else if (isNaN(width)) {
		throw "not a number";
	} else if (width <= 0) {
		throw "width is to small, it should be > 0";
	} else {
		width = Number(width);
		this.conf.graphicalParameters.canvasWidth = width;
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
		throw "empty";
	} else if (isNaN(height)) {
		throw "not a number";
	} else if (height <= 0) {
		throw "height is to small, it should be > 0";
	} else {
		height = Number(height);
		this.conf.graphicalParameters.canvasHeight = height;
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
		throw "empty";
	} else if (isNaN(distance)) {
		throw "not a number";
	} else if (distance <= 0) {
		throw "distance is to small, it should be > 0";
	} else {
		distance = Number(distance);
		this.conf.graphicalParameters.tickDistance = distance;
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
		throw "empty";
	} else if (isNaN(treeWidth)) {
		throw "not a number";
	} else if (treeWidth <= 0) {
		throw "the tree width is to small, it should be > 0";
	} else {
		treeWidth = Number(treeWidth);
		this.conf.graphicalParameters.treeWidth = treeWidth;
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
		throw "empty";
	} else if (isNaN(tickLabelFrequency)) {
		throw "not a number";
	} else if (tickLabelFrequency <= 0) {
		throw "the frequency is to small, it should be > 0";
	} else {
		tickLabelFrequency = Number(tickLabelFrequency);
		this.conf.graphicalParameters.tickLabelFrequency = tickLabelFrequency;
		return this.conf.graphicalParameters.tickLabelFrequency;
	}
};

/**
 * This function returns the current color of genes.
 * @returns {String} The color of genes.
 * @author Sonja Hohlfeld
 */
AliTV.prototype.getGeneColor = function() {
	var color = this.conf.features.supportedFeatures.gene.color;
	return color;
};

/**
 * This function replaces the old color of genes with the new gene color in the config-object.
 * @param color: the color of genes which is returned by getGeneColor.
 * @throws Will throw an error if the argument is empty.
 * @author Sonja Hohlfeld
 */
AliTV.prototype.setGeneColor = function(color) {
	if (color === "") {
		throw "empty";
	} else {
		this.conf.features.supportedFeatures.gene.color = color;
		return this.conf.features.supportedFeatures.gene.color;
	}
};

/**
 * This function returns the current color of inverted repeats.
 * @returns {String} The color of inverted repeats.
 * @author Sonja Hohlfeld
 */
AliTV.prototype.getInvertedRepeatColor = function() {
	var color = this.conf.features.supportedFeatures.invertedRepeat.color;
	return color;
};

/**
 * This function replaces the old color of inverted repeats with the new color in the config-object.
 * @param color: the color of inverted repeats which is returned by getInvertedRepeatColor.
 * @throws Will throw an error if the argument is empty.
 * @author Sonja Hohlfeld
 */
AliTV.prototype.setInvertedRepeatColor = function(color) {
	if (color === "") {
		throw "empty";
	} else {
		this.conf.features.supportedFeatures.invertedRepeat.color = color;
		return this.conf.features.supportedFeatures.invertedRepeat.color;
	}
};

/**
 * This function returns the current color of repeats.
 * @returns {String} The color of repeats.
 * @author Sonja Hohlfeld
 */
AliTV.prototype.getRepeatColor = function() {
	var color = this.conf.features.supportedFeatures.repeat.color;
	return color;
};

/**
 * This function replaces the old color of repeats with the new color in the config-object.
 * @param color: the color of repeats which is returned by getRepeatColor.
 * @throws Will throw an error if the argument is empty.
 * @author Sonja Hohlfeld
 */
AliTV.prototype.setRepeatColor = function(color) {
	if (color === "") {
		throw "empty";
	} else {
		this.conf.features.supportedFeatures.repeat.color = color;
		return this.conf.features.supportedFeatures.repeat.color;
	}
};

/**
 * This function returns the current color of nStretches.
 * @returns {String} The color of repeats.
 * @author Sonja Hohlfeld
 */
AliTV.prototype.getNStretchColor = function() {
	var color = this.conf.features.supportedFeatures.nStretch.color;
	return color;
};

/**
 * This function replaces the old color of nStretches with the new color in the config-object.
 * @param color: the color of nStretches which is returned by getNStretchColor.
 * @throws Will throw an error if the argument is empty.
 * @author Sonja Hohlfeld
 */
AliTV.prototype.setNStretchColor = function(color) {
	if (color === "") {
		throw "empty";
	} else {
		this.conf.features.supportedFeatures.nStretch.color = color;
		return this.conf.features.supportedFeatures.nStretch.color;
	}
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
		throw "empty";
	} else {
		this.conf.linear.startLineColor = color[0];
		this.conf.linear.endLineColor = color[1];
		newColor.push(this.conf.linear.startLineColor);
		newColor.push(this.conf.linear.endLineColor);
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
		throw "empty";
	} else {
		this.conf.minLinkIdentityColor = color[0];
		this.conf.midLinkIdentityColor = color[1];
		this.conf.maxLinkIdentityColor = color[2];
		newColor.push(this.conf.minLinkIdentityColor);
		newColor.push(this.conf.midLinkIdentityColor);
		newColor.push(this.conf.maxLinkIdentityColor);
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
				filteredLinks = $.extend(filteredLinks, v);
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
	var treeData = $.extend(true, {}, that.data.tree);
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
		if (that.conf.labels.showAllLabels === true || that.conf.labels.genome.showGenomeLabels === true) {
			that.svgD3.selectAll(".treeGroup").attr("transform", "translate(" + (that.conf.graphicalParameters.canvasWidth + that.conf.graphicalParameters.genomeLabelWidth) + ", 0)");
		}

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
			if (featureStyle.form === "rect") {
				currentFeature = {
					"id": value.name,
					"type": type,
					"y": currentY,
					"height": featureStyle.height
				};

				currentFeature.width = (Math.abs(value.end - value.start) * currentWidth) / that.data.karyo.chromosomes[featureKaryo].length;
				currentFeature.x = currentX + (Math.min(value.start, value.end) * currentWidth) / that.data.karyo.chromosomes[featureKaryo].length;

				linearFeatureCoords.push(currentFeature);
			} else if (featureStyle.form === "arrow") {
				currentFeature = {
					"type": type,
					"id": value.name
				};
				currentFeature.path = [];
				currentFeature.path.push({
					x: currentX + (Math.abs(value.start) * currentWidth) / that.data.karyo.chromosomes[featureKaryo].length,
					y: currentY + 1 / 5 * featureStyle.height
				}, {
					x: currentX + (Math.abs(value.start) * currentWidth) / that.data.karyo.chromosomes[featureKaryo].length + 5 / 6 * ((value.end - value.start) * currentWidth) / that.data.karyo.chromosomes[featureKaryo].length,
					y: currentY + 1 / 5 * featureStyle.height
				}, {
					x: currentX + (Math.abs(value.start) * currentWidth) / that.data.karyo.chromosomes[featureKaryo].length + 5 / 6 * ((value.end - value.start) * currentWidth) / that.data.karyo.chromosomes[featureKaryo].length,
					y: currentY
				}, {
					x: currentX + (Math.abs(value.start) * currentWidth) / that.data.karyo.chromosomes[featureKaryo].length + ((value.end - value.start) * currentWidth) / that.data.karyo.chromosomes[featureKaryo].length,
					y: currentY + 1 / 2 * featureStyle.height
				}, {
					x: currentX + (Math.abs(value.start) * currentWidth) / that.data.karyo.chromosomes[featureKaryo].length + 5 / 6 * ((value.end - value.start) * currentWidth) / that.data.karyo.chromosomes[featureKaryo].length,
					y: currentY + featureStyle.height
				}, {
					x: currentX + (Math.abs(value.start) * currentWidth) / that.data.karyo.chromosomes[featureKaryo].length + 5 / 6 * ((value.end - value.start) * currentWidth) / that.data.karyo.chromosomes[featureKaryo].length,
					y: currentY + featureStyle.height - 1 / 5 * featureStyle.height
				}, {
					x: currentX + (Math.abs(value.start) * currentWidth) / that.data.karyo.chromosomes[featureKaryo].length,
					y: currentY + featureStyle.height - 1 / 5 * featureStyle.height
				});
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

	that.svgD3.selectAll(".featureGroup").remove();
	var shapes = that.svgD3.append("g")
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


	shapes.append("rect")
		.filter(function(d) {
			if (d.type in that.conf.features.supportedFeatures === true) {
				return that.conf.features.supportedFeatures[d.type].form === "rect" && (that.conf.features.supportedFeatures[d.type].visible === true || that.conf.features.showAllFeatures === true);
			} else {
				return that.conf.features.fallbackStyle.form === "rect";
			}
		})
		.attr("class", "feature")
		.attr("id", function(d){
			return d.id + "_" + d.type;
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
				.attr("id", function(d){
					return d.id + "_" + d.type;
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
				});
		});

	if (that.conf.tree.drawTree === true && that.conf.tree.orientation === "left") {
		that.svgD3.selectAll(".featureGroup").attr("transform", "translate(" + that.conf.graphicalParameters.treeWidth + ", 0)");
	}
	if (that.conf.labels.showAllLabels === true || that.conf.labels.genome.showGenomeLabels === true) {
		that.svgD3.selectAll(".featureGroup").attr("transform", "translate(" + that.conf.graphicalParameters.genomeLabelWidth + ", 0)");
	}
	if ((that.conf.labels.showAllLabels === true || that.conf.labels.genome.showGenomeLabels === true) && that.conf.tree.drawTree === true && that.conf.tree.orientation === "left") {
		that.svgD3.selectAll(".featureGroup").attr("transform", "translate(" + (that.conf.graphicalParameters.treeWidth + that.conf.graphicalParameters.genomeLabelWidth) + ", 0)");
	}
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
 * This method is supposed to calculate the coordinates for chromosome labels.
 * This is called if the configuration of addChromosomeLabels or showAllLabels is true.
 * @param gets the coordinates of the drawn chromosomes.
 * @returns chromosomeLabelCoords: returns an array which contains the coords for the chromosome labels.
 * @author Sonja Hohlfeld
 */
AliTV.prototype.getChromosomeLabelCoords = function(linearKaryoCoords) {
	var that = this;
	var linearChromosomeLabelCoords = [];
	$.each(linearKaryoCoords, function(key, value) {
		var genome = {
			name: value.karyo,
			x: value.x + 1 / 2 * value.width,
			y: value.y + 0.85 * that.conf.graphicalParameters.karyoHeight
		};
		linearChromosomeLabelCoords.push(genome);
	});
	return linearChromosomeLabelCoords;
};

/**
 * This function is supposed to draw the text labels for chromosome.
 * @param linearChromosomeLabelCoords: gets the coords of the chromosome labels which is returned by getChromosomeLabelCoords.
 * @author Sonja Hohlfeld
 */
AliTV.prototype.drawLinearChromosomeLabels = function(linearChromosomeLabelCoords) {
	var that = this;
	this.svgD3.selectAll(".chromosomeLabelGroup").remove();
	that.svgD3.append("g")
		.attr("class", "chromosomeLabelGroup")
		.selectAll("path")
		.data(linearChromosomeLabelCoords)
		.enter()
		.append("text")
		.attr("class", "chromosomeLabel")
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
		.attr("font-size", that.getChromosomeLabelSize() + "px")
		.attr("fill", that.getChromosomeLabelColor())
		.style("text-anchor", "middle");

	if (that.conf.labels.showAllLabels === true || that.conf.labels.genome.showGenomeLabels === true) {
		that.svgD3.selectAll(".chromosomeLabelGroup").attr("transform", "translate(" + that.conf.graphicalParameters.genomeLabelWidth + ", 0)");
	}
	if ((that.conf.labels.showAllLabels === true || that.conf.labels.genome.showGenomeLabels === true) && that.conf.tree.drawTree === true && that.conf.tree.orientation === "left") {
		that.svgD3.selectAll(".chromosomeLabelGroup").attr("transform", "translate(" + (that.conf.graphicalParameters.treeWidth + that.conf.graphicalParameters.genomeLabelWidth) + ", 0)");
	}
	if ((that.conf.labels.showAllLabels === false && that.conf.labels.genome.showGenomeLabels === false) && that.conf.tree.drawTree === true && that.conf.tree.orientation === "left") {
		that.svgD3.selectAll(".chromosomeLabelGroup").attr("transform", "translate(" + that.conf.graphicalParameters.treeWidth + ", 0)");
	}
};

/**
 * This method is supposed to calculate the coordinates for feature labels.
 * This method is called if the configuration of addFeatureLabels or showAllLabels is true.
 * @param gets the coordinates of the drawn features.
 * @returns featureLabelCoords: returns an array which contains the coords for the feature labels.
 * @author Sonja Hohlfeld
 */
AliTV.prototype.getFeatureLabelCoords = function(linearFeatureCoords) {
	var that = this;
	var linearFeatureLabelCoords = [];
	$.each(linearFeatureCoords, function(key, value) {
		var feature = {
			name: value.id
		};
		if (value.type in that.conf.features.supportedFeatures === true) {
			if (that.conf.features.supportedFeatures[value.type].form === "rect" && (that.conf.labels.showAllLabels === true || that.conf.labels.features.showFeatureLabels === true || that.conf.features.supportedFeatures[value.type].labeling === true)) {
				feature.x = value.x + 1 / 2 * value.width;
				feature.y = value.y + 0.85 * that.conf.graphicalParameters.karyoHeight;
			}
			if (that.conf.features.supportedFeatures[value.type].form === "arrow" && (that.conf.labels.showAllLabels === true || that.conf.labels.features.showFeatureLabels === true || that.conf.features.supportedFeatures[value.type].labeling === true)) {
				feature.x = value.path[0].x + 1 / 2 * (value.path[3].x - value.path[0].x);
				feature.y = value.path[0].y + 1 / 2 * that.conf.graphicalParameters.karyoHeight;
			}
		} else {
			feature.x = value.x + 1 / 2 * value.width;
			feature.y = value.y + 0.85 * that.conf.graphicalParameters.karyoHeight;
		}
		linearFeatureLabelCoords.push(feature);
	});
	return linearFeatureLabelCoords;
};

/**
 * This method is supposed to draw labels to all features.
 * @param linearFeatureLabelCoords: get the coords for the feature labels which are returned by getFeatureLabelCoords.
 * @author Sonja Hohlfeld
 */
AliTV.prototype.drawLinearFeatureLabels = function(linearFeatureLabelCoords) {
	var that = this;
	this.svgD3.selectAll(".featureLabelGroup").remove();
	that.svgD3.append("g")
		.attr("class", "featureLabelGroup")
		.selectAll("path")
		.data(linearFeatureLabelCoords)
		.enter()
		.append("text")
		.attr("class", "featureLabel")
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
		.attr("font-size", 2 / 3 * that.conf.graphicalParameters.karyoHeight + "px")
		.attr("fill", "red")
		.style("text-anchor", "middle");

	if (that.conf.labels.showAllLabels === true || that.conf.labels.genome.showGenomeLabels === true) {
		that.svgD3.selectAll(".featureLabelGroup").attr("transform", "translate(" + that.conf.graphicalParameters.genomeLabelWidth + ", 0)");
	}
	if ((that.conf.labels.showAllLabels === true || that.conf.labels.genome.showGenomeLabels === true) && that.conf.tree.drawTree === true && that.conf.tree.orientation === "left") {
		that.svgD3.selectAll(".featureLabelGroup").attr("transform", "translate(" + (that.conf.graphicalParameters.treeWidth + that.conf.graphicalParameters.genomeLabelWidth) + ", 0)");
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
		throw "empty";
	} else if (isNaN(width)) {
		throw "not a number";
	} else if (width <= 0) {
		throw "width is to small, it should be > 0";
	} else {
		width = Number(width);
		this.svg.attr("width", width);
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
		throw "empty";
	} else if (isNaN(height)) {
		throw "not a number";
	} else if (height <= 0) {
		throw "height is to small, it should be > 0";
	} else {
		height = Number(height);
		this.svg.attr("height", height);
	}
};

/**
 * This function returns the content of the svg as a text string.
 * @returns {String} The content of the svg.
 * @author Markus Ankenbrand
 */

AliTV.prototype.getSvgAsText = function() {
	return this.svg[0].outerHTML;
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
		throw "empty";
	} else {
		this.conf.labels.genome.color = color;
		return this.conf.labels.genome.color;
	}
};

/**
 * This function returns the color of the chromosomeLabels. 
 * The color is defined in the conf-object.
 * @returns The color of the chromosome labels.
 * @author Sonja Hohlfeld
 */
AliTV.prototype.getChromosomeLabelColor = function() {
	return this.conf.labels.chromosome.color;
};

/**
 * This function set a new color for the chromosome labels.
 * @param color: the current color of chromosome labels which is returned by getChromosomeLabelColor.
 * @throws Will throw an error if the argument is empty.
 * @author Sonja Hohlfeld
 */
AliTV.prototype.setChromosomeLabelColor = function(color) {
	if (color === "") {
		throw "empty";
	} else {
		this.conf.labels.chromosome.color = color;
		return this.conf.labels.chromosome.color;
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
		throw "empty";
	} else if (isNaN(size)) {
		throw "not a number";
	} else if (size <= 0) {
		throw "size is to small, it should be > 0";
	} else {
		size = Number(size);
		this.conf.labels.genome.size = size;
		return this.conf.labels.genome.size;
	}
};

/**
 * This function returns the size of the chromosomeLabels. 
 * The size is defined in the conf-object.
 * @returns The size of the chromosome labels.
 * @author Sonja Hohlfeld
 */
AliTV.prototype.getChromosomeLabelSize = function() {
	return this.conf.labels.chromosome.size;
};

/**
 * This function set a new size for the chromsome labels.
 * @param size: the current size of Chromosome labels which is returned by getChromosomeLabelSize.
 * @param {Number} The function gets the size of chromosome labels which can be set by the user.
 * @throws Will throw an error if the argument is empty.
 * @throws Will throw an error if the argument is not a number.
 * @throws Will throw an error if the argument is less than 0 or equal to 0.
 * @author Sonja Hohlfeld
 */
AliTV.prototype.setChromosomeLabelSize = function(size) {
	if (size === "") {
		throw "empty";
	} else if (isNaN(size)) {
		throw "not a number";
	} else if (size <= 0) {
		throw "size is to small, it should be > 0";
	} else {
		size = Number(size);
		this.conf.labels.chromosome.size = size;
		return this.conf.labels.chromosome.size;
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
		throw "empty";
	} else {
		this.conf.labels.ticks.color = color;
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
		throw "empty";
	} else if (isNaN(size)) {
		throw "not a number";
	} else if (size <= 0) {
		throw "size is to small, it should be > 0";
	} else {
		size = Number(size);
		this.conf.labels.ticks.size = size;
		return this.conf.labels.ticks.size;
	}
};

/**
 * This function pushes a link which is selected by his id to ali.filters.links.invisible links.
 * The function marks all links, which are set invisible.
 * @param selectedLink: gets the id of the selected link
 * @returns ali.filters.links.invisibleLinks: returns the links which are invisible in the current settings.
 * @author Sonja Hohlfeld
 */
AliTV.prototype.setLinkInvisible = function(selectedLink) {

};




