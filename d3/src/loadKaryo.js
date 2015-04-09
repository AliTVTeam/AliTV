/** 
 * Load the karyo file and call the callback
 * @author Markus Ankenbrand <markus.ankenbrand@uni-wuerzburg.de> 
 * @param {string} file - Path to the karyo.json file to load.
 * @param {loadKaryoCallback} callback - The callback function to call after successfully loading the file, passes the content of the file as the first parameter.
 * @example
 * // calls an anonymous function, that logs the content of karyo.json to the console
 * loadKaryoFile('karyo.json', function(data){
 * 	console.log(data);
 * });
 */
function loadKaryoFile(file, callback) {
	$.getJSON(file, function(data) {
		if (typeof callback !== "undefined") {
			callback(data);
		}
	});
	return file;
}

/**
 * This callback handles the response.
 * @callback loadKaryoCallback
 * @param {object} data - Content of json file as js object
 */
