var Skill = require('./skill');

module.exports = class SkillHandler {
	constructor(skills = []) {
		this._skills = skills;
	}

	get skills() {
		return this._skills;
	}

	addSkill(skill) {
		if (!skill instanceof Skill) {
			throw new Error('skill must be an instance of Skill');
		}
		if (this._skills.find(s => s.key === skill.key)) {
			throw new Error('skill already added');
		}
		this._skills.push(skill);
		return this;
	}

	improvableSkills(amount) {
		return this._skills.filter(s => s.canImprove(amount));
	}

	improveSkill(skill) {
		skill = this._skills.find(s => s.key === skill.key);
		if (!skill) {
			throw new Error('skill unknown');
		}
		skill.improveLevel();
		return this;
	}
}
