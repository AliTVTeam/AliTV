/**
 * Creates an object of type wgaPipeline for drawing whole genome alignment visualizations
 * @author Markus Ankenbrand <markus.ankenbrand@uni-wuerzburg.de> 
 * @constructor
 * @param {Object} svg - jQuery object containing a svg DOM element. Visualizations will be drawn on this svg. Size may be changed by object methods. Previous content will be deleted.
 * @example
 * // initializes an wgaPipeline object (wga) on the svg element with id 'canvas'
 * var svg = $('#canvas');
 * var wga = new wgaPipeline(svg);
 */
function WgaPipeline(svg) {
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
	 * @property {Array}   karyo.order                  - array of chromosome IDs in the desired order (circular layout)
	 * @property {Array}   karyo.genome_order           - array of genome IDs in the desired order (linear layout)
	 * @property {Object}  karyo.chromosomes            - the chromosome details, karyo IDs as keys
	 * @property {Number}  karyo.chromosomes.genome_id  - number of genome to which this chromosome belongs
	 * @property {Number}  karyo.chromosomes.length     - length in bp
	 * @property {Boolean} karyo.chromosomes.rc         - should the sequence be treated as its reverse complement
	 * @property {String}  karyo.chromosomes.seq        - sequence of the chromosome
	 * @property {Object}  features                     - the feature information, feature IDs as keys
	 * @property {String}  features.karyo               - the karyo ID
	 * @property {Number}  features.start               - start position on the sequence
	 * @property {Number}  features.end                 - end position on the sequence
	 * @property {Object}  links                        - the link information
	 * @property {String}  links.source                 - source feature of the link
	 * @property {String}  links.target                 - target feature of the link
	 * @property {Number}  links.identity               - identity of the link
	 */
	this.data = {};
	/**
	 * property to store configuration options
	 * @property {Number}  width                  - The width of the svg in px.
	 * @property {Number}  height                 - The height of the svg in px.
	 * @property {Object}  linear                 - The configuration options for the linear layout.
	 * @property {Number}  linear.genomeDistance  - The vertical distance between adjacent genomes in px.
	 * @property {Number}  linear.karyoHeight     - The height of each chromosome in px.
	 * @property {Number}  linear.karyoDistance   - The horizontal distance between adjacent chromosomes of the same genome in bp.
	 */
	this.conf = {
		width: 1000,
		height: 1000,
		linear: {
			genomeDistance: 300,
			karyoHeight: 30,
			karyoDistance: 10
		}
	};
	// Initialize svg size
	svg.height(this.conf.height);
	svg.width(this.conf.width);
}

/**
 * Sets the data of the WgaPipeline object.
 * For the required format see the example
 * @author Markus Ankenbrand <markus.ankenbrand@uni-wuerzburg.de>
 * @param {Object} data - Object containing karyo, link and feature information
 * @example
 * var svg = $('#canvas');
 * var wga = new wgaPipeline(svg);
 * var karyo = {
 * 	'order': ['c1', 'c2'],
 * 	'genome_order': ['0', '1'],
 * 	'chromosomes': {
 * 	'c1': {'genome_id': 0, 'length': 2000, 'rc': false, 'seq': null},
 * 	'c2': {'genome_id': 1, 'length': 1000, 'rc': false, 'seq': null}
 * 	}
 * };
 * var features = {
 * 	'f1': {'karyo': 'c1', 'start': 300, 'end': 800},
 * 	'f2': {'karyo': 'c2', 'start': 100, 'end': 600}
 * };
 * var links = [
 * 	{'source': 'f1', 'target': 'f2', 'identity': 90}
 * ];
 * wga.setData({'karyo': karyo, 'features': features, 'links': links};
 */
WgaPipeline.prototype.setData = function(data) {
	this.data = data;
};

/**
 * Calculates coordinates for the chromosomes to draw in the linear layout.
 * This function operates on the data property of the object and therefore needs no parameters.
 * This function is primarily meant for internal usage, the user should not need to call this directly.
 * @author Markus Ankenbrand <markus.ankenbrand@uni-wuerzburg.de>
 * @returns {Array} Array containing one Object for each element in data.karyo of the form {karyo: 'karyo_name', x:0, y:0, width:10, height:10}
 */
WgaPipeline.prototype.getLinearKaryoCoords = function() {
	var linearKaryoCoords = [];
	var genome_order = this.data.karyo.genome_order;
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

	for (i = 0; i < this.data.karyo.order.length; i++) {
		var key = this.data.karyo.order[i];
		var value = this.data.karyo.chromosomes[key];
		var coord = {
			'karyo': key,
			'x': (current[genome_order.indexOf(value.genome_id)] / maxTotalSize) * conf.width,
			'y': genome_order.indexOf(value.genome_id) * conf.linear.genomeDistance,
			'width': (value.length / maxTotalSize) * conf.width,
			'height': conf.linear.karyoHeight
		};
		current[genome_order.indexOf(value.genome_id)] += value.length + conf.linear.karyoDistance;
		linearKaryoCoords.push(coord);
	}

	return linearKaryoCoords;
};

/**
 * This function draws the karyos in the linear layout
 * @author Markus Ankenbrand and Sonja Hohlfeld
 * @param {Array} The array containing the coordinates as returned by getLinearKaryoCoords()
 */
WgaPipeline.prototype.drawLinearKaryo = function(coords) {
	this.svgD3.selectAll(".karyoGroup").remove();
	this.svgD3.append("g")
		.attr("class", "karyoGroup")
		.selectAll("path")
		.data(coords)
		.enter()
		.append("rect")
		.attr("class", "karyo")
		.attr("x", function(d) {
			return d.x;
		})
		.attr("y", function(d) {
			return d.y;
		})
		.attr("width", function(d) {
			return d.width;
		})
		.attr("height", function(d) {
			return d.height;
		});
};
