var width = 1200, height = 800, innerRadius = Math.min(width, height) * .41, outerRadius = innerRadius * 1.1;
var identity = {percent: ["Identity", "<46 %", "50 %", "54 %", "58 %", "62 %", "66 %", "70 %", "74 %", "78 %", "82 %", "86 %", "90 %", "94 %", ">98 %"], 
				color: ["white", "#FF1600", "#FF3500", "#FF5300", "#FF7C01", "#FF9B01", "#FFC301", "#FFE201", "#EBDD02", "#CCD602", "#B7D103", "#99C905", "#7AC206", "#51B807", "#32B008"]};
// var fill = d3.scale.ordinal().domain(d3.range(5)).range(
// [ "#000000", "#FFDD89", "#957244", "#F26223", "#00FF00" ]);

// var fill = d3.scale.ordinal()
// .domain(d3.range(5))
// .range(["#2C06B5", "#0AF7EF"]);


var svg = d3.select("body").append("svg").attr("width", width).attr("height",
		height).append("g").attr("transform",
		"translate(" + width / 2 + "," + height / 2 + ")");
var fill = d3.scale.category20c();
var legendRectSize = 18;
var legendSpacing = 4;
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
var pos_x = 480;
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
	console.log(karyo);
	console.log(array);
	svg.append("g").attr("class", "karyo")
		.selectAll("path")
		.data(array)
		.enter()
		.append("path")
		.style(
			"fill", function(d) {
				return fill(d.index);
			})
		.style("stroke", function(d) {
		return fill(d.index);
		})
		
		.attr(
				"d",
				d3.svg.arc()
					.innerRadius(innerRadius)
					.outerRadius(outerRadius)
				)
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
			addTicks(array);
			loadLinkFile("data/link.json", karyo, function(links) {
				full_links = links;
				redraw(identity_range, min_length);
			});
		})
	addTicks(array);
}

function addTicks(array) {
	var ticks = svg.append("g").attr("class","ticks").selectAll("g").data(array).enter().append("g")
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
					d3.svg.chord().radius(innerRadius)).style("fill",
					function(d) {
						// return fillByLength(Math.abs(d.target.end -
						// d.target.start));
						return fillByIdy(Math.abs(d.identity));
					}).style("opacity", 1);
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
	var total = 0;
	var spacer = set_spacer(data);
	$.each(data.chromosomes, function(key, value) {
		total += value.length + spacer;
	});
	var current = 0;
	var index = 0;
	for (var i=0;i<data.order.length;i++){
		var key = data.order[i];
		var value = data.chromosomes[key];
		data.chromosomes[key]={
			"value" : value.length,
			"startAngle" : ((current + spacer) / total) * (2 * Math.PI),
			"index" : index++,
			"genome_id" : value.genome_id,
			"name" : key,
			"rc" : value.rc
		};		
		current += value.length + spacer;
		data.chromosomes[key].endAngle = (current / total) * (2 * Math.PI);


		if(value.rc==true){
			var startAngle = data.chromosomes[key].startAngle;
			var endAngle = data.chromosomes[key].endAngle;
			data.chromosomes[key].startAngle = endAngle;
			data.chromosomes[key].endAngle = startAngle;
		}
		
		}
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
		var s = karyo[value.source.name];
		var s_totalAngle = s.endAngle - s.startAngle;
		links[key].source.startAngle = s.startAngle + s_totalAngle
				* (value.source.start / s.value);
		links[key].source.endAngle = s.startAngle + s_totalAngle
				* (value.source.end / s.value);
		links[key].source.index = s.index;
		links[key].source.value = Math.abs(value.source.end
				- value.source.start);
		var t = karyo[value.target.name];
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

// Returns an event handler for fading a given chord group.
function fade(g, i, opacity) {
	svg.selectAll(".chord path")
	.filter(function(d) {
		return d.source.index != g.index && d.target.index != g.index;
	})
	.transition()
	.style("opacity", opacity);
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

function set_slider(){
	//console.log(karyo);
	return 10000;
}

function create_new_karyo(karyo, g){
	var key = g.name;
		var endAngle = karyo[key].endAngle;
		var startAngle = karyo[key].startAngle;
		karyo[key] = {
				"value" : karyo[key].value,
				"startAngle" : endAngle,
				"index" : karyo[key].index,
				"genome_id" : karyo[key].genome_id,
				"name" : karyo[key].name,
				"endAngle" : startAngle,
				"rc" : false
			};
	return karyo;
}








