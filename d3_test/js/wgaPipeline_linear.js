var width = 960, height = 700;

var fill = d3.scale.ordinal().domain(d3.range(5)).range(
		[ "#000000", "#FFDD89", "#957244", "#F26223", "#00FF00" ]);

function fillByLength(length) {
	if (length < 10000) {
		return "#FF0000";
	} else if (length < 50000) {
		return "#FFDD00";
	} else {
		return "#00FF00";
	}
}

function fillByIdy(identity) {
	if (identity < 90) {
		return "#FF0000";
	} else if (identity < 95) {
		return "#FFDD00";
	} else {
		return "#00FF00";
	}
}

var svg = d3.select("body").append("svg").attr("width", width).attr("height",
		height).append("g");

function drawKaryo(karyo) {
	svg.append("g").selectAll("path").data(karyo).enter().append("rect")
	.on("mouseover", fade(.1))
	.on("mouseout", fade(1)).style(
			"fill", function(d) {
				return fill(d.index);
			}).style("stroke", function(d) {
		return fill(d.index);
	}).attr("x", function(d) {
		return d.x
	}).attr("y", function(d) {
		return 500 * d.genome_id
	}).attr("width", function(d) {
		return d.width
	}).attr("height", 10);
	;
}

function getRibbon(links) {
	var diagonal = d3.svg.diagonal().source(function(d) {
		return {
			"x" : d.source.x,
			"y" : d.source.y
		};
	}).target(function(d) {
		return {
			"x" : d.target.x,
			"y" : d.target.y
		};
	}).projection(function(d) {
		return [ d.x, d.y ];
	});
	var path1 = diagonal(links[0]);
	var path2 = diagonal(links[1]).replace(/^M/, 'L');
	var shape = path1 + path2 + 'Z';
	return shape;
}

function addTicks(karyo) {
	var ticks = svg.append("g").selectAll("g").data(karyo).enter().append("g")
			.selectAll("g").data(groupTicks).enter().append("g").attr(
					"transform",
					function(d) {
						return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
								+ "translate(" + outerRadius + ",0)";
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

function drawLinks(links) {
	svg.append("g").attr("class", "chord").selectAll("path").data(links)
	 .enter().append("path").attr("d",
	 function(d) {return getRibbon(d.ribbon)}).style("fill",
	 function(d) {
	 // return fillByLength(Math.abs(d.target.end -
	 // d.target.start));
	 return fillByIdy(Math.abs(d.identity));
	 }).style("opacity", 1);
//	$.each(links, function(key, value) {
//		svg.append('g').attr("class", "chord").append("path").attr("d",
//				getRibbon(value.ribbon)).style("fill", function() {
//			// return fillByLength(Math.abs(d.target.end -
//			// d.target.start));
//			return fillByIdy(Math.abs(value.identity));
//		}).style("opacity", 1);
//		;
//	});
}

// Returns an array of tick angles and labels, given a group.
function groupTicks(d) {
	var k = (d.endAngle - d.startAngle) / d.value;
	return d3.range(0, d.value, 10000).map(function(v, i) {
		return {
			angle : v * k + d.startAngle,
			label : i % 5 ? null : v / 1000 + "k"
		};
	});
}

function loadKaryoFile(file, callback) {
	$.getJSON(file, function(data) {
		var karyo = karyo_to_coords(data);
		if (typeof callback !== "undefined") {
			callback(karyo);
		}
	});
}

function karyo_to_coords(data) {
	var total = [ 0, 0 ];
	var spacer = 10000;
	$.each(data, function(key, value) {
		total[value.genome_id] += value.length + spacer;
	});
	var current = [ 0, 0 ];
	var index = 0;
	// take max of total instead of array to keep scale constant across genomes
	// instead of scaling them to the same width.
	$.each(data, function(key, value) {
		data[key] = {
			"value" : value.length,
			"index" : index++,
			"x" : (current[value.genome_id] / total[value.genome_id]) * width,
			"width" : (value.length / total[value.genome_id]) * width,
			"genome_id" : value.genome_id
		};
		current[value.genome_id] += value.length + spacer;
	});
	return data;
}

function loadLinkFile(file, karyo, callback) {
	$.getJSON(file, function(data) {
		var links = link_to_coords(data, karyo);
		if (typeof callback !== 'undefined') {
			callback(links);
		}
	});
}

function link_to_coords(links, karyo) {
	$.each(links, function(key, value) {
		links[key].ribbon = [ {
			source : {
				x : 0,
				y : 0
			},
			target : {
				x : 0,
				y : 0
			},
			x : 0,
			y : 0
		}, {
			source : {
				x : 0,
				y : 0
			},
			target : {
				x : 0,
				y : 0
			},
			x : 0,
			y : 0
		} ];
		var s = karyo[value.source.name];
		links[key].ribbon[0].source.x = s.x + s.width
				* (value.source.start / s.value);
		links[key].ribbon[0].source.y = 480 * s.genome_id + 15;
		links[key].ribbon[1].target.x = s.x + s.width
				* (value.source.end / s.value);
		links[key].ribbon[1].target.y = 480 * s.genome_id + 15;
		links[key].source.index = s.index;
		links[key].source.value = Math.abs(value.source.end
				- value.source.start);
		var t = karyo[value.target.name];
		links[key].ribbon[0].target.x = t.x + t.width
				* (value.target.start / t.value);
		links[key].ribbon[0].target.y = 480 * t.genome_id + 15;
		links[key].ribbon[1].source.x = t.x + t.width
				* (value.target.end / t.value);
		links[key].ribbon[1].source.y = 480 * t.genome_id + 15;
		links[key].target.index = t.index;
		links[key].target.value = Math.abs(value.target.end
				- value.target.start);
	});
	return links;
}

// Returns an event handler for fading a given chord group.
function fade(opacity) {
	return function(g, i) {
		svg.selectAll(".chord path").filter(function(d) {
			return d.source.index != i && d.target.index != i;
		}).transition().style("opacity", opacity);
	};
}

function clear_chords() {
	svg.selectAll(".chord path").remove();
}
