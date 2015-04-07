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
