"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BasicExtension = (function () {
    function BasicExtension(viewer, options) {
        this.events = [
            Autodesk.Viewing.FIT_TO_VIEW_EVENT,
            Autodesk.Viewing.FULLSCREEN_MODE_EVENT,
            Autodesk.Viewing.GEOMETRY_LOADED_EVENT,
            Autodesk.Viewing.HIDE_EVENT,
            Autodesk.Viewing.ISOLATE_EVENT,
            Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT,
            Autodesk.Viewing.OBJECT_TREE_UNAVAILABLE_EVENT,
            Autodesk.Viewing.RESET_EVENT,
            Autodesk.Viewing.SELECTION_CHANGED_EVENT,
            Autodesk.Viewing.SHOW_EVENT,
        ];
        this.viewer = viewer;
        this.extOptions = options;
    }
    BasicExtension.registerExtension = function () {
        Autodesk.Viewing.theExtensionManager.registerExtension(this.extensionName, BasicExtension);
    };
    BasicExtension.unregisterExtension = function () {
        Autodesk.Viewing.theExtensionManager.unregisterExtension(this.extensionName);
    };
    BasicExtension.onViewerEvent = function (args) {
        // console.log('Event fired', args);
        BasicExtension.publishEvent(args.type, args);
    };
    BasicExtension.subscribeEvent = function (caller, eventName, callback) {
        var info = { caller: caller, eventName: eventName, callback: callback };
        if (!this.supscriptions[info.eventName]) {
            this.supscriptions[info.eventName] = [];
        }
        var alreadySubscribed = this.supscriptions[info.eventName].find(function (item) { return item.caller === info.caller; });
        if (!alreadySubscribed) {
            this.supscriptions[info.eventName].push(info);
        }
    };
    BasicExtension.unsubscribeEvent = function (caller, eventName) {
        if (!this.supscriptions[eventName])
            return;
        var subscriber = this.supscriptions[eventName].find(function (item) { return item.caller === caller; });
        if (subscriber) {
            var index = this.supscriptions[eventName].indexOf(subscriber);
            this.supscriptions[eventName].splice(index, 1);
        }
    };
    BasicExtension.publishEvent = function (eventName, args) {
        var subscribers = BasicExtension.supscriptions[eventName];
        if (!subscribers || subscribers.length === 0)
            return;
        subscribers.forEach(function (item) { return item.callback(args); });
    };
    BasicExtension.prototype.load = function () {
        var _this = this;
        this.events.forEach(function (eventName) {
            _this.viewer.addEventListener(eventName, BasicExtension.onViewerEvent.bind(_this));
        });
        console.log(BasicExtension.extensionName, 'loaded!');
        return true;
    };
    BasicExtension.prototype.unload = function () {
        var _this = this;
        this.events.forEach(function (eventName) {
            _this.viewer.removeEventListener(eventName, BasicExtension.onViewerEvent.bind(_this));
        });
        console.log(BasicExtension.extensionName, 'unloaded!');
        return true;
    };
    BasicExtension.extensionName = 'BasicExtension';
    // TODO: Refactor to use RxJS -- could be a subject and we could return an observable
    BasicExtension.supscriptions = {};
    return BasicExtension;
}());
exports.BasicExtension = BasicExtension;
//# sourceMappingURL=basic-extension.js.map