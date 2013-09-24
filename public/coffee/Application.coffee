window.Ideabox = Ember.Application.create()

Ideabox.Router.map ->
  @resource "login"
  @resource "ideabox"

Ideabox.SocketController = Ember.Controller.extend

  init: ->
    self = @
    socket = io.connect("localhost:3000")
    console.log "yay"
    socket.on("connect", ->
      self.set "socket", socket
    )
    socket.on("disconnect", ->
      self.set "socket", null
    )

#Index route is used to connect to the server over websocket
Ideabox.IndexRoute = Ember.Route.extend

   redirect: -> @replaceWith "login"

Ideabox.LoginRoute = Ember.Route.extend
  
  activate: ->
    console.log "you are in the login route"

Ideabox.IdeaboxRoute = Ember.Route.extend()

  
Ideabox.LoginController = Ember.Controller.extend

  needs: ['socket']

  socket: Ember.alias "controllers.socket.socket"
  
  actions:
    checkName: (name) ->
      socket = @get "socket"
      socket.emit("login", {name: name}, () ->
        console.log "login roundtripped" 
      )

  potentialName: ""

  resetName: -> @set "potentialName", ""

