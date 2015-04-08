function link_to_coords(links, karyo) {
	$.each(links, function(key, value) {
		var s = karyo[value.source.name];
		var s_totalAngle = s.endAngle - s.startAngle;
		links[key].source.startAngle = s.startAngle + s_totalAngle *
				(value.source.start / s.value);
		links[key].source.endAngle = s.startAngle + s_totalAngle *
				(value.source.end / s.value);
		links[key].source.index = s.index;
		links[key].source.value = Math.abs(value.source.end -
				value.source.start);
		var t = karyo[value.target.name];
		var t_totalAngle = t.endAngle - t.startAngle;
		links[key].target.endAngle = t.startAngle + t_totalAngle *
				(value.target.start / t.value);
		links[key].target.startAngle = t.startAngle + t_totalAngle *
				(value.target.end / t.value);
		links[key].target.index = t.index;
		links[key].target.value = Math.abs(value.target.end -
				value.target.start);
	});
	return links;
}