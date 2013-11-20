
var loader = require("../helpers/moduleLoader.js");
var config = loader.loadModule("./js/config.js").exports;
var fs = require("fs");

describe("Config", function () {

    var configPath ="test/data/config.json";

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

        expect(cfg.urls).toEqual(obj.urls);
        expect(cfg.widths).toEqual(obj.widths);
        expect(cfg.tempFolder).toEqual(obj.tempFolder);
        expect(cfg.dest).toEqual(obj.dest);
    });

});

