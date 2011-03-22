#!/usr/bin/env node

// requires
var http = require('http');




/**
 * creates an advice-dog type of meme
 *
 * two lines of text only
 */
function simple (id, template_name, first_line) {
	var res = function() {
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
	// I could do the trick with the user agent thing. CAN HAZ MOTIVATION?
	memes: {
		ANTEATER: simple(41191, 'Anteater'),
		V_BABY: simple(11140, 'Victory Baby')
	}
}

// beginning program
// parse args and then do things

if(process.argv.length < 3) {
	console.log("meme [GENERATOR|--list] LINE [ADDITIONAL_LINES]");
	process.exit();
}

if(process.argv[2] === '--list') {
	console.log('coucou')
	for(var key in meme_generator.memes) {
		console.log("%s: %s", key, meme_generator.memes[key].template_name)
	}
	process.exit();
}

// that was the easy part

var symbol = process.argv[2];
var text = process.argv.slice(3);
if(!(symbol in meme_generator.memes)) {
	console.log('unknown meme %s',symbol);
	console.log('use --list to see what is available');
	process.exit(1);
} 

text.push(function callback(link) {
	console.log(link);
})

meme_generator.memes[symbol].apply(null, text);
