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

    #handlebars files
    hbDir: "public/handlebars"
    hbCompiled: "apptemplates.js"

    #sass files
    sassDir: "public/sass"
    mainSassFile: "app.sass"
    sassCompiled: "appsass.css"

    #output files
    distDir: "public/dist"

    #MODULE SYSTEM BUILD STEP
    minispade:
      options:
        renameRequire: true
        useStrict: false
        prefixToRemove: '<%= compiledJS %>'+'/'
      files:
        src: ['<%= compiledJS %>/**/*.js']
        dest: '<%= distDir %>/<%= srcJS %>'


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

    handlebars:
      compile:
        options:
          node: true
          partialsUseNamespace: true
          wrapped: false
          namespace: "Templates"
        files:
          "templates.js": "templates/**/*.handlebars"
        
    
    #FILE WATCHING
    watch:
      sass:
        files: ['<%= sassDir %>/**/*.sass']
        tasks: ['sass']
        options:
          livereload: true

      emberTemplates:
        files: ['<%= hbDir%>/**/*.handlebars']
        tasks: ['emberTemplates']
        options:
          livereload: true

      handlebars:
        files: ['templates/**/*.handlebars']
        tasks: ['handlebars']
        options:
          livereload: true

      indexhtml:
        files: ['index.html']
        tasks: []
        options:
          livereload: true

  grunt.loadNpmTasks('grunt-minispade')
  grunt.loadNpmTasks('grunt-contrib-sass')
  grunt.loadNpmTasks('grunt-ember-templates')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-contrib-handlebars')

  grunt.registerTask('default',
    [
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
      'minispade',
      'emberTemplates',
      'sass',
      'watch'
    ]
  )

  grunt.registerTask('simple',
    [
      'handlebars',
      'watch'
    ]
  )
