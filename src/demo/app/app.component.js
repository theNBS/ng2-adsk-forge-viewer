"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiIsImtpZCI6Imp3dF9zeW1tZXRyaWNfa2V5In0.eyJjbGllbnRfaWQiOiJuVFh0TGhXdUg5YzVtNmpValVEZTF6SmxGcGpSaE96YyIsImV4cCI6MTUyMjQzNzg5MCwic2NvcGUiOlsiYnVja2V0OmNyZWF0ZSIsImJ1Y2tldDpyZWFkIiwiZGF0YTp3cml0ZSIsImRhdGE6cmVhZCIsImJ1Y2tldDpkZWxldGUiXSwiYXVkIjoiaHR0cHM6Ly9hdXRvZGVzay5jb20vYXVkL2p3dGV4cDYwIiwianRpIjoiOFJFb05qZ2JlNXNkTDJWcFA1a0hBeVhhSEQxNGJWTmFHSHdKN0lMYkI4NEM3a2Y4ZWJCMkJCWnF2Sk1JU1NIQSJ9.2C1fbGA6ydid4AO4g1j8UoZVzQKemhP-bnjhbPYYHms';
var DOCUMENT_URN = 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6dG9vbGtpdC9BMTY4MThBMDMxNTYyM0M5MEY2QUVGQkNENjdDRDRFQi5ydnQ';
var AppComponent = (function () {
    function AppComponent() {
    }
    AppComponent.prototype.setViewerOptions = function () {
        this.viewerOptions = {
            initializerOptions: {
                env: 'AutodeskProduction',
                getAccessToken: function (onGetAccessToken) {
                    var expireTimeSeconds = 60 * 30;
                    onGetAccessToken(ACCESS_TOKEN, expireTimeSeconds);
                },
            },
        };
    };
    AppComponent.prototype.loadDocument = function (event) {
        event.viewerComponent.DocumentId = DOCUMENT_URN;
    };
    AppComponent.prototype.documentChanged = function (event) {
        // const viewerApp = event.viewingApplication;
        // const viewables = viewerApp.bubble.search({ type: 'geometry' });
        //
        // if (viewables && viewables.length > 0) {
        //   event.viewerComponent.selectItem(viewables[0].data);
        //   // viewerApp.selectItem(viewables[0].data, undefined, undefined);
        // }
    };
    AppComponent.prototype.selectionChanged = function (event) {
        console.log(event);
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: 'demo-app',
            templateUrl: './app.component.html',
            styleUrls: ['./app.component.css'],
        })
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map