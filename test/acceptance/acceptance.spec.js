var recap = require("../../js/main.js");
var fs = require("fs");
var rimraf = require("rimraf");
var path = require("path");
var exec = require('child_process').exec;

process.chdir("./test/acceptance");
describe("Recap", function () {

    var configPath = "../data/config.json";
    var config;

    beforeEach(function() {
        config = require(configPath);
    });

    afterEach(function() {
        var dest = config.dest;
        rimraf(dest, function () { });
        config = null;
    });
    
    it("Can be called via the command line, given a path to a config file", function (done) {

        var expectedFiles = [
            "data.json"
        ];

        var urls = Object.keys(config.urls);
        var widths = config.widths.slice(0);

        urls.forEach(function (url) {
            url = url.replace(/(http|https):\/\//, '').replace(/\//g, '_');
            config.widths.forEach(function (width) {
                expectedFiles.push(url + "_" + width + ".jpg");
            });
        });
          //console.log('expectedFiles', expectedFiles);
        var prc = exec("recap " + configPath, function(err){
            if(err){
                console.error(err);
                done(false);
            }

        });
        
        prc.on("close",
            function () {
                try {
                    console.log("Finished, running assertations");
                    var files = fs.readdirSync(config.dest);
                     //console.log("files", files);
                     var data = require(config.dest + "data.json");
                    
                   
                 
                    //console.log('data', data);
                    for (var i = 0, l = expectedFiles.length; i < l; i++) {
                        expect(files).toContain(expectedFiles[i]);
                    }
                    for (var j = 0, m = data.length; j < m; j++) {
                        expect(expectedFiles).toContain(data[j].filename);
                        expect(urls).toContain(data[j].url);
                        expect(widths).toContain(data[j].width);
                    }

                } catch (e) {
                    console.log("ERROR", e);
                    done(false);
                }
                done();
            });

        prc.on("error", function (e) {
            console.log("process error", e);
            done(false);
        });


    }, (5 * (60 * 1000)));

    it("Can be called programatically, passing in a config object", function(done) {
       
        var expectedFiles = [
            "data.json"
        ];

        var urls = Object.keys(config.urls);
        var widths = config.widths.slice(0);

        urls.forEach(function(url) {
            url = url.replace(/(http|https):\/\//, '').replace(/\//g, '_');
            config.widths.forEach(function(width) {
                expectedFiles.push(url + "_" + width + ".jpg");
            });
        });

        recap.run(config).then(
            function () {
                //try {
                    //console.log("Finished, running assertations");
                    var files = fs.readdirSync(config.dest);
                    var data = require(config.dest + "data.json");
                    //console.log('expectedFiles', expectedFiles);
                    //console.log("files", files);
                    //console.log('data', data);
                    for (var i = 0, l = expectedFiles.length; i < l; i++) {
                        expect(files).toContain(expectedFiles[i]);
                    }
                    for (var j = 0, m = data.length; j < m; j++) {
                        expect(expectedFiles).toContain(data[j].filename);
                        expect(urls).toContain(data[j].url);
                        expect(widths).toContain(data[j].width);
                    }
               // } catch(e) {
               //     console.log(e);
              //  }
                //console.log("done");
                done();
            },
            function() {
                console.log("FAILED: ", arguments);
                done(false);
            }
        );
    }, (5 * (60 * 1000)));
    
  
});