var fill = d3.scale.category20c();

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


function drawLinks(links) {
	svg.append("g").attr("class", "chord").selectAll("path").data(links)
		.enter().append("path").attr("d",
			function(d) {
				return getRibbon(d.ribbon);
			}).style("fill",
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

function karyo_to_coords(data) {
	var genome_order = {};
	var line = 1;
	var lastLine, i, key;
	for (i = 0; i < data.order.length; i++) {
		key = data.order[i];
		genome_order[key] = {
			"line": line
		};
		line = line + 1;
	}

	$.each(genome_order, function(key, value) {
		lastLine = value.line;
	});

	var total = [];
	var current = [];
	for (i = 0; i < lastLine; i++) {
		total.push(0);
		current.push(0);
	}
	var index = 0;

	var spacer = set_spacer(data);
	$.each(data.chromosomes, function(key, value) {
		total[value.genome_id] += value.length + spacer;
	});

	for (i = 0; i < data.order.length; i++) {
		key = data.order[i];
		var value = data.chromosomes[key];
		data.chromosomes[key] = {
			"value": value.length,
			"index": index++,
			"x": (current[value.genome_id] / total[value.genome_id]) * width,
			"width": (value.length / total[value.genome_id]) * width,
			"genome_id": value.genome_id,
			"name": key
		};
		current[value.genome_id] += value.length + spacer;
	}

	return data.chromosomes;
}

function set_spacer(data) {
	var spacer = 0;
	$.each(data.chromosomes, function(key, value) {
		spacer += value.length;
	});
	spacer = spacer * 0.0038; // ca. 4% der Gesamtsumme aller Sequenzen //
	// entsprechen dem geeigneten Spacer
	return spacer;
}

function create_new_karyo(karyo, g){
	var key = g.name;
	var x = karyo[key].x + karyo[key].width;
	var width = karyo[key].width * (-1);
	karyo[key] = {
			"value" : karyo[key].value,
			"index" : karyo[key].index,
			"x" : x,
			"width": width,
			"genome_id" : karyo[key].genome_id,
			"name" : key,
			"rc" : karyo[key].rc
		};
return karyo;
}

function getRibbon(links) {
	for (var i = 0; i < links.length; i++) {
		var difference = links[i].target.line - links[i].source.line;
		if (difference == 1) {
			var diagonal = d3.svg.diagonal().source(function(d) {
				return {
					"x": d.source.x,
					"y": d.source.y
				};
			}).target(function(d) {
				return {
					"x": d.target.x,
					"y": d.target.y
				};
			}).projection(function(d) {
				return [d.x, d.y];
			});
			var path1 = diagonal(links[0]);
			var path2 = diagonal(links[1]).replace(/^M/, 'L');
			var shape = path1 + path2 + 'Z';
			return shape;
		}
	}
}

function testLineDifference(links) {
	for (var i = 0; i < links.length; i++) {
		var difference = links[i].target.line - links[i].source.line;
		if (difference == 1) {
			return true;
		}
	}
}

function link_to_coords(links, fullKaryo) {
	$.each(links, function(key, value) {

		links[key].ribbon = [{
			source: {
				x: 0,
				y: 0
			},
			target: {
				x: 0,
				y: 0
			},
			x: 1,
			y: 1
		}, {
			source: {
				x: 0,
				y: 0
			},
			target: {
				x: 0,
				y: 0
			},
			x: 1,
			y: 1
		}];
		
		var s = fullKaryo[value.source.name];
		links[key].ribbon[0].source.x = s.x + s.width *
			(value.source.start / s.value);
		links[key].ribbon[0].source.y = 480 * s.genome_id + 45 +
			(s.genome_id * 30); // + 45 + (s.genome_id * 30);

		links[key].ribbon[1].target.x = s.x + s.width *
			(value.source.end / s.value);
		links[key].ribbon[1].target.y = 480 * s.genome_id + 45 +
			(s.genome_id * 30); // + 45 + (s.genome_id * 30);

		links[key].source.index = s.index;
		links[key].source.value = Math.abs(value.source.end -
			value.source.start);

		var t = fullKaryo[value.target.name];
		links[key].ribbon[0].target.x = t.x + t.width *
			(value.target.start / t.value);
		links[key].ribbon[0].target.y = 480 * t.genome_id + (s.genome_id * 15); // - 45
		// +
		// (t.genome_id
		// *
		// 45);
		links[key].ribbon[1].source.x = t.x + t.width *
			(value.target.end / t.value);
		links[key].ribbon[1].source.y = 480 * t.genome_id + (s.genome_id * 15); // - 45
		// +
		// (t.genome_id
		// *
		// 45);
		links[key].target.index = t.index;
		links[key].target.value = Math.abs(value.target.end -
			value.target.start);
	});
	var array = $.map(fullKaryo, function(value, index) {
		return [value];
	});
	karyo = array;
	var sourceName;
	var targetName;
	var line;
	for (var i = 0; i < links.length; i++) {
		sourceName = links[i].source.name;
		targetName = links[i].target.name;
		var key;
		for (var j = 0; j < karyo.length; j++) {
			if (sourceName == karyo[j].name) {

				line = karyo[j].genome_id;
				key = links[i].ribbon;
				key[0].source.line = line;
				key[1].source.line = line;
			}
		}
		for (var k = 0; k < karyo.length; k++) {
			if (targetName == karyo[k].name) {
				line = karyo[k].genome_id;

				key = links[i].ribbon;
				key[0].target.line = line;
				key[1].target.line = line;
			}
		}
	}

	return links;
}

function loadKaryoFile(file, callback) {
	$.getJSON(file, function(data) {
		if (typeof callback !== "undefined") {
			callback(data);
		}
	});
	return file;
}



function loadLinkFile(file, karyo, callback) {
	$.getJSON(file, function(data) {
		if (typeof callback !== 'undefined') {
			callback(data);
		}
	});
	return file;
}

var width = 1200;
var height = 3000;

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
			return d.x;
		})
		.attr("y", function(d){
			return 500 * d.genome_id; 
		})
		.attr("width", function(d) {
			return d.width;
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
