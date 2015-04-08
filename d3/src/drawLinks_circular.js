function drawLinks(links) {
	circularSvg.append("g").attr("class", "chord").selectAll("path").data(links)
			.enter().append("path").attr("d",
					d3.svg.chord().radius(innerRadius)).style("fill",
					function(d) {
						// return fillByLength(Math.abs(d.target.end -
						// d.target.start));
						return fillByIdy(Math.abs(d.identity));
					}).style("opacity", 1);
}