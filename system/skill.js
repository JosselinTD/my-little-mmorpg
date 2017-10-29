module.exports = class Skill {
	constructor(name, maxLevel=10, costFunction=defaultCost, level=0) {
		this.name = name;
		this.maxLevel = maxLevel;
		this.costFunction = costFunction;
		this._level = level;
	}

	get level() {
		return this._level;
	}

	improveLevel() {
		if (this._level === this.maxLevel) {
			throw new Error('Max level already reached');
		}
		this._level++;
		return this;
	}

	improveAmount() {
		return this.costFunction();
	}

	canImprove(amount) {
		return amount >= this.costFunction();
	}
}

function defaultCost() {
	return this.level * this.level;
}
