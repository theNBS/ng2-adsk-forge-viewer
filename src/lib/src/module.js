"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var viewer_component_1 = require("./component/viewer.component");
var script_service_1 = require("./service/script.service");
var ViewerModule = (function () {
    function ViewerModule() {
    }
    ViewerModule = __decorate([
        core_1.NgModule({
            declarations: [viewer_component_1.ViewerComponent],
            exports: [viewer_component_1.ViewerComponent],
            providers: [script_service_1.ScriptService],
        })
    ], ViewerModule);
    return ViewerModule;
}());
exports.ViewerModule = ViewerModule;
//# sourceMappingURL=module.js.map