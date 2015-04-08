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
					fullLink = link_to_coords(links, karyo);
					redraw(identity_range, min_length);
				});
			})
	addTicks(array);
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

function addTicks(array) {
	var ticks = circularSvg.append("g").attr("class", "ticks").selectAll("g").data(
			array).enter().append("g").selectAll("g").data(groupTicks).enter()
			.append("g").attr(
					"transform",
					function(d) {
						return "rotate(" + (d.angle * 180 / Math.PI - 90) +
								")" + "translate(" + outerRadius + ",0)";
					});

	ticks.append("line").attr("x1", 1).attr("y1", 0).attr("x2", 5)
			.attr("y2", 0).style("stroke", "#000");

	ticks.append("text").attr("x", 8).attr("dy", ".35em").attr("transform",
			function(d) {
				return d.angle > Math.PI ? "rotate(180)translate(-16)" : null;
			}).style("text-anchor", function(d) {
		return d.angle > Math.PI ? "end" : null;
	}).text(function(d) {
		return d.label;
	});
}

//Returns an array of tick angles and labels, given a group.
function groupTicks(d) {
	var k = (d.endAngle - d.startAngle) / d.value;
	return d3.range(0, d.value, 10000).map(function(v, i) {
		return {
			angle : v * k + d.startAngle,
			label : i % 5 ? null : v / 1000 + "k"
		};
	});
}