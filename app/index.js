require('marko/compiler').configure({ writeToDisk: false });
require('marko/node-require').install();
require('marko/hot-reload').enable();

const http = require('http');

const Toisu = require('toisu');
const Router = require('toisu-router');
const body = require('toisu-body');
const static = require('toisu-static');

var marko = require('./marko');

var homeTemplate = require('./home.marko');

module.exports = function() {
	const app = new Toisu();

	app.use(body.form());
	app.use(generateRouter().middleware);
	app.use(static('game'));
	app.use(static('node_modules/craftyjs/dist'));

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

	router.route('/game-data', {
		GET: [gameData]
	});

	return router;
}

function home(req, res) {
	marko(homeTemplate, res);
}

function gameData(req, res) {
	res.writeHead(200, {"Content-Type": "text/javascript"});
	var content = `var gameDatas = ${JSON.stringify(require('../datas/paths.json'))}`;
	res.end(content);
}

module.exports();
