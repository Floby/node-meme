var fs = require('fs');

exports.parseMemes = function parseMemes (maker) {
    var result = {};
    var raw = fs.readFileSync(__dirname+'/../data/memes.csv', 'utf8');
    var split = raw.split(/\r\n|\r|\n/gm);
    for (var i = 0; i < split.length; ++i) {
        var line = split[i].split(',');
        if(line.length < 4) continue;
        var type = line.shift().trim();
        for (var j = 0; j < line.length; ++j) {
            try {
                line[j] = JSON.parse(line[j]);
            }
            catch(e) {
                console.error('failed to parse %s', line[j]);
                throw(e);
            }
        };
        var name = line.shift();
        line.unshift(type);
        result[name] = maker.apply(null, line);
    };
    return result;
}

