var Skill = require('./skill');

module.exports = class Path {
	constructor(name, experience=0, levelFunction=defaultLevel, maxLevel=50, skillsTree = []) {
		this.name = name;
		this.maxLevel = maxLevel;
		this._levelFunction = levelFunction;
		this._experience = experience
		this._skillsTree = skillsTree;
	}

	get skillsTree() {
		return this._skillsTree.sort((a, b) => a.level - b.level);
	}

	get experience() {
		return this._experience;
	}

	get level() {
		return this.levelFunction();
	}

	addSkill(level, skill) {
		if (level > this.maxLevel) {
			throw new Error('Level too high');
		}
		if (!skill instanceof Skill) {
			throw new Error('skill must be an instance of Skill');
		}
		if (this.skillsTree.find(s => s.skill.name === skill.name)) {
			throw new Error('Skill already added');
		}

		this._skillsTree.push({level, skill});
	}

	addExperience(amount) {
		var previousLevel = this.level;

		this._experience += amount;

		var newLevel = this.level;

		if (previousLevel !== newLevel) {
			return this.skillsTree.filter(s => s.level === newLevel).map(s => s.skill);
		}
		return [];
	}
}

function defaultLevel() {
	return Math.floor(Math.sqrt(this.experience));
}
