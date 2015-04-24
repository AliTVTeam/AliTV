function getRibbon(links) {
	for (var i = 0; i < links.length; i++) {
		var difference = links[i].target.line - links[i].source.line;
		if (difference == 1) {
			var diagonal = d3.svg.diagonal().source(function(d) {
				return {
					"x": d.source.x,
					"y": d.source.y
				};
			}).target(function(d) {
				return {
					"x": d.target.x,
					"y": d.target.y
				};
			}).projection(function(d) {
				return [d.x, d.y];
			});
			var path1 = diagonal(links[0]);
			var path2 = diagonal(links[1]).replace(/^M/, 'L');
			var shape = path1 + path2 + 'Z';
			return shape;
		}
	}
}

function testLineDifference(links) {
	for (var i = 0; i < links.length; i++) {
		var difference = links[i].target.line - links[i].source.line;
		if (difference == 1) {
			return true;
		}
	}
}
