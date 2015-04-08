var width = 1200;
var height = 3000;
var innerRadius = Math.min(width, height) * .41;
var outerRadius = innerRadius * 1.1;

var div = d3.select("body")
			.append("div")
			.attr("class", "tooltip")
			.style("opacity", 0);

div.append("div")
	.attr("class", "label");

var svg = d3.select("body").append("svg").attr("width", width).attr("height",
		height).append("g");

//function createSimpleSvg() {
//	var that = {};
//	var data = null;
//
//	var array = $.map(karyo, function(value, index) {
//		return [value];
//	});
//
//	that.setData = function(d) {
//		data = d;
//	};
//
//	that.getData = function() {
//		return data;
//	};
//
//	that.render = function() {
//		var svg = d3.select("body")
//			.append("svg")
//			.attr("width", width)
//			.attr("height", height)
//			.append("g");
//	};
//
//	return that;
//}

function drawKaryo(karyo) {
	var array = $.map(karyo, function(value, index) {
		return [ value ];
	});
	svg.append("g")
	.selectAll("path")
	.attr("class","karyo")
	.data(array)
	.enter()
	.append("rect")
	.on("mouseover", function(g, i) {
			fade(g, i, 0.1);
			add_tooltip_legend(g);
			})
	.on("mouseout", function(g, i) {
				fade(g, i, 1);
				reAdd_tooltip_legend();
		})
	.on("click", function(g, i){
		svg.selectAll(".chord path").remove();
		svg.selectAll(".ticks g").remove();
		create_new_karyo(karyo, g);
		var array = $.map(karyo, function(value, index) {
			return [ value ];
		});
		loadLinkFile("data/link.json", karyo, function(links) {
			fullLink = link_to_coords(links, karyo);
			redraw(identity_range, min_length);
		});
	})
	.style(
		"fill", function(d) {
			return fill(d.index);
		})
	.style("stroke", function(d) {
		return fill(d.index);
		})
		.attr("x", function(d) {
			return d.x
		})
		.attr("y", function(d){
			return 500 * d.genome_id 
		})
		.attr("width", function(d) {
			return d.width
		})
		.attr("height", 30);
	
}

function fade(g, i, opacity) {
	svg.selectAll(".chord path")
		.filter(function(d) {
			return d.source.index != g.index && d.target.index != g.index;
		})
		.transition()
		.style("opacity", opacity);
}

function add_tooltip_legend(g){
	var name = "name: " + g.name;
	var length = "length: " + g.value + " bp";
	var text = name.concat(" \n", length);
	div.transition()
		.duration(200)
		.style("opacity", 0.9)
		.style("left", (d3.event.pageX - 34) + "px")
		.style("top", (d3.event.pageY - 12) + "px");
		div.html(name + "<br/>" + length);
		
}

function reAdd_tooltip_legend(d) {
	div.transition()
		.duration(500)
		.style("opacity", 0);
}

function clear_chords() {
	svg.selectAll(".chord path").remove();
}
