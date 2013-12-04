
var loader = require("../helpers/moduleLoader.js");
var config = loader.loadModule("./js/config.js").exports;
var fs = require("fs");

describe("Config", function () {

    var configPath ="test/data/config.json";
    var incorrectConfigPath = "test/data/config-incorrect.json";

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

    it("Can validate a config object", function(){
        var filestr1 = fs.readFileSync(configPath, { encoding: "utf8" });
        var obj1 = JSON.parse(filestr1);
        var filestr2 = fs.readFileSync(incorrectConfigPath, { encoding: "utf8" });
        var obj2 = JSON.parse(filestr2);

        var result1 = config.validate(obj1);
        var result2 = config.validate(obj2);

        expect(result1.result).toBe(true);
        expect(result2.result).toBe(false);
    })

   it("Should correctly populate the returned config class", function () {
        var filestr = fs.readFileSync(configPath, { encoding: "utf8" });
        var obj = JSON.parse(filestr);
        var objUrls = Object.keys(obj.urls);

        var cfg = config.load(configPath);
        var cfgUrls = Object.keys(cfg.urls);

        expect(cfgUrls).toEqual(objUrls);
        expect(cfg.urls[cfgUrls[0]]).toEqual(cfg.defaultOptions);
        expect(cfg.widths).toEqual(obj.widths);
        expect(cfg.tempFolder).toEqual(obj.tempFolder);
        expect(cfg.dest).toEqual(obj.dest);
    });

});

