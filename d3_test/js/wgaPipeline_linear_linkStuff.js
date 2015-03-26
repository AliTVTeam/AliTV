function link_to_coords(links, karyo) {
	$.each(links, function(key, value) {
		
		links[key].ribbon = [ {
			source : {
			x : 0,
			y : 0
		},
		target : {
			x : 0,
			y : 0
		},
		x : 1,
		y : 1
		}, {
			source : {
			x : 0,
			y : 0
		},
		target : {
			x : 0,
			y : 0
		},
		x : 1,
		y : 1
		} ];
		var s = karyo[value.source.name];
		
		links[key].ribbon[0].source.x = s.x + s.width
		* (value.source.start / s.value);
		links[key].ribbon[0].source.y = 480 * s.genome_id + 45 + (s.genome_id * 30); // + 45 + (s.genome_id * 30);
		
		links[key].ribbon[1].target.x = s.x + s.width
		* (value.source.end / s.value);
		links[key].ribbon[1].target.y = 480 * s.genome_id + 45 + (s.genome_id * 30); // + 45 + (s.genome_id * 30);
		
		links[key].source.index = s.index;
		links[key].source.value = Math.abs(value.source.end
				- value.source.start);
		
		var t = karyo[value.target.name];
		
		
		links[key].ribbon[0].target.x = t.x + t.width
		* (value.target.start / t.value);
		links[key].ribbon[0].target.y = 480 * t.genome_id + (s.genome_id * 15); // - 45 + (t.genome_id * 45);
		links[key].ribbon[1].source.x = t.x + t.width
		* (value.target.end / t.value);
		links[key].ribbon[1].source.y = 480 * t.genome_id + (s.genome_id * 15); // - 45 + (t.genome_id * 45);
		links[key].target.index = t.index;
		links[key].target.value = Math.abs(value.target.end
				- value.target.start);
	});
	
	var array = $.map(karyo, function(value, index) {
		return [ value ];
	});
	karyo = array;
	var sourceName;
	var targetName;
	var line;
	for(var i=0;i<links.length;i++){
		sourceName = links[i].source.name;
		targetName = links[i].target.name;
		for(var j=0;j<karyo.length;j++){
			if(sourceName==karyo[j].name){
				
				line = karyo[j].genome_id;
				var key = links[i].ribbon;
				key[0].source.line = line;
				key[1].source.line = line;
			}
		}
		for(var k=0;k<karyo.length;k++){
			if(targetName==karyo[k].name){
				line = karyo[k].genome_id;
				
				var key = links[i].ribbon;
				key[0].target.line = line;
				key[1].target.line = line;
			}
		}
	}
	
	return links;
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

// This function is adjusted from:
// http://stackoverflow.com/questions/26567104/d3-js-fill-area-between-to-diagonals
// thanks to user 'meetamit'
function getRibbon(links) {
	for(var i=0;i<links.length;i++){
		var difference = links[i].target.line - links[i].source.line;
		if(difference==1){
			var diagonal = d3.svg.diagonal().source(function(d) {
				return {
					"x" : d.source.x,
					"y" : d.source.y
				};
			}).target(function(d) {
				return {
					"x" : d.target.x,
					"y" : d.target.y
				};
				}).projection(function(d) {
					return [ d.x, d.y ];
				});
			var path1 = diagonal(links[0]);
			var path2 = diagonal(links[1]).replace(/^M/, 'L');
			var shape = path1 + path2 + 'Z';
			return shape;
		}	
	}
}

function drawLinks(links) {
	svg.append("g").attr("class", "chord").selectAll("path").data(links)
	 .enter().append("path").attr("d",
	 function(d) {return getRibbon(d.ribbon)}).style("fill",
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









