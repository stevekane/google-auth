var hasMany = Ember.hasMany
  , belongsTo = Ember.belongsTo
  , attr = Ember.attr
  , alias = Ember.computed.alias;

window.App = Ember.Application.create();

App.Folder = Ember.Model.extend({
  
  id: attr(),
  name: attr(),
  parentFolder: belongsTo("App.Folder", {key: "parentFolder_id"}),
  folders: hasMany("App.Folder", {key: "folder_ids"})

});

App.Folder.adapter = Ember.FixtureAdapter.create();

App.Folder.FIXTURES = [
  {id: 1, name: "primary", folder_ids: [2,3,4], parentFolder_id: null},
  {id: 2, name: "pictures", folder_ids: [], parentFolder_id: 1},
  {id: 3, name: "documents", folder_ids: [8,9,10], parentFolder_id: 1},
  {id: 4, name: "memories", folder_ids: [], parentFolder_id: 1},
  {id: 5, name: "secondary", folder_ids: [6,7], parentFolder_id: null},
  {id: 6, name: "public", folder_ids: [], parentFolder_id: 5},
  {id: 7, name: "secrets", folder_ids: [], parentFolder_id: 5},
  {id: 8, name: "smarm", folder_ids: [], parentFolder_id: 3},
  {id: 9, name: "skunkworks", folder_ids: [], parentFolder_id: 3},
  {id: 10, name: "shims", folder_ids: [], parentFolder_id: 3},
];

App.IndexRoute = Ember.Route.extend({

  model: function (params) {
    return App.Folder.find(); 
  },

  setupController: function (controller, model) {
    controller.set('folders', model); 
  }

});

App.KaneFoldertreeComponent = Ember.Component.extend({
  
  activeFolder: null,

  //here we find the top level folders (by detecting no parent folder)
  topLevelFolders: function () {
    var folders = this.get('folders');
    return folders.filterBy('parentFolder', null);
  }.property('folders.[]'),

  actions: {
    setActiveFolder: function (folder) {
      this.set('activeFolder', folder);
    }
  }

});

App.KaneFolderComponent = Ember.Component.extend({

  isExpanded: false,

  name: alias("folder.name"),

  children: alias("folder.folders"),

  isActive: function () {
    var activeFolder = this.get('tree').get('activeFolder')
      , thisFolder = this.get('folder');

    return (Ember.isEqual(activeFolder, thisFolder));
  }.property('tree.activeFolder'),

  actions: {
    toggleExpanded: function () {
      this.toggleProperty('isExpanded');
    },
    
    setActive: function (folder) {
      var tree = this.get('tree');
      tree.send("setActiveFolder", folder);
    }
  }
});
