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
	



