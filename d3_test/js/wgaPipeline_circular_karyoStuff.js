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









