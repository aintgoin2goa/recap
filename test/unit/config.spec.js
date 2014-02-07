var loader = require("../helpers/moduleLoader.js");
var config = loader.loadModule("./js/config.js").exports;
var fs = require("fs");

describe("Config", function () {

    var configPath ="test/data/config.multiple.json";

    it("Can be loaded correctly", function () {
        expect(config).not.toBeNull();
    });

    it("Can load a config file given a filepath", function () {
        var cnfg = config.load(configPath);

        expect(cnfg).not.toBeNull();
    });

    it("Can load configuration data from an object", function () {
        var filestr = fs.readFileSync(configPath, { encoding: "utf8" });
        var obj = JSON.parse(filestr);

        var cfg = config.load(obj);

        expect(cfg).not.toBeNull();
    });

    it("Should correctly populate the returned config class", function () {
        var filestr = fs.readFileSync(configPath, { encoding: "utf8" });
        var obj = JSON.parse(filestr);

        var cfg = config.load(configPath);

        expect(Object.keys(cfg.urls)).toEqual(obj.urls);
        expect(cfg.widths).toEqual(obj.widths);
        expect(cfg.dest).toEqual(obj.dest);
    });

    it("Should set any options specificed in the options object", function(){
        var filestr = fs.readFileSync(configPath, { encoding: "utf8" });
        var obj = JSON.parse(filestr);
        debugger;
        var cfg = config.load(configPath);

        expect(cfg.urls["http://www.datsun.com"].crawl).toBe(obj.options.crawl);
    });

    it("Should override any options for a url as specified", function(){
        var filestr = fs.readFileSync(configPath, { encoding: "utf8" });
        var url = "http://contentsmagazine.com/";
        var obj = JSON.parse(filestr);

        var cfg = config.load(configPath);

        expect(cfg.urls[url].crawl).toBe(obj.options[url].crawl);
    });

});
