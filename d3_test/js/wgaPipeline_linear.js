var width = 960, height = 700;

var fill = d3.scale.category20c();
var legendRectSize = 18;
var legendSpacing = 4;
var div = d3.select("body").append("div")
	.attr("class", "tooltip")
	.style("opacity", 0);

	div.append("div")
		.attr("class", "label")

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
	if (identity < 46) {
		return "#FF1600";
	} else if (identity < 50) {
		return "#FF3500";
	} else if (identity < 54) {
		return "#FF5300";
	} else if (identity < 58) {
		return "#FF7C01";
	} else if (identity < 62) {
		return "#FF9B01";
	} else if (identity < 66) {
		return "#FFC301";
	} else if (identity < 70) {
		return "#FFE201";
	} else if (identity < 74) {
		return "#EBDD02";
	} else if (identity < 78) {
		return "#CCD603";
	} else if (identity < 82) {
		return "#B7D103";
	} else if (identity < 86) {
		return "#99C905";
	} else if (identity < 90) {
		return "#7AC206";
	} else if (identity < 94) {
		return "#FFDD00";
	} else {
		return "#32B008";
	}
}

var svg = d3.select("body").append("svg").attr("width", width).attr("height",
		height).append("g");

function drawKaryo(karyo) {
	svg.append("g").selectAll("path").data(karyo).enter().append("rect")
	.on("mouseover", function(g, i) {
			fade(g, i, 0.1);
			//add_tooltip_legend(g);
			})
	.on("mouseout", function(g, i) {
				fade(g, i, 1);
				reAdd_tooltip_legend();
		})
	.on("click", function(g, i){
		svg.selectAll(".chord path").remove();
		svg.selectAll(".ticks g").remove();
		create_new_karyo(karyo, i);
		//addTicks(karyo);
		new_loadLinkFile("data/link.json", karyo, function(links) {
			full_links = links;
			redraw(identity_range, min_length);
		});
	})
	.style(
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

// This function is adjusted from:
// http://stackoverflow.com/questions/26567104/d3-js-fill-area-between-to-diagonals
// thanks to user 'meetamit'
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
	var spacer = set_spacer(data);
	$.each(data.chromosomes, function(key, value) {
		total[value.genome_id] += value.length + spacer;
	});
	var current = [ 0, 0 ];
	var index = 0;	
	// take max of total instead of array to keep scale constant across genomes
	// instead of scaling them to the same width.
	for(var i=0;i<data.order.length;i++){
		var key = data.order[i];
		var value = data.chromosomes[key];
		data.chromosomes[key] = {
			"value" : value.length,
			"index" : index++,
			"x" : (current[value.genome_id] / total[value.genome_id]) * width,
			"width" : (value.length / total[value.genome_id]) * width,
			"genome_id" : value.genome_id,
			"name" : key,
			"rc" : value.rc
		};
		current[value.genome_id] += value.length + spacer;
	};
	return data.chromosomes;
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

function set_spacer(data) {
	var spacer = 0;
	$.each(data.chromosomes, function(key, value) {
		spacer += value.length;
	});
	spacer = spacer * 0.0038; // ca. 4% der Gesamtsumme aller Sequenzen
								// entsprechen dem geeigneten Spacer
	// console.log(spacer);
	return spacer;
}

function add_tooltip_legend(g){
	var name = "name: " + g.name;
	var length = "length: " + g.value + " bp";
	var text = name.concat(" \n", length);
	div.transition()
		.duration(200)
		.style("opacity", .9)
		.style("left", (d3.event.pageX - 34) + "px")
		.style("top", (d3.event.pageY - 12) + "px")
		div.html(name + "<br/>" + length);
		
}

function reAdd_tooltip_legend(d) {
	div.transition()
		.duration(500)
		.style("opacity", 0);
}

function create_new_karyo(karyo, i){
	var endAngle = karyo[i].endAngle;
	var startAngle = karyo[i].startAngle;
	karyo[i] = {
			"value" : karyo[i].value,
			"startAngle" : endAngle,
			"index" : karyo[i].index,
			"genome_id" : karyo[i].genome_id,
			"name" : karyo[i].name,
			"endAngle" : startAngle,
			"rc" : false
		};
return karyo;
}

function new_loadLinkFile(file, karyo, callback) {
$.getJSON(file, function(data) {
	var links = create_new_links(data, karyo);
	if (typeof callback !== 'undefined') {
		callback(links);
	}
});
}

function create_new_links(links, karyo){
	$.each(links, function(key, value) {
		var s;
		var sourceName = value.source.name;
		for(var i=0;i<karyo.length;i++){
			var karyoName = karyo[i].name;
			if(karyoName==sourceName){
				s = karyo[i];
				break;
			}
		}
		var s_totalAngle = s.endAngle - s.startAngle;
		links[key].source.startAngle = s.startAngle + s_totalAngle
				* (value.source.start / s.value);
		links[key].source.endAngle = s.startAngle + s_totalAngle
				* (value.source.end / s.value);
		links[key].source.index = s.index;
		links[key].source.value = Math.abs(value.source.end
				- value.source.start);
		
		var t;
		var targetName = value.target.name;
		for(var j=0;j<karyo.length;j++){
			var karyoName=karyo[j].name;
			if(karyoName==targetName){
				t = karyo[j];
				break;
			}
		}
		var t_totalAngle = t.endAngle - t.startAngle;
		links[key].target.endAngle = t.startAngle + t_totalAngle
				* (value.target.start / t.value);
		links[key].target.startAngle = t.startAngle + t_totalAngle
				* (value.target.end / t.value);
		links[key].target.index = t.index;
		links[key].target.value = Math.abs(value.target.end
				- value.target.start);
	});
	return links;
}

