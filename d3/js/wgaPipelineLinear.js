function getRibbon(links) {

	for (var i = 0; i < links.length; i++) {
		var difference = links[i].ribbon[0].target.line - links[i].ribbon[0].source.line;
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
		var difference = links[i].ribbon[0].target.line - links[i].ribbon[0].source.line;
		if (difference == 1) {
			return true;
		}
	}
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
var svg;

function createSimpleSvg() {
	var that = {};
	var data = null;

	var array = $.map(karyo, function(value, index) {
		return [value];
	});

	that.setData = function(d) {
		data = d;
	};

	that.getData = function() {
		return data;
	};

	that.render = function() {
		var svg = d3.select("body")
			.append("svg")
			.attr("width", width)
			.attr("height", height)
			.append("g");
	};

	return that;
}

function drawKaryo(karyo) {
	karyo = $.map(karyo, function(value, index) {
		return [value];
	});
	svg = d3.select("#drawingArea")
		.attr("width", width)
		.attr("height", height)
		.append("g");

	svg.append("g")
		.selectAll("path")
		.attr("class", "karyo")
		.data(karyo)
		.enter()
		.append("rect")
		//		.on("mouseover", function(g, i) {
		//			fade(g, i, 0.1);
		//			add_tooltip_legend(g);
		//		})
		//		.on("mouseout", function(g, i) {
		//			fade(g, i, 1);
		//			reAdd_tooltip_legend();
		//		})
		.on("click", function(g, i) {
			fade(g, i, 0.1);
			console.log("Hello");
		})
				.style(
					"fill",
					function(d) {
						return fill(d.index);
					})
				.style("stroke", function(d) {
					return fill(d.index);
				})
		.attr("x", function(d) {
			return d.x;
		})
		.attr("y", function(d) {
			return 500 * d.genome_id;
		})
		.attr("width", function(d) {
			return d.width;
		})
		.attr("height", 30);

	return true;
}

function fade(g, i, opacity) {
	svg.selectAll(".chord path")
		.filter(function(d) {
			//		return d.source.index != g.index && d.target.index != g.index;
		})
		.transition()
		.style("opacity", opacity);
}

var fill = d3.scale.category20c();

function clear_chords() {
	svg.selectAll(".chord path").remove();
}

function addTicks(array) {
	var ticks = svg.append("g")
		.selectAll("g")
		.data(array)
		.enter()
		.append("g")
		.selectAll("g")
		.data(groupTicks)
		.enter()
		.append("g")

	ticks.append("line").attr("x1", 1).attr("y1", 0).attr("x2", 5)
		.attr("y2", 0).style("stroke", "#000");

	ticks.append("text").attr("x", 8).attr("dy", ".35em").text(function(d) {
		return d.label;
	});
}

//Returns an array of tick angles and labels, given a group.
function groupTicks(d) {
	var k = (d.endAngle - d.startAngle) / d.value;
	return d3.range(0, d.value, 10000).map(function(v, i) {
		return {
			angle: v * k + d.startAngle,
			label: i % 5 ? null : v / 1000 + "k"
		};
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