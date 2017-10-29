var Path = require('./path');

module.exports = class PathHandler {
	constructor(paths = []) {
		this._paths = paths;
	}

	get paths() {
		return this._paths;
	}

	addPath(path) {
		if (!path instanceof Path) {
			throw new Error('path must be an instance of Path');
		}
		if (this._paths.find(p => p.name === path.name)) {
			throw new Error('path already added');
		}
		this._paths.push(path);
		return this;
	}
}
