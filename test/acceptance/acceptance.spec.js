var recap = require("../../js/main.js");
var fs = require("fs");
var rimraf = require("rimraf");
var path = require("path");
var exec = require('child_process').exec;

process.chdir("./test/acceptance");
describe("Recap", function () {

    var configPaths = [
        "../data/config.json",
        "../data/config4.json"
    ]
    var config;
    var scriptsConfig;

    beforeEach(function() {
        config = require(configPaths[0]);
        scriptsConfig = require(configPaths[1]);
    });

    afterEach(function() {
        var dest = config.dest;
        rimraf(dest, function () { });
        config = null;
    });

    function log(){
        //console.log(Array.prototype.slice.apply(arguments));
    }
    
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
        var prc = exec("recap " + configPaths[0], function(err){
            if(err){
                log(err);
                done(false);
            }

        });
        
        prc.on("close",
            function () {
                try {
                    log("Finished, running assertations");
                    var files = fs.readdirSync(config.dest);
                    var data = require(config.dest + "data.json");

                    for (var i = 0, l = expectedFiles.length; i < l; i++) {
                        expect(files).toContain(expectedFiles[i]);
                    }
                    for (var j = 0, m = data.length; j < m; j++) {
                        expect(expectedFiles).toContain(data[j].filename);
                        expect(urls).toContain(data[j].url);
                        expect(widths).toContain(data[j].width);
                    }

                } catch (e) {
                    log("ERROR", e);
                    done(false);
                }
                done();
            });

        prc.on("error", function (e) {
            log("process error", e);
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
         recap.on("console", function(type, content){
            log(content);
         });

        recap.run(config).then(
            function () {
                try {
                    log("Finished, running assertations");
                    var files = fs.readdirSync(config.dest);
                    var data = require(config.dest + "data.json");
                    log('expectedFiles', expectedFiles);
                    log("files", files);
                    log('data', data);
                    for (var i = 0, l = expectedFiles.length; i < l; i++) {
                        expect(files).toContain(expectedFiles[i]);
                    }
                    for (var j = 0, m = data.length; j < m; j++) {
                        expect(expectedFiles).toContain(data[j].filename);
                        expect(urls).toContain(data[j].url);
                        expect(widths).toContain(data[j].width);
                    }
                } catch(e) {
                    log(e);
                }
                log("done");
                done();
            },
            function() {
                log("FAILED: ", arguments);
                done(false);
            }
        );
    }, (5 * (60 * 1000)));

    xit("Can execute scripts specified in the config object", function(done) {
       
        var expectedFiles = [
            "data.json"
        ];

        var urls = Object.keys(scriptsConfig.urls);
        var widths = scriptsConfig.widths.slice(0);

        urls.forEach(function(url) {
            url = url.replace(/(http|https):\/\//, '').replace(/\//g, '_');
            scriptsConfig.widths.forEach(function(width) {
                expectedFiles.push(url + "_" + width + ".jpg");
            });
        });

        recap.run(scriptsConfig).then(
            function () {
                done();
            },
            function() {
                console.log("FAILED: ", arguments);
                done(false);
            }
        );
    }, (5 * (60 * 1000)));
    
  
});