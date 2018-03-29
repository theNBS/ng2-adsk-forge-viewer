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
///<reference path="viewer-typings.d.ts"/>
var core_1 = require("@angular/core");
var script_service_1 = require("../service/script.service");
var basic_extension_1 = require("../extensions/basic-extension");
var VER_STRING = '?v=4.*.*';
var ViewerComponent = (function () {
    function ViewerComponent(script) {
        this.script = script;
        this.containerId = 'ng2-adsk-forge-viewer-container';
        this.onViewerScriptsLoaded = new core_1.EventEmitter();
        this.onViewingApplicationInitialized = new core_1.EventEmitter();
        this.onDocumentChanged = new core_1.EventEmitter();
        this.onItemLoaded = new core_1.EventEmitter();
        this.onError = new core_1.EventEmitter();
        // Viewer events
        this.onFitToView = new core_1.EventEmitter();
        this.onFullscreen = new core_1.EventEmitter();
        this.onGeometryLoaded = new core_1.EventEmitter();
        this.onHide = new core_1.EventEmitter();
        this.onIsolate = new core_1.EventEmitter();
        this.onObjectTreeCreated = new core_1.EventEmitter();
        this.onObjectTreeUnavailable = new core_1.EventEmitter();
        this.onReset = new core_1.EventEmitter();
        this.onSelectionChanged = new core_1.EventEmitter();
        this.onShow = new core_1.EventEmitter();
        this.viewerInitialized = false;
        this.loadScripts();
    }
    ViewerComponent_1 = ViewerComponent;
    /**
     * Helper to allow callers to specify documentId with or without the required urn: prefix
     */
    ViewerComponent.verifyUrn = function (documentId) {
        return (documentId.startsWith('urn:')) ? documentId : "urn:" + documentId;
    };
    ViewerComponent.prototype.ngOnChanges = function (changes) {
        if (!this.viewerInitialized && changes.viewerOptions && changes.viewerOptions.currentValue) {
            this.initialiseApplication();
        }
    };
    ViewerComponent.prototype.ngOnDestroy = function () {
        this.unregisterBasicExtension();
        if (this.viewerApp) {
            var viewer = this.viewerApp.getCurrentViewer();
            viewer.tearDown();
            viewer.uninitialize();
        }
        this.viewerApp = null;
        this.viewerInitialized = false;
    };
    /**
     * Helper method to get some default viewer options
     */
    ViewerComponent.prototype.getDefaultViewerOptions = function (getAccessToken) {
        return {
            initializerOptions: {
                env: 'AutodeskProduction',
                getAccessToken: getAccessToken,
            },
        };
    };
    Object.defineProperty(ViewerComponent.prototype, "ViewerApplication", {
        /**
         * Get a reference to the current viewing application
         */
        get: function () {
            return this.viewerApp;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewerComponent.prototype, "Viewer3D", {
        /**
         * Get a reference to the current 3D viewer
         */
        get: function () {
            return this.viewerApp.getCurrentViewer();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewerComponent.prototype, "DocumentId", {
        get: function () {
            return this.documentId;
        },
        set: function (value) {
            this.documentId = value;
            this.loadDocument(this.documentId);
        },
        enumerable: true,
        configurable: true
    });
    ViewerComponent.prototype.selectItem = function (item) {
        this.viewerApp.selectItem(item, this.onItemLoadSuccess.bind(this), this.onItemLoadFail.bind(this));
    };
    /**
     * We don't bundle Autodesk's scripts with the component, and we don't really want users to have
     * to add the scripts to their index.html pages. So we'll load them when required.
     */
    ViewerComponent.prototype.loadScripts = function () {
        var _this = this;
        this.script.load('https://developer.api.autodesk.com/modelderivative/v2/viewers/three.min.js?v=4.*.*', 'https://developer.api.autodesk.com/modelderivative/v2/viewers/viewer3D.min.js?v=4.*.*')
            .then(function (data) {
            console.log('script loaded ', data);
            _this.onViewerScriptsLoaded.emit(true);
        })
            .catch(function (error) { return console.log(error); });
    };
    /**
     * Initialises a ViewingApplication
     */
    ViewerComponent.prototype.initialiseApplication = function () {
        var _this = this;
        // Check if the viewer has already been initialised - this isn't the nicest, but we've set the env in our
        // options above so we at least know that it was us who did this!
        if (!Autodesk.Viewing.Private.env) {
            Autodesk.Viewing.Initializer(this.viewerOptions.initializerOptions, function () {
                _this.initialized();
            });
        }
        else {
            // We need to give an initialised viewing application a tick to allow the DOM element
            // to be established before we re-draw
            setTimeout(function () {
                _this.initialized();
            });
        }
    };
    ViewerComponent.prototype.initialized = function () {
        this.viewerApp = new Autodesk.Viewing.ViewingApplication(this.containerId, this.viewerOptions.viewerApplicationOptions);
        // Register an extension to help us raise events
        var extName = this.registerBasicExtension();
        var config = this.addBasicExtensionConfig(extName);
        // Register a viewer with the application (passign through any additional config)
        this.viewerApp.registerViewer(this.viewerApp.k3D, (this.viewerOptions.headlessViewer) ? Autodesk.Viewing.Viewer3D : Autodesk.Viewing.Private.GuiViewer3D, config);
        // Viewer is ready - scripts are loaded and we've create a new viewing application
        this.viewerInitialized = true;
        this.onViewingApplicationInitialized.emit({ viewingApplication: this.viewerApp, viewerComponent: this });
    };
    /**
     * Loads a model in to the viewer via it's urn
     */
    ViewerComponent.prototype.loadDocument = function (documentId) {
        if (!documentId)
            return;
        // Add urn: to the beginning of document id if needed
        this.viewerApp.loadDocument(ViewerComponent_1.verifyUrn(documentId), this.onDocumentLoadSuccess.bind(this), this.onDocumentLoadFailure.bind(this));
    };
    /**
     * Document successfully loaded
     */
    ViewerComponent.prototype.onDocumentLoadSuccess = function (document) {
        // Emit an event so the caller can do something
        // TODO: config option to specify which viewable to display (how?)
        this.onDocumentChanged.emit({ document: document, viewingApplication: this.viewerApp, viewerComponent: this });
        if (this.viewerOptions.showFirstViewable === undefined || this.viewerOptions.showFirstViewable) {
            // This will be the default behaviour -- show the first viewable
            // We could still make use of Document.getSubItemsWithProperties()
            // However, when using a ViewingApplication, we have access to the **bubble** attribute,
            // which references the root node of a graph that wraps each object from the Manifest JSON.
            var viewables = this.viewerApp.bubble.search(Autodesk.Viewing.BubbleNode.MODEL_NODE);
            if (viewables && viewables.length > 0) {
                this.viewerApp.selectItem(viewables[0].data, this.onItemLoadSuccess.bind(this), this.onItemLoadFail.bind(this));
            }
        }
    };
    /**
     * Failed to load document
     */
    ViewerComponent.prototype.onDocumentLoadFailure = function (errorCode) {
        console.error('onDocumentLoadFailure() - errorCode:' + errorCode);
        this.onError.emit(errorCode);
    };
    /**
     * View from the document was successfully loaded
     */
    ViewerComponent.prototype.onItemLoadSuccess = function (viewer, item) {
        console.log('onItemLoadSuccess()', viewer, item);
        console.log('Viewers are equal: ' + (viewer === this.viewerApp.getCurrentViewer()));
        this.onItemLoaded.emit({
            item: item, currentViewer: viewer,
            viewingApplication: this.viewerApp,
            viewerComponent: this,
        });
    };
    /**
     * Failed to load a view from the document
     */
    ViewerComponent.prototype.onItemLoadFail = function (errorCode) {
        console.error('onItemLoadFail() - errorCode:' + errorCode);
        this.onError.emit(errorCode);
    };
    ViewerComponent.prototype.registerBasicExtension = function () {
        var _this = this;
        basic_extension_1.BasicExtension.registerExtension();
        // tslint:disable:max-line-length
        basic_extension_1.BasicExtension.subscribeEvent(this, Autodesk.Viewing.FIT_TO_VIEW_EVENT, function (args) { return _this.onFitToView.emit(args); });
        basic_extension_1.BasicExtension.subscribeEvent(this, Autodesk.Viewing.FULLSCREEN_MODE_EVENT, function (args) { return _this.onFullscreen.emit(args); });
        basic_extension_1.BasicExtension.subscribeEvent(this, Autodesk.Viewing.GEOMETRY_LOADED_EVENT, function (args) { return _this.onGeometryLoaded.emit(args); });
        basic_extension_1.BasicExtension.subscribeEvent(this, Autodesk.Viewing.HIDE_EVENT, function (args) { return _this.onHide.emit(args); });
        basic_extension_1.BasicExtension.subscribeEvent(this, Autodesk.Viewing.ISOLATE_EVENT, function (args) { return _this.onIsolate.emit(args); });
        basic_extension_1.BasicExtension.subscribeEvent(this, Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT, function (args) { return _this.onObjectTreeCreated.emit(args); });
        basic_extension_1.BasicExtension.subscribeEvent(this, Autodesk.Viewing.OBJECT_TREE_UNAVAILABLE_EVENT, function (args) { return _this.onObjectTreeCreated.emit(args); });
        basic_extension_1.BasicExtension.subscribeEvent(this, Autodesk.Viewing.RESET_EVENT, function (args) { return _this.onReset.emit(args); });
        basic_extension_1.BasicExtension.subscribeEvent(this, Autodesk.Viewing.SELECTION_CHANGED_EVENT, function (args) { return _this.onSelectionChanged.emit(args); });
        basic_extension_1.BasicExtension.subscribeEvent(this, Autodesk.Viewing.SHOW_EVENT, function (args) { return _this.onShow.emit(args); });
        // tslint:enable:max-line-length
        return basic_extension_1.BasicExtension.extensionName;
    };
    ViewerComponent.prototype.unregisterBasicExtension = function () {
        basic_extension_1.BasicExtension.unsubscribeEvent(this, Autodesk.Viewing.FIT_TO_VIEW_EVENT);
        basic_extension_1.BasicExtension.unsubscribeEvent(this, Autodesk.Viewing.FULLSCREEN_MODE_EVENT);
        basic_extension_1.BasicExtension.unsubscribeEvent(this, Autodesk.Viewing.GEOMETRY_LOADED_EVENT);
        basic_extension_1.BasicExtension.unsubscribeEvent(this, Autodesk.Viewing.HIDE_EVENT);
        basic_extension_1.BasicExtension.unsubscribeEvent(this, Autodesk.Viewing.ISOLATE_EVENT);
        basic_extension_1.BasicExtension.unsubscribeEvent(this, Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT);
        basic_extension_1.BasicExtension.unsubscribeEvent(this, Autodesk.Viewing.OBJECT_TREE_UNAVAILABLE_EVENT);
        basic_extension_1.BasicExtension.unsubscribeEvent(this, Autodesk.Viewing.RESET_EVENT);
        basic_extension_1.BasicExtension.unsubscribeEvent(this, Autodesk.Viewing.SELECTION_CHANGED_EVENT);
        basic_extension_1.BasicExtension.unsubscribeEvent(this, Autodesk.Viewing.SHOW_EVENT);
        basic_extension_1.BasicExtension.unregisterExtension();
    };
    ViewerComponent.prototype.addBasicExtensionConfig = function (extName) {
        var config = Object.assign({}, this.viewerOptions.viewerConfig, { extensions: [] });
        // We will always load our basic extension with any others specified by the caller
        if (this.viewerOptions.viewerConfig && this.viewerOptions.viewerConfig.extensions) {
            config.extensions = this.viewerOptions.viewerConfig.extensions.concat([extName]);
        }
        else {
            config.extensions = [extName];
        }
        return config;
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], ViewerComponent.prototype, "viewerOptions", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], ViewerComponent.prototype, "onViewerScriptsLoaded", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], ViewerComponent.prototype, "onViewingApplicationInitialized", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], ViewerComponent.prototype, "onDocumentChanged", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], ViewerComponent.prototype, "onItemLoaded", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], ViewerComponent.prototype, "onError", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], ViewerComponent.prototype, "onFitToView", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], ViewerComponent.prototype, "onFullscreen", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], ViewerComponent.prototype, "onGeometryLoaded", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], ViewerComponent.prototype, "onHide", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], ViewerComponent.prototype, "onIsolate", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], ViewerComponent.prototype, "onObjectTreeCreated", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], ViewerComponent.prototype, "onObjectTreeUnavailable", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], ViewerComponent.prototype, "onReset", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], ViewerComponent.prototype, "onSelectionChanged", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], ViewerComponent.prototype, "onShow", void 0);
    ViewerComponent = ViewerComponent_1 = __decorate([
        core_1.Component({
            selector: 'adsk-forge-viewer',
            templateUrl: './viewer.component.html',
            styleUrls: ['./viewer.component.css'],
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
        }),
        __metadata("design:paramtypes", [script_service_1.ScriptService])
    ], ViewerComponent);
    return ViewerComponent;
    var ViewerComponent_1;
}());
exports.ViewerComponent = ViewerComponent;
//# sourceMappingURL=viewer.component.js.map