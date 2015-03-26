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
	return data.chromosomes;
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
	
	//addTicks(array);
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






