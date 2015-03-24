//Width und height legen die Zeichenfläche fest
var width = 1200;
var height = 3000;
var identity = {percent: ["Identity", "<46 %", "50 %", "54 %", "58 %", "62 %", "66 %", "70 %", "74 %", "78 %", "82 %", "86 %", "90 %", "94 %", ">98 %"], 
				color: ["white", "#FF1600", "#FF3500", "#FF5300", "#FF7C01", "#FF9B01", "#FFC301", "#FFE201", "#EBDD02", "#CCD602", "#B7D103", "#99C905", "#7AC206", "#51B807", "#32B008"]};

var fill = d3.scale.category20c();
//svg ist die zentrale Zeichenfläche, die alle Elemente der linearen wgaPipeline enthält
var svg = d3.select("body").append("svg").attr("width", width).attr("height",
		height).append("g");

var legendRectSize = 18;
var legendSpacing = 4;

//div ist der Tooltip
var div = d3.select("body").append("div")
	.attr("class", "tooltip")
	.style("opacity", 0);

	div.append("div")
		.attr("class", "label")
		
var legend = svg.selectAll('.legend')
			.data(identity.percent)
            .enter()
            .append('g')
            .attr('class', 'legend')


for(var i=0;i<=14;i++){
var pos_x = 200;
var pos_y = -370 + i*25;
var pos_x_text = 505;
var pos_y_text = -352 + i*25;
legend.append('rect')
	.attr('x', pos_x)
	.attr('y', pos_y)
    .attr('width', legendRectSize)
    .attr('height', legendRectSize)                                   
    .style('fill', identity.color[i])
    .style('stroke', identity.color[i]);


legend.append('text')
	.attr('x', pos_x_text + legendSpacing)
	.attr('y', pos_y_text - legendSpacing)
	.text(identity.percent[i]);
}


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
			full_links = links;
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
	
	addTicks(array);
}

// This function is adjusted from:
// http://stackoverflow.com/questions/26567104/d3-js-fill-area-between-to-diagonals
// thanks to user 'meetamit'
function getRibbon(links) {
	for(var i=0;i<links.length;i++){
		var difference = links[i].target.line - links[i].source.line;
		if(difference==1){
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
	}
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
	var k = d.width / d.value;
	console.log(k);
	return d3.range(0, d.value, 10000).map(function(v, i) {
		return {
			tick : v * k + d.x,
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
	var genome_order={};
	var line = 0;
	var lastLine;
	for(var i=0;i<data.order.length;i++){
		var key = data.order[i];
		genome_order[key] = {
				"line":line
		}
		line = line + 1;
	}
	
	$.each(genome_order, function(key, value){
		console.log(key);
		lastLine=value.line
	})

	var total=[];
	var current=[];
	for(var i=0;i<lastLine;i++){
		total.push(0);
		current.push(0);
	}

	var spacer = set_spacer(data);
	$.each(data.chromosomes, function(key, value) {
		total[value.genome_id] += value.length + spacer;
	});
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
	console.log(data.chromosomes);
	//return data.genome_order;
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
			x : 1,
			y : 1
		}, {
			source : {
				x : 0,
				y : 0
			},
			target : {
				x : 0,
				y : 0
			},
			x : 1,
			y : 1
		} ];
		var s = karyo[value.source.name];
		
		links[key].ribbon[0].source.x = s.x + s.width
				* (value.source.start / s.value);
		links[key].ribbon[0].source.y = 480 * s.genome_id + 45 + (s.genome_id * 30); // + 45 + (s.genome_id * 30);
		
		links[key].ribbon[1].target.x = s.x + s.width
				* (value.source.end / s.value);
		links[key].ribbon[1].target.y = 480 * s.genome_id + 45 + (s.genome_id * 30); // + 45 + (s.genome_id * 30);
		
		links[key].source.index = s.index;
		links[key].source.value = Math.abs(value.source.end
				- value.source.start);
		
		var t = karyo[value.target.name];
		
		
		links[key].ribbon[0].target.x = t.x + t.width
				* (value.target.start / t.value);
		links[key].ribbon[0].target.y = 480 * t.genome_id + (s.genome_id * 15); // - 45 + (t.genome_id * 45);
		links[key].ribbon[1].source.x = t.x + t.width
				* (value.target.end / t.value);
		links[key].ribbon[1].source.y = 480 * t.genome_id + (s.genome_id * 15); // - 45 + (t.genome_id * 45);
		links[key].target.index = t.index;
		links[key].target.value = Math.abs(value.target.end
				- value.target.start);
	});
	
	var array = $.map(karyo, function(value, index) {
		return [ value ];
	});
	karyo = array;
	var sourceName;
	var targetName;
	var line;
	for(var i=0;i<links.length;i++){
		sourceName = links[i].source.name;
		targetName = links[i].target.name;
		for(var j=0;j<karyo.length;j++){
			if(sourceName==karyo[j].name){
				
				line = karyo[j].genome_id;
				var key = links[i].ribbon;
				key[0].source.line = line;
				key[1].source.line = line;
			}
		}
		for(var k=0;k<karyo.length;k++){
			if(targetName==karyo[k].name){
				line = karyo[k].genome_id;
				
				var key = links[i].ribbon;
				key[0].target.line = line;
				key[1].target.line = line;
			}
		}
	}

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
	console.log(spacer);
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





