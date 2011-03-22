#!/usr/bin/env node
// if you're looking for an entry point, begin reading at line 130

// requires
var http = require('http');
var qs = require('querystring');
var url = require('url');

function fetch (data, callback) {
	var url = meme_generator.url;
	var post = qs.stringify(data);
	console.log('dump post: %s', post);
	var options = {
		host: url.hostname,
		port: url.port || 80,
		path: url.pathname,
		method: 'POST',
	};
	options.headers = {
		'Content-Type': 'application/x-www-form-urlencoded'
	};
	console.log('dump options', options);
	var req = http.request(options);
	req.on('error', function(error) {
		return callback(error);
	});
	req.on('response', function(res) {
		res.setEncoding('utf8');
		if(res.statusCode !== 302) {
			return callback(new Error("Got error "+res.statusCode));
		}
		if(!res.headers.location) {
			return callback(new Error("No location header"));
		}
		callback(null, url.host+res.headers.location+'.jpg');
	});
	req.end(post+'\n');
}


/**
 * creates an advice-dog type of meme
 *
 * two lines of text only
 */
function simple (id, template_name, first_line) {
	// return a closured function that fetches the link
	// page and looks for the link
	var res = function(line1, line2) {
		var cb = [].pop.call(arguments);
		// construct the data to post
		var data = {
			templateType: 'AdviceDogSpinoff',
			templateID: id,
			generatorName: template_name
		};
		if(first_line) [].unshift.call(arguments, first_line);
		for (var i = 0; i < arguments.length; ++i) {
			data['text'+i] = arguments[i];
		};
		fetch(data, cb);
	}
	res.id = id;
	res.template_name = template_name;
	res.first_line = first_line;
	return res
}

/**
 * general info
 */
var meme_generator = {
	version: '0.1.0',
	url: url.parse('http://memegenerator.net/Instance/CreateOrEdit'),
	//url: url.parse('http://localhost:3000/Instance/CreateOrEdit'),
	// I could do the trick with the user agent thing. CAN HAZ MOTIVATION?
	memes: {
		ANTEATER: simple(41191, 'Anteater'),
		V_BABY: simple(11140, 'Victory-Baby')
	}
}

// beginning program
// parse args and then do things

if(process.argv.length < 3) {
	console.log("meme [GENERATOR|--list] LINE [ADDITIONAL_LINES]");
	process.exit();
}

if(process.argv[2] === '--list') {
	for(var key in meme_generator.memes) {
		console.log("%s: %s", key, meme_generator.memes[key].template_name)
	}
	process.exit();
}

// that was the easy part

var symbol = process.argv[2];
var text = process.argv.slice(3);
if(!(symbol in meme_generator.memes)) {
	console.error('unknown meme %s',symbol);
	console.error('use --list to see what is available');
	process.exit(1);
} 

text.push(function callback(err, link) {
	console.log('in master callback')
	if(err) {
		throw(err);
		process.exit(2);
	}
	console.log(link);
})

// this has to be the most complicated line of all this
meme_generator.memes[symbol].apply(null, text);
