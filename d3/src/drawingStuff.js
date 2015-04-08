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
		.append("g");

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

