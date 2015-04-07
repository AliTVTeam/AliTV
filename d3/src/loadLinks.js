function loadLinkFile(file, karyo, callback) {
	$.getJSON(file, function(data) {
		if (typeof callback !== 'undefined') {
			callback(data);
		}
	});
	return file;
}
