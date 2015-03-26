function loadKaryoFile(file, callback) {
	$.getJSON(file, function(data) {
		var karyo = karyo_to_coords(data);
		if (typeof callback !== "undefined") {
			callback(karyo);
		}
	});
}

function loadLinkFile(file, karyo, callback) {
	$.getJSON(file, function(data) {
		var links = link_to_coords(data, karyo);
		if (typeof callback !== 'undefined') {
			callback(links);
		}
	});
}

function create_new_karyo(karyo, g){
	var key = g.name;
	var x = karyo[key].x + karyo[key].width;
	var width = karyo[key].width * (-1);
	karyo[key] = {
			"value" : karyo[key].value,
			"index" : karyo[key].index,
			"x" : x,
			"width": width,
			"genome_id" : karyo[key].genome_id,
			"name" : key,
			"rc" : karyo[key].rc
		};
return karyo;
}





