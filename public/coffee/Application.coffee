alias = Ember.computed.alias

window.Ideabox = Ember.Application.create()

Ideabox.Router.map ->
  @resource "reconnect"
  @resource "login"
  @resource "ideabox"

Ideabox.ApplicationRoute = Ember.Route.extend()

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

  activate: ->
    connected = @controllerFor("socket").get('connected')
    if connected then @transitionTo "login"
    
  actions:
    willTransition: (transition) ->
      connected = @controllerFor("socket").get('connected')
      unless connected then transition.abort()
      
#Index route is used to connect to the server over websocket
Ideabox.IndexRoute = Ideabox.SocketRoute.extend

   redirect: -> @replaceWith "login"

Ideabox.LoginRoute = Ideabox.SocketRoute.extend()

Ideabox.IdeaboxRoute = Ideabox.SocketRoute.extend Ideabox.AuthRoute, {}

#we define this to initiate the socket controller
Ideabox.ApplicationController = Ember.Controller.extend

  needs: ['socket', 'user']

  socket: alias "controllers.socket.socket"

  init: ->
    @_super.apply @, arguments
    @get('controllers.socket')

Ideabox.UserController = Ember.ObjectController.extend

  actions:
    attemptLogin: (name, socket) ->
      self = @
      socket.emit("login", name, (error, data) ->
        if error
          alert(error)
          resetName()
        else
          newUser = Ember.Object.create(data.user)
          self.set "content", newUser
          self.transitionToRoute "ideabox"
      )


    attemptLogout: (user, socket) ->
      self = @
      socket.emit('logout', user.username, (error, data) ->
        if error
          alert error
        else
          self.set "content", null
          self.transitionToRoute "login"
      )

#utility for re-establishing connection
enterReconnect = (context) ->
  ->
    context.set "connected", false
    context.transitionToRoute "reconnect"

#utility for logging in
handleConnection = (context) ->
  ->
    context.set "connected", true
    context.transitionToRoute "login"

Ideabox.SocketController = Ember.Controller.extend

  socket: null

  connected: false

  init: ->
    @_super.apply @, arguments
    self = @

    socket = io.connect("//localhost:3000")
      .on("connect", handleConnection(self))
      .on("disconnect", enterReconnect(self))
      .on("error", enterReconnect(self))
      .on("connect_failed", enterReconnect(self))

    @set "socket", socket

Ideabox.LoginController = Ember.Controller.extend

  needs: ['user', 'socket']

  userCon: alias "controllers.user"

  socket: alias "controllers.socket.socket"

  potentialName: ""

Ideabox.IdeaboxController = Ember.Controller.extend

  needs: ['user', 'socket', 'login']

  userCon: alias "controllers.user"

  socket: alias "controllers.socket.socket"

  killRatings: [1,2,3,4,5]
  killValue: null
  resetKillValue: ->
    @set "killValue", null
