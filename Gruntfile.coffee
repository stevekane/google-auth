'use strict'

module.exports = (grunt) ->
  
  grunt.initConfig

    #vendor directory and specific dependencies
    vendor: "public/vendor"
    emberVersion: "ember-latest.js"
    jqueryVersion: "jquery-2.0.3.js"
    handlebarsVersion: "handlebars-1.0.0.js"

    #connect server settings
    port: 3000
    host: '0.0.0.0'

    #coffee files and outputted JS
    coffeeDir: "public/coffee"
    compiledJS: "public/compiled-js"
    srcJS: "app.js"

    #handlebars files
    hbDir: "public/handlebars"
    hbCompiled: "apptemplates.js"

    #sass files
    sassDir: "public/sass"
    mainSassFile: "app.sass"
    sassCompiled: "appsass.css"

    #output files
    distDir: "public/dist"

    #UTILITIES (BORING SHIT)
    clean:
      src: ['<%= compiledJS %>']

    connect:
      server:
        options:
          port: "<%= port %>"
          host: "<%= host %>"

    open:
      localhost:
        path: "http://localhost:<%= port %>"

    #MODULE SYSTEM BUILD STEP
    minispade:
      options:
        renameRequire: true
        useStrict: false
        prefixToRemove: '<%= compiledJS %>'+'/'
      files:
        src: ['<%= compiledJS %>/**/*.js']
        dest: '<%= distDir %>/<%= srcJS %>'


    #COMPILATION
    coffee:
      options:
        bare: true
      glob_to_multiple:
        expand: true
        cwd: '<%= coffeeDir %>'
        src: ['**/*.coffee']
        dest: '<%= compiledJS %>'
        ext: '.js'

    sass:
      dist:
        options:
          trace: true
          style: 'expanded'
        files:
          '<%= distDir %>/<%= sassCompiled %>': '<%= sassDir %>/<%= mainSassFile %>'

    emberTemplates:
      compile:
        options:
          templateName: (sourceFile) ->
            #TODO: THIS IS HARDCODED...SHOULD CHANGE TO REF GLOBAL
            return sourceFile.replace("public/handlebars/", "")
        files:
          "<%= distDir%>/<%= hbCompiled %>": "<%= hbDir %>/**/*.handlebars"
    
    #FILE WATCHING
    watch:
      sass:
        files: ['<%= sassDir %>/**/*.sass']
        tasks: ['sass']
        options:
          livereload: true

      coffee:
        files: ['<%= coffeeDir %>/**/*.coffee']
        tasks: ['clean', 'coffee', 'minispade']
        options:
          livereload: true

      handlebars:
        files: ['<%= hbDir%>/**/*.handlebars']
        tasks: ['emberTemplates']
        options:
          livereload: true

      indexhtml:
        files: ['index.html']
        tasks: []
        options:
          livereload: true

  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-minispade')
  grunt.loadNpmTasks('grunt-contrib-sass')
  grunt.loadNpmTasks('grunt-ember-templates')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-contrib-coffee')
  grunt.loadNpmTasks('grunt-contrib-connect')
  grunt.loadNpmTasks('grunt-open')

  grunt.registerTask('default',
    [
      'clean',
      'coffee',
      'minispade',
      'emberTemplates',
      'sass',
      'connect',
      'open:localhost'
      'watch'
    ]
  )

  grunt.registerTask('noserver',
    [
      'clean',
      'coffee',
      'minispade',
      'emberTemplates',
      'sass',
      'open:localhost'
      'watch'
    ]
  )
