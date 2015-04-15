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
	this.svg = svg;
	this.data = {};
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
