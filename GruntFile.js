module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    ts: {            
      dev: {                                
          src: ["src/**/*.ts"],       
          outDir: 'js',    
          watch: 'src',                    
          options: {                    
              target: 'es5',            
              module: 'commonjs',       
              sourcemap: true,          
              comments: true           
          },
      },
      build: {                        
          src: ["src/**/*.ts"],    
          outDir: 'js',  
          options: {
              target: 'es5',            
              module: 'commonjs',                    
              sourcemap: false,
              comments: false
          }
      }
    },
    jasmine_node : {
      unit : {
        coverage : false,
        specFolders : ["test/unit/"],
        options: {
          forceExit: true,
          match: ".",
          colors : true,
          verbose: true,
          matchall: false,
          junitreport: {
            report: false,
            savePath : "./test/reports/",
            useDotNotation: true,
            consolidate: true
          }
        }
      },
      acceptance : {
        coverage : false,
        specFolders : ["test/acceptance/"],
        options: {
          forceExit: true,
          match: ".",
          colors : true,
          matchall: false,
          junitreport: {
            report: false,
            savePath : "./test/reports/",
            useDotNotation: true,
            consolidate: true
          }
        }
      }
      
    }
  });


  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-ts');
  grunt.loadNpmTasks('grunt-jasmine-node-coverage');

  // Default task(s).
  grunt.registerTask('dev', ['ts:dev']);
  grunt.registerTask('build', ['ts:build']);
  grunt.registerTask('test', ['jasmine_node']);
  grunt.registerTask('test:unit', ['ts:build', 'jasmine_node:unit']);
  grunt.registerTask('test:acceptance', ['ts:build ', 'jasmine_node:acceptance']);
  grunt.registerTask('ci', ['ts:build', 'jasmine_node:unit', 'jasmine_node:acceptance']);
};