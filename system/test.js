require('should');

var Skill = require('./skill');
var SkillHandler = require('./skill-handler.js');

var taper = new Skill(1, 'taper');

taper.should.have.property('level').eql(0);
taper.improveAmount().should.eql(0);

taper.improveLevel();

taper.should.have.property('level').eql(1);
taper.improveAmount().should.eql(1);

taper.improveLevel();

taper.should.have.property('level').eql(2);
taper.improveAmount().should.eql(4);
taper.canImprove(3).should.eql(false);
taper.canImprove(4).should.eql(true);
taper.canImprove(5).should.eql(true);

var gamer = new SkillHandler

gamer.should.have.property('skills').eql([]);

gamer.addSkill(taper);

gamer.should.have.property('skills').length(1);
gamer.skills[0].should.be.eql(taper);

gamer.should.have.property('improvableSkills');
gamer.improvableSkills(0).should.have.length(0);

gamer.improvableSkills(4).should.have.length(1);
gamer.improvableSkills(4)[0].should.be.eql(taper);

console.log('Test passed');
