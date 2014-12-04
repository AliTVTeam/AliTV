var width = 960, 
	height = 800, 
	innerRadius = Math.min(width, height) * .41, 
	outerRadius = innerRadius * 1.1;

var fill = d3.scale.ordinal().domain(d3.range(5)).range(
		[ "#000000", "#FFDD89", "#957244", "#F26223", "#00FF00" ]);

function fillByLength(length){
	if(length < 10000){
		return "#FF0000";
	}
	else if(length < 50000){
		return "#FFDD00";
	}
	else{
		return "#00FF00";
	}
}

function fillByIdy(identity){
	if(identity < 90){
		return "#FF0000";
	}
	else if(identity < 95){
		return "#FFDD00";
	}
	else{
		return "#00FF00";
	}
}

var svg = d3.select("body").append("svg").attr("width", width).attr("height",
		height).append("g").attr("transform",
		"translate(" + width / 2 + "," + height / 2 + ")");

function drawKaryo(karyo) {
	svg.append("g").selectAll("path").data(karyo).enter().append("path").style(
			"fill", function(d) {
				return fill(d.index);
			}).style("stroke", function(d) {
		return fill(d.index);
	})
			.attr(
					"d",
					d3.svg.arc().innerRadius(innerRadius).outerRadius(
							outerRadius)).on("mouseover", fade(.1)).on(
					"mouseout", fade(1));
	addTicks(karyo);
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
					d3.svg.chord().radius(innerRadius)).style("fill",
					function(d) {
					//	return fillByLength(Math.abs(d.target.end - d.target.start));
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
	        if(typeof callback !== "undefined"){
		    callback(karyo);
		}
	});
}

function karyo_to_coords(data) {
	var total = 0;
	var spacer = 10000;
	$.each(data, function(key, value) {
		total += value + spacer;
	});
	var current = 0;
	var index = 0;
	$.each(data, function(key, value) {
		data[key] = {
			"value" : value,
			"startAngle" : ((current + spacer) / total) * (2 * Math.PI),
			"index" : index++
		};
		current += value + spacer;
		data[key].endAngle = (current / total) * (2 * Math.PI);
	});
	return data;
}

function loadLinkFile(file, karyo, callback) {
	$.getJSON(file, function(data) {
		var links = link_to_coords(data, karyo);
		if(typeof callback !== 'undefined'){
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
function fade(opacity) {
	return function(g, i) {
		svg.selectAll(".chord path").filter(function(d) {
			return d.source.index != i && d.target.index != i;
		}).transition().style("opacity", opacity);
	};
}
