# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="1.5.0></a>
## 1.5.0 (2021-08-25)

- PR #44 Enable loading local SVF files (with thanks to [Damian Harasymczuk](https://github.com/dmh126))

<a name="1.4.0></a>
## 1.4.0 (2021-04-20)

- PR #35 Add version property to ViewerOptions (with thanks to [Damian Harasymczuk](https://github.com/dmh126))

<a name="1.3.0></a>
## 1.3.0 (2021-04-04)

- Updated package dependencies
- Added activate and deactivate methods to BasicExtension

<a name="1.2.6></a>
## 1.2.6 (2021-02-07)

- Updated package dependencies

<a name="1.2.5></a>
## 1.2.5 (2020-05-23)

- Updated package dependencies

<a name="1.2.4></a>
## 1.2.4 (2020-03-14)

- Updated package dependencies

<a name="1.2.3></a>
## 1.2.3 (2019-12-09)

- Updated package dependencies

<a name="1.2.1></a>
## 1.2.1 (2019-11-07)

- Assign random id to viewer div

<a name="1.2.0></a>
## 1.2.0 (2019-09-20)

- Forge Viewer typings are not included with the component as a dependency

<a name="1.1.0></a>
## 1.1.2 (2019-08-11)

- Update to latest viewer typings

<a name="1.1.0></a>
## 1.1.1 (2019-07-12)

- Updated README.md and added CHANGELOG.md and LICENSE

<a name="1.1.0></a>
## 1.1.0 (2019-07-09)

- Updated library to support Viewer version 7

<a name="1.0.1></a>
## 1.0.1 (2019-07-09)

- Updated library to Angular-cli/ng-packagr
- Upgraded to Angular 8 and RxJS 6

<a name="0.2.2></a>
## 0.2.2 (2019-05-11)

- Update to latest forge viewer typings

<a name="0.2.1></a>
## 0.2.1 (2019-02-22)

- Fix build issue

<a name="0.2.0></a>
## 0.2.0 (2019-02-22)

- Switched to official Autodesk forge-viewer typings

<a name="0.1.7></a>
## 0.1.7 (2019-01-08)

- Added missing typings to support DockingPanel

<a name="0.1.6></a>
## 0.1.6 (2018-12-21)

- Correct return type of some typings (could lead to error TS7010 re. lacking a return type)

<a name="0.1.5></a>
## 0.1.5 (2018-12-21)

- Correct typings for toolbar UI

<a name="0.1.4></a>
## 0.1.4 (2018-12-15)

- Added typings and examples to show how to add toolbar buttons

<a name="0.1.3></a>
## 0.1.3 (2018-09-15)

- Upgrade to Viewer version 6.0

<a name="0.1.2></a>
## 0.1.2 (2018-08-09)

- Added a callback when sciprt have been loaded - so that extnesions can be registered before the
  viewer app is initialised
- Added a test extension to exercise loading additional extensions

<a name="0.1.1></a>
## 0.1.1 (2018-06-30)

Events to indicate the viewer is loaded and ready to use have been refactored in to one
call back that indicates the viewer is ready. The callback is delcared on the ViewOptions
passed in to the viewer component. See README.md for more info.

<a name="0.1.0"></a>
## 0.1.0 (2018-06-28)

Upgrade to Forge Viewer v5

<a name="0.0.25"></a>
## 0.0.25 (2018-05-20)

Minor documentation changes

<a name="0.0.24"></a>
## 0.0.24 (2018-05-07)

The first release of the package with full integration tests
