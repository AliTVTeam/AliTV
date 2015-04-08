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

var circularSvg = d3.select("body").append("svg").attr("width", width).attr("height",
		height).append("g").attr("transform",
		"translate(" + width / 2 + "," + height / 2 + ")");

function drawKaryo(karyo) {
	var array = $.map(karyo, function(value, index) {
		return [ value ];
	});
	circularSvg.append("g").attr("class", "karyo").selectAll("path").data(array)
			.enter().append("path").style("fill", function(d) {
				return fill(d.index);
			})
			.style("stroke", function(d) {
				return fill(d.index);
			})
			.attr(
					"d",
					d3.svg.arc().innerRadius(innerRadius).outerRadius(
							outerRadius)).on("mouseover", function(g, i) {
				fade(g, i, 0.1);
				add_tooltip_legend(g);
			})
			.on("mouseout", function(g, i) {
				fade(g, i, 1);
				reAdd_tooltip_legend();
			})
			.on("click", function(g, i) {
				circularSvg.selectAll(".chord path").remove();
				circularSvg.selectAll(".ticks g").remove();
				create_new_karyo(karyo, g);
				var array = $.map(karyo, function(value, index) {
					return [ value ];
				});
				addTicks(array);
				loadLinkFile("data/link.json", karyo, function(links) {
					full_links = links;
					redraw(identity_range, min_length);
				});
			})
	//addTicks(array);
}

function fade(g, i, opacity) {
	circularSvg.selectAll(".chord path")
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
	circularSvg.selectAll(".chord path").remove();
}
