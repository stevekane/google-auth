var _ = require('lodash')
  , uuid = require('node-uuid');

//extremely basic database object
function Database (models, tables) {
  _.extend(this, models);
  _.extend(this, tables);
};

//utility function used in "find" and other high order functions
function findByKVPair (key, value) {
  return function (model) {
    return model[key] === value; 
  }
}

Database.prototype.findOrCreate = function (modelName, tableName, keyName, value, callback) {
  //if this isnt a valid tableName, return early with an error
  if (!_.has(this, tableName)) {
    callback(tableName + "is not a field in the database", null);
    return;
  }

  //if this isnt a valid modelName, return early with error
  if (!_.has(this, modelName)) {
    callback(modelName + "is not a model in the database", null);
    return;
  }
  
  var models = this[tableName]
    , Constructor = this[modelName]
    , findMatchingModel = findByKVPair(keyName, value)
    , existingModel = (_.find(models, findMatchingModel));

  var model = (existingModel) ? existingModel : new Constructor({keyName: value});
  callback(model, null);
};

//Returns null if no model is found with provided k/v pair
Database.prototype.find = function (modelName, tableName, keyName, value, callback) {
  //if this isnt a valid tableName, return early with an error
  if (!_.has(this, tableName)) {
    callback(tableName + "is not a field in the database", null);
    return;
  }

  //if this isnt a valid modelName, return early with error
  if (!_.has(this, modelName)) {
    callback(modelName + "is not a model in the database", null);
    return;
  }
  
  var models = this[tableName]
    , findMatchingModel = findByKVPair(keyName, value)
    , existingModel = (_.find(models, findMatchingModel));

  var model = (existingModel) ? existingModel : null;
  callback(null, model);
};

//Returns null if no model is found with provided id
Database.prototype.findById = function (modelName, tableName, id, callback) {
  //if this isnt a valid tableName, return early with an error
  if (!_.has(this, tableName)) {
    callback(tableName + "is not a field in the database", null);
    return;
  }

  //if this isnt a valid modelName, return early with error
  if (!_.has(this, modelName)) {
    callback(modelName + "is not a model in the database", null);
    return;
  }
  
  var models = this[tableName]
    , findMatchingModel = findByKVPair("id", id)
    , existingModel = (_.find(models, findMatchingModel));

  var model = (existingModel) ? existingModel : null;
  callback(model, null);
};

//Very basic User Model
function User (hash) {
  _.extend(this, hash);
  this.id = uuid.v4();
  return this;
};

module.exports = {
  Database: Database,
  User: User
}
