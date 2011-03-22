#!/usr/bin/env node
// if you're looking for an entry point, begin reading at line 92

// requires
var http = require('http');
var qs = require('querystring');
var url = require('url');

function fetch (data, callback) {
	var url = meme_generator.url; // this is JSON object
	var post = qs.stringify(data); // stringify into urlencoded
	var options = {
		host: url.hostname,
		port: url.port || 80,
		path: url.pathname,
		method: 'POST',
	};
	options.headers = {
		// do NOT forget this
		'Content-Type': 'application/x-www-form-urlencoded'
	};
	var req = http.request(options);
	req.on('error', function(error) {
		// send all errors to the global handler
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
		// we couldn't care less about the data
		// thanks to the fine url rewriting rules at memegenerator
		// we can assume that the image url is this
		callback(null, 'http://'+url.host+res.headers.location+'.jpg');
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
		var cb = [].pop.call(arguments); // arguments is no real array
		// construct the data to post
		var data = {
			templateType: 'AdviceDogSpinoff',
			templateID: id,
			generatorName: template_name
		};
		// add the default first line as first argument
		// TODO: improve this
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

	// meme SPARTA 'this is' 'Data!'
	memes: require('../lib/config').parseMemes(simple)
}

// beginning program
// parse args and then do things

// print usage when no arguments are provided
if(process.argv.length < 3) {
	console.log("meme [GENERATOR|--list] LINE [ADDITIONAL_LINES]");
	process.exit();
}

// list available memes when asked for it
if(process.argv[2] === '--list') {
	for(var key in meme_generator.memes) {
		m = meme_generator.memes[key];
		console.log("%s: %s%s",
			key,
			m.template_name,
			m.first_line ? ' -> '+m.first_line: ''
		)
	}
	process.exit();
}

// if one wants to see what a given meme is
if(process.argv[2] === 'view') {
	var sym = process.argv[3];
	var name = meme_generator.memes[sym].template_name;
	console.log('http://memegenerator.net/%s', name);
	process.exit();
}

// that was the easy part

var symbol = process.argv[2]; // the DEFINE-style name of the meme -> V_BABY
var text = process.argv.slice(3);
if(!(symbol in meme_generator.memes)) {
	// haha! you thought I was that dumb ?
	console.error('unknown meme %s',symbol);
	console.error('use --list to see what is available');
	process.exit(1);
} 

// add the callback as last arguments see last line
text.push(function callback(err, link) {
	if(err) {
		throw(err);
		process.exit(2); // useless as long as we keep throwing errors
	}
	console.log(link);
})

// this has to be the most complicated line of all this
// basically, find the function associated with a meme and call it
meme_generator.memes[symbol].apply(null, text);
