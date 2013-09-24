alias = Ember.computed.alias

window.Ideabox = Ember.Application.create()

Ideabox.Router.map ->
  @resource "reconnect"
  @resource "login"
  @resource "ideabox"

checkForSocket = (context, transition) ->
  sockCon = context.controllerFor "socket"
  socket = sockCon.get "socket"
  if socket is null
    if transition then transition.abort()
    context.transitionTo "reconnect"

Ideabox.SocketRoute = Ember.Route.extend

  activate: ->
    checkForSocket(@)

  actions:
    willTransition: (transition) ->
      checkForSocket(@, transition)

Ideabox.ReconnectRoute = Ember.Route.extend()

#Index route is used to connect to the server over websocket
Ideabox.IndexRoute = Ideabox.SocketRoute.extend

   redirect: -> @replaceWith "login"

Ideabox.LoginRoute = Ideabox.SocketRoute.extend()
    
Ideabox.IdeaboxRoute = Ideabox.SocketRoute.extend()

Ideabox.UserController = Ember.ObjectController.extend()

Ideabox.SocketController = Ember.Controller.extend

  socket: null

  establishConnection: (->
    socket = @get("socket")
    self = @
    if socket isnt null then return
    
    socket = io.connect("//localhost:3000")
      .on("connect", ->
        self.transitionToRoute "login"
        self.set "socket", socket
      )
      .on("disconnect", ->
        self.transitionToRoute "reconnect"
        self.set "socket", null
      )
      .on("error", ->
        self.transitionToRoute "reconnect"
        self.set "socket", null
      )
      .on("connect_failed", ->
        self.transitionToRoute "reconnect"
        self.set "socket", null
      )

  ).observes('socket').on('init')

Ideabox.LoginController = Ember.Controller.extend

  needs: ['socket']

  socket: alias "controllers.socket.socket"
  
  actions:
    checkName: (name) ->
      @transitionToRoute "ideabox"
      socket = @get "socket"
      socket.emit("loginVerify", name, ->
        console.log "login roundtripped"
      )
      socket.on("validUser", (userList, idealist) ->
        console.log userList
        console.log ideaList
      )

  potentialName: ""

  resetName: -> @set "potentialName", ""

Ideabox.IdeaboxController = Ember.Controller.extend

  killRatings: [1,2,3,4,5]

  killValue: null

  resetKillValue: -> @set "killValue", null
