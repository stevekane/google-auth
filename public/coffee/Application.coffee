alias = Ember.computed.alias

window.Ideabox = Ember.Application.create()

Ideabox.Router.map ->
  @resource "reconnect"
  @resource "login"
  @resource "ideabox"

Ideabox.ApplicationRoute = Ember.Route.extend

  actions:
    logout: ->
      @controllerFor("user").set("content", null)
      @transitionTo "login"

Ideabox.AuthRoute = Ember.Mixin.create

  activate: ->
    @_super.apply @, arguments
    if @controllerFor("user").get("content") is null
      @replaceWith "login"

Ideabox.SocketRoute = Ember.Route.extend

  actions:
    willTransition: (transition) ->
      socket = @controllerFor("socket").get('socket')
      if socket is null
        if transition then transition.abort()
        context.transitionTo "reconnect"

Ideabox.ReconnectRoute = Ember.Route.extend

  actions:
    willTransition: (transition) ->
      connected = @controllerFor("socket").get('connected')
      unless connected then transition.abort()
      
#Index route is used to connect to the server over websocket
Ideabox.IndexRoute = Ideabox.SocketRoute.extend

   redirect: -> @replaceWith "login"

Ideabox.LoginRoute = Ideabox.SocketRoute.extend

  actions:
    login: (user) ->
      @controllerFor("user").set "content", user
      @transitionTo "ideabox"

Ideabox.IdeaboxRoute = Ideabox.SocketRoute.extend Ideabox.AuthRoute,

  test: "whatever"

#we define this to initiate the socket controller
Ideabox.ApplicationController = Ember.Controller.extend

  needs: ['socket']

  init: ->
    @_super.apply @, arguments
    socketController = @get('controllers.socket')

Ideabox.UserController = Ember.ObjectController.extend()

#utility for re-establishing connection
_establishConnection = (context) ->
  ->
    context.set "connected", false
    context.transitionToRoute "reconnect"

#utility for logging in
_handleConnection = (context) ->
  ->
    context.set "connected", true
    context.transitionToRoute "login"

Ideabox.SocketController = Ember.Controller.extend

  socket: null

  connected: false

  init: ->
    @_super.apply @, arguments
    socket = @get("socket")
    self = @

    socket = io.connect("//localhost:3000")
      .on("connect", _handleConnection(self))
      .on("disconnect", _establishConnection(self))
      .on("error", _establishConnection(self))
      .on("connect_failed", _establishConnection(self))

    @set "socket", socket

Ideabox.LoginController = Ember.Controller.extend

  needs: ['socket']

  socket: alias "controllers.socket.socket"

  actions:
    attemptLogin: (name) ->
      socket = @get "socket"
      self = @

      socket
        .emit("login", name, (error, user) ->
          if error
            alert(error)
            resetName()
          else
            newUser = Ember.Object.create(user)
            self.send "login", newUser
          self.resetName()
        )

  potentialName: ""

  resetName: ->
    @set "potentialName", ""

Ideabox.IdeaboxController = Ember.Controller.extend

  needs: ['user']
  user: alias "controllers.user"

  killRatings: [1,2,3,4,5]
  killValue: null

  resetKillValue: ->
    @set "killValue", null
