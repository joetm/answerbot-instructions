'use strict';

const express = require('express'),
	request = require('request'),
	winston = require('winston'),
	cheerio = require('cheerio'),
    exphbs  = require('./express-handlebars/'); // "express-handlebars"

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log` 
    // - Write all logs error (and below) to `error.log`.
    //
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
// 
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

const app = express();
app.engine('handlebars', exphbs({
	defaultLayout: 'searchresult',
	// extname: '.hbs',
	partialsDir: 'views/partials'
}));
app.set('view engine', 'handlebars');


app.get('/search/', function (req, res) {
	logger.info(`GET: ${req.path}`);

	logger.info(`FETCHING Google results`);
	request('https://www.google.com/search?safe=on&source=hp&q=cure+back+pain', function (error, response, body) {
		console.log('error:', error); // Print the error if one occurred
		console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received

		const $ = cheerio.load(body)

		const fragment = $('#ires').html();
		// console.log('fragment', fragment);

		const pagination = $('#nav').html();
		// console.log('pagination', pagination);

	    res.render('search', {
	    	fragment,
	    	pagination
	    });
	});
});

app.get('/', function (req, res) {
	logger.info('GET: /');
    res.render('home', {
    	layout: false
    });
});

app.listen(3000, function () {
    console.log('API ready and listening on: http://localhost:3000');
});
