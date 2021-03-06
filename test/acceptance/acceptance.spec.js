﻿var recap = require("../../js/main.js");
var fs = require("fs");
var rimraf = require("rimraf");
var path = require("path");
var exec = require('child_process').exec;
require("../helpers/matchers.js");

process.chdir("./test/acceptance");
describe("Recap", function () {

    var configPaths = {
        simple : "../data/config.simple.json",
        multiple : "../data/config.multiple.json",
        crawl : "../data/config.crawl.json",
        login : "../data/config.login.json"
    }
       
    
    var config;

    var timeout = 5 * (60 * 1000);

    var debugLog = fs.createWriteStream("./debug.log");

    var logToConsole = false;

    beforeEach(function() {
        
    });

    afterEach(function() {
        var dest = path.resolve(config.dest);
        rimraf.sync(dest);
        config = null;
    });

    function log(){
        var args = Array.prototype.slice.apply(arguments);
        var msg = args.join(', ');
        debugLog.write(msg + "\r\n", "utf8");
        logToConsole && console.log(msg);
    }

    function gethostnameFromUrl(url){
        url = url.replace(/http(s?):\/\//, "");
        if(url.indexOf("/") == -1){
            return url;
        }

        return url.split("/")[0];
    }

    function getData(path){
        var dataStr = fs.readFileSync(path, {encoding : "utf8"});
        return JSON.parse(dataStr);
    }

    it("Can be called programatically, passing in a config object", function(done) {

        config = require(configPaths.simple);
        log(config);
       
        var expectedFiles = [
            "data.json"
        ];

        var urls = config.urls.slice(0);
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
                    var data = getData(path.resolve(config.dest + "data.json"));
                    log('expectedFiles', expectedFiles);
                    log("files", files);
                    log('data', data);
                    for (var i = 0, l = expectedFiles.length; i < l; i++) {
                        expect(files).toContain(expectedFiles[i]);
                    }
                    for (var j = 0, m = data.length; j < m; j++) {
                        expect(expectedFiles).toContain(data[j].filename);
                        expect(urls).toContainUrl(data[j].url);
                        expect(widths).toContain(data[j].width);
                    }
                     log("done");
                     done();
                } catch(e) {
                    log(e);
                    done(false);
                }
            },
            function() {
                log("FAILED: ", arguments);
                done(false);
            }
        );
    }, timeout);
    
   it("Can be called via the command line, given a path to a config file", function (done) {

        config = require(configPaths.simple);

        var expectedFiles = [
            "data.json"
        ];

        var urls = config.urls.slice(0);
        var widths = config.widths.slice(0);

        urls.forEach(function (url) {
            url = url.replace(/(http|https):\/\//, '').replace(/\//g, '_');
            config.widths.forEach(function (width) {
                expectedFiles.push(url + "_" + width + ".jpg");
            });
        });

        log("Running...");
        var prc = exec("recap " + configPaths.simple + " --verbose", function(err){
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
                    var data = getData(path.resolve(config.dest + "data.json"));

                    for (var i = 0, l = expectedFiles.length; i < l; i++) {
                        expect(files).toContain(expectedFiles[i]);
                    }
                    for (var j = 0, m = data.length; j < m; j++) {
                        expect(expectedFiles).toContain(data[j].filename);
                        expect(urls).toContainUrl(data[j].url);
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


    }, timeout);

   it("Can can crawl for additional urls if the config specifies it", function(done) {

        config = require(configPaths.crawl);
       
        var expectedFiles = [
            "data.json"
        ];

        var urls = config.urls.slice(0);
        var widths = config.widths.slice(0);
        var hostnames = [];

        urls.forEach(function(url){
            var hostname = gethostnameFromUrl(url);
            if(hostnames.indexOf(hostname) === -1){
                hostnames.push(hostname);
            }
        });

        recap.on("console", function(type, content){
            log(content);
         });

        recap.run(config).then(
            function () {
                log("Finished, running assertations");
                var files = fs.readdirSync(config.dest);
                var data = getData(path.resolve(config.dest + "data.json"));
                log("files", files);
                log("data", data);

                expect(files).not.toContain("LOCKED");
                expect(data.length).toEqual(files.length - 1);
                expect(files.length).toBeGreaterThan((urls.length * widths.length) + 1);
                data.forEach(function(item){
                    expect(hostnames).toContain(gethostnameFromUrl(item.url));
                })
                done();
            },
            function() {
                console.log("FAILED: ", arguments);
                done(false);
            }
        );
    }, timeout);

    it("Can run a script to access pages that require a login", function(done){

        config = require(configPaths.login);

         recap.on("console", function(type, content){
            log(content);
         });

        recap.run(config).then(
            function(){
                try{
                    log("Finished, running assertations");
                    var files = fs.readdirSync(config.dest);
                    var data = getData(path.resolve(config.dest + "data.json"));
                    log("files", files);
                    log("data", data);
                    expect(data.length).toEqual(files.length - 1);
                    data.forEach(function(item){
                        expect(item.url).toMatchUrl(config.urls[0]);
                        log("expect " + item.url + " to match " + config.urls[0]);
                    });
                    done();
                }catch(e){
                    log(e);
                    done(false);
                }
              
            }
        );
    }, timeout);
});