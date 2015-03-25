//function link_to_coords(links, karyo) {
//	$.each(links, function(key, value) {
//		
//		links[key].ribbon = [ {
//			source : {
//				x : 0,
//				y : 0
//			},
//			target : {
//				x : 0,
//				y : 0
//			},
//			x : 1,
//			y : 1
//		}, {
//			source : {
//				x : 0,
//				y : 0
//			},
//			target : {
//				x : 0,
//				y : 0
//			},
//			x : 1,
//			y : 1
//		} ];
//		var s = karyo[value.source.name];
//		
//		links[key].ribbon[0].source.x = s.x + s.width
//				* (value.source.start / s.value);
//		links[key].ribbon[0].source.y = 480 * s.genome_id + 45 + (s.genome_id * 30); // + 45 + (s.genome_id * 30);
//		
//		links[key].ribbon[1].target.x = s.x + s.width
//				* (value.source.end / s.value);
//		links[key].ribbon[1].target.y = 480 * s.genome_id + 45 + (s.genome_id * 30); // + 45 + (s.genome_id * 30);
//		
//		links[key].source.index = s.index;
//		links[key].source.value = Math.abs(value.source.end
//				- value.source.start);
//		
//		var t = karyo[value.target.name];
//		
//		
//		links[key].ribbon[0].target.x = t.x + t.width
//				* (value.target.start / t.value);
//		links[key].ribbon[0].target.y = 480 * t.genome_id + (s.genome_id * 15); // - 45 + (t.genome_id * 45);
//		links[key].ribbon[1].source.x = t.x + t.width
//				* (value.target.end / t.value);
//		links[key].ribbon[1].source.y = 480 * t.genome_id + (s.genome_id * 15); // - 45 + (t.genome_id * 45);
//		links[key].target.index = t.index;
//		links[key].target.value = Math.abs(value.target.end
//				- value.target.start);
//	});
//	
//	var array = $.map(karyo, function(value, index) {
//		return [ value ];
//	});
//	karyo = array;
//	var sourceName;
//	var targetName;
//	var line;
//	for(var i=0;i<links.length;i++){
//		sourceName = links[i].source.name;
//		targetName = links[i].target.name;
//		for(var j=0;j<karyo.length;j++){
//			if(sourceName==karyo[j].name){
//				
//				line = karyo[j].genome_id;
//				var key = links[i].ribbon;
//				key[0].source.line = line;
//				key[1].source.line = line;
//			}
//		}
//		for(var k=0;k<karyo.length;k++){
//			if(targetName==karyo[k].name){
//				line = karyo[k].genome_id;
//				
//				var key = links[i].ribbon;
//				key[0].target.line = line;
//				key[1].target.line = line;
//			}
//		}
//	}
//
//	return links;
//}