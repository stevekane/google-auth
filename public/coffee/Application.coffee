alias = Ember.computed.alias

window.Ideabox = Ember.Application.create()

Ideabox.Router.map ->
  @resource "login"
  @resource "ideabox"

Ideabox.SocketRoute = Ember.Route.extend

  actions:
    willTransition: (transition) ->
      socketController = @controllerFor "socket"

#Index route is used to connect to the server over websocket
Ideabox.IndexRoute = Ideabox.SocketRoute.extend

   redirect: -> @replaceWith "login"

Ideabox.LoginRoute = Ideabox.SocketRoute.extend()
    
Ideabox.IdeaboxRoute = Ideabox.SocketRoute.extend()

Ideabox.SocketController = Ember.Controller.extend

  init: ->
    self = @
    socket = io.connect("localhost:3000")
    socket.on("connect", ->
      self.set "socket", socket
    )
    socket.on("disconnect", ->
      self.set "socket", null
    )

  
Ideabox.LoginController = Ember.Controller.extend

  needs: ['socket']

  socket: alias "controllers.socket.socket"
  
  actions:
    checkName: (name) ->
      @transitionToRoute "ideabox"
      socket = @get "socket"
      socket.emit("loginVerify", name, () ->
        console.log "login roundtripped"
      )

  potentialName: ""

  resetName: -> @set "potentialName", ""

Ideabox.IdeaboxController = Ember.Controller.extend

  killRatings: [1,2,3,4,5]

  killValue: null

  resetKillValue: -> @set "killValue", null
