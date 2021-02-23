// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client:{
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
      // If a particular test run fails, copy the seed from karma ui (localhost:9876)
      // and paste it here to re-run tests
      jasmine: {
        //seed: '68558',
        random: false,
      },
    },
    jasmineHtmlReporter: {
      suppressAll: true // removes the duplicated traces
    },
    coverageReporter: {
      dir: require('path').join(__dirname, '../../coverage/ng2-adsk-forge-viewer'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' }
      ]
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    restartOnFileChange: true,
    customLaunchers: {
      ChromeNoSandboxHeadless: {
        base: 'ChromeHeadless',
        flags: [
          '--no-sandbox',
          // See https://chromium.googlesource.com/chromium/src/+/lkgr/headless/README.md
          '--headless',
          '--disable-gpu',
          // Without a remote debugging port, Google Chrome exits immediately.
          ' --remote-debugging-port=9222',
        ],
      },
    },
    files:[
      // Required so that the Autodesk module is registered and unit tests pass
      // NOTE: To adhere to Autodesk's license, The Autodesk Forge Viewer
      // JavaScript **MUST** be delivered from an Autodesk hosted URL.
      'https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/style.min.css',
      'https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/viewer3D.min.js',
    ],
  });
};
