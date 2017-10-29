require('marko/compiler').configure({ writeToDisk: false });
require('marko/node-require').install();
require('marko/hot-reload').enable();

const http = require('http');

const Toisu = require('toisu');
const Router = require('toisu-router');
const body = require('toisu-body');

var marko = require('./marko');

var homeTemplate = require('./home.marko');

module.exports = function() {
	const app = new Toisu();

	app.use(body.form());
	app.use(generateRouter().middleware);

	app.handleError = function(req, res, err) {
		console.log(err);
		res.end('Whoops, error');
	}

	http.createServer(app.requestHandler).listen(3000);
}

function generateRouter() {
	const router = new Router();

	router.route('/', {
		GET: [home]
	});

	return router;
}

function home(req, res) {
	marko(homeTemplate, res);
}

module.exports();
