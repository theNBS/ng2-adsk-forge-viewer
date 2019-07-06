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
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, '../../coverage/ng2-adsk-forge-viewer'),
      reports: ['html', 'lcovonly'],
      fixWebpackSourcePaths: true
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    restartOnFileChange: true,
    files:[
      // Required so that the Autodesk module is registered and unit tests pass
      // NOTE: To adhere to Autodesk's license, The Autodesk Forge Viewer
      // JavaScript **MUST** be delivered from an Autodesk hosted URL.
      'https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/style.min.css',
      'https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/viewer3D.min.js',
    ],
  });
};
