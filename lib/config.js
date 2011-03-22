var fs = require('fs');

exports.parseMemes = function parseMemes (simple) {
	var result = {};
	var raw = fs.readFileSync(__dirname+'/../data/memes.csv', 'utf8');
	var split = raw.split(/\r\n|\r|\n/gm);
	for (var i = 0; i < split.length; ++i) {
		var line = split[i].split(',');
		if(line.length <3) continue;
		for (var j = 0; j < line.length; ++j) {
		    line[j] = JSON.parse(line[j]);
		};
		var name = line.shift();
		result[name] = simple.apply(null, line);
	};
	return result;
}

