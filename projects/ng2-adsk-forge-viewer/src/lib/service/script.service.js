"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var ScriptService = (function () {
    function ScriptService() {
        this.scripts = {};
        // Nothing to do
    }
    ScriptService.prototype.load = function () {
        var _this = this;
        var urls = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            urls[_i] = arguments[_i];
        }
        var promises = [];
        urls.forEach(function (src) {
            if (_this.scripts[src] && _this.scripts[src].loaded) {
                return;
            }
            _this.scripts[src] = { src: src, loaded: false };
            return promises.push(_this.loadScript(src));
        });
        return Promise.all(promises);
    };
    ScriptService.prototype.loadScript = function (name) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // resolve if already loaded
            if (_this.scripts[name] && _this.scripts[name].loaded) {
                resolve({ src: name, loaded: true, status: 'Already Loaded' });
                return;
            }
            // load script
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = _this.scripts[name].src;
            if (script.readyState) {
                script.onreadystatechange = function () {
                    if (script.readyState === 'loaded' || script.readyState === 'complete') {
                        script.onreadystatechange = null;
                        _this.scripts[name].loaded = true;
                        resolve({ src: name, loaded: true, status: 'Loaded' });
                    }
                };
            }
            else {
                script.onload = function () {
                    _this.scripts[name].loaded = true;
                    resolve({ src: name, loaded: true, status: 'Loaded' });
                };
            }
            script.onerror = function (error) { return resolve({ src: name, loaded: false, status: 'Loaded' }); };
            document.getElementsByTagName('head')[0].appendChild(script);
        });
    };
    ScriptService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [])
    ], ScriptService);
    return ScriptService;
}());
exports.ScriptService = ScriptService;
//# sourceMappingURL=script.service.js.map