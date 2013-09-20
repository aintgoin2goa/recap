var expect = require("chai").expect;
var loader = require("./helpers/moduleLoader.js");
var config = loader.loadModule("./src/config.js").exports;
var fs = require("fs");

console.log("config", config);

describe("Config", function () {

    it("Can be loaded correctly", function () {
        expect(config).to.not.be.null;
    });

    it("Can load a config file given a filepath", function () {
        var cnfg = config.load("./config.json");

        expect(cnfg).not.to.be.null;
    });

    it("Can load configuration data from an object", function () {
        var filestr = fs.readFileSync("./config.json", { encoding: "utf8" });
        var obj = JSON.parse(filestr);

        var cfg = config.load(obj);

        expect(cfg).to.not.be.null;
    });

    it("Should correctly populate the returned config class", function () {
        var filestr = fs.readFileSync("./config.json", { encoding: "utf8" });
        var obj = JSON.parse(filestr);

        var cfg = config.load("./config.json");

        expect(cfg.urls).to.eql(obj.urls);
        expect(cfg.widths).to.eql(obj.widths);
        expect(cfg.tempFolder).to.equal(obj.tempFolder);
        expect(cfg.dest).to.equal(obj.dest);
    });

});

