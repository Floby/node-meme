#!/usr/bin/env node
// if you're looking for an entry point, begin reading at line 91

// requires
var http = require('http');
var qs = require('querystring');
var url = require('url');
var format = require('sprintf').sprintf;

function fetch (data, callback) {
    var url = meme_generator.url; // this is a JSON object
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
    // send all errors to the global handler
    req.on('error', callback);
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

var types = {
    adv: 'AdviceDogSpinoff',
    vert: 'Vertical'
}

/**
 * creates an advice-dog type of meme
 *
 * two lines of text only
 */
function maker (type, id, template_name, first_line) {
    // return a closured function that fetches the link
    // page and looks for the link
    var res = function(line1, line2) {
        var cb = [].pop.call(arguments); // arguments is no real array
        // construct the data to post
        var data = {
            templateType: types[type] || 'AdviceDogSpinoff',
            templateID: id,
            generatorName: template_name
        };
        // add the default first line as first argument
        // TODO: improve this
        if(first_line && !line2) [].unshift.call(arguments, first_line);
        for (var i = 0; i < arguments.length; ++i) {
            data['text'+i] = arguments[i];
        };
        fetch(data, cb);
    }
    // attach some data to help displaying lists
    res.id = id;
    res.template_name = template_name;
    res.first_line = first_line;
    return res
}


/**
 * general info
 */
var meme_generator = {
    version: '0.1.2',
    url: url.parse('http://memegenerator.net/Instance/CreateOrEdit'),
    // I could do the trick with the user agent thing. CAN HAZ MOTIVATION?

    // meme SPARTA 'this is' 'Data!'
    memes: require('../lib/config').parseMemes(maker)
}

// BEGIN MASTER PROGRAM
// parse args and then do things

// print usage when no arguments are provided
if(process.argv.length < 3) {
    console.log("meme [GENERATOR|--list] LINE [ADDITIONAL_LINES]");
    process.exit();
}

// list available memes when asked for it
if(process.argv[2] === 'list') {
    for(var key in meme_generator.memes) {
        m = meme_generator.memes[key];
        var str = format("%-20s %-30s ", key, m.template_name);
        if(m.first_line)
            str += 'first line: '+m.first_line;
        console.log(str);
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
    console.error('use `meme list` to see what is available');
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
