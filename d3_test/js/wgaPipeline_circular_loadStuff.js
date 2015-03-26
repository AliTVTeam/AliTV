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
		var endAngle = karyo[key].endAngle;
		var startAngle = karyo[key].startAngle;
		karyo[key] = {
				"value" : karyo[key].value,
				"startAngle" : endAngle,
				"index" : karyo[key].index,
				"genome_id" : karyo[key].genome_id,
				"name" : karyo[key].name,
				"endAngle" : startAngle,
				"rc" : false
			};
	return karyo;
}








