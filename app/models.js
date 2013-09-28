var uuid = require('node-uuid');

function User (name) {
  this.uuid = uuid.v4();
  this.name = name;
};

function Idea (content, killRating, owner, vote) {
  this.uuid = uuid.v4();
  this.content = content;
  this.killRating = killRating;
  this.owner = owner;
  this.vote = vote;
};

module.exports = {
  User: User,
  Idea: Idea
};
