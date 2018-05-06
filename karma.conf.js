module.exports = function (config) {

  var libBase = 'src/lib/';       // transpiled app JS and map files

  config.set({
    basePath: '',
    frameworks: ['jasmine'],

    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter')
    ],

    client: {
      builtPaths: [libBase], // add more spec base paths as needed
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },

    customLaunchers: {
      // From the CLI. Not used here but interesting
      // chrome setup for travis CI using chromium
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },

    files: [
      // System.js for module loading
      'node_modules/systemjs/dist/system.src.js',

      // Polyfills
      'node_modules/core-js/client/shim.js',

      // zone.js
      'node_modules/zone.js/dist/zone.js',
      'node_modules/zone.js/dist/long-stack-trace-zone.js',
      'node_modules/zone.js/dist/proxy.js',
      'node_modules/zone.js/dist/sync-test.js',
      'node_modules/zone.js/dist/jasmine-patch.js',
      'node_modules/zone.js/dist/async-test.js',
      'node_modules/zone.js/dist/fake-async-test.js',

      // tslib
      'node_modules/tslib/tslib.js',

      // ts-mockito
      { pattern: 'node_modules/ts-mockito/**/*.js', included: false, watched: false },

      // lodash
      { pattern: 'node_modules/lodash/**/*.js', included: false, watched: false },

      // RxJs
      { pattern: 'node_modules/rxjs/**/*.js', included: false, watched: false },
      { pattern: 'node_modules/rxjs/**/*.js.map', included: false, watched: false },
      { pattern: 'node_modules/rxjs/Observable/**/*.js', included: false, watched: false },

      // Paths loaded via module imports:
      // Angular itself
      { pattern: 'node_modules/@angular/**/*.js', included: false, watched: false },
      { pattern: 'node_modules/@angular/**/*.js.map', included: false, watched: false },

      { pattern: 'src/demo/systemjs-angular-loader.js', included: false, watched: false },

      'karma-test-shim.js', // optionally extend SystemJS mapping e.g., with barrels

      // transpiled application & spec code paths loaded via module imports
      { pattern: libBase + '**/*.js', included: false, watched: true },

      // Asset (HTML & CSS) paths loaded via Angular's component compiler
      // (these paths need to be rewritten, see proxies section)
      { pattern: libBase + '**/*.html', included: false, watched: true },
      { pattern: libBase + '**/*.css', included: false, watched: true },

      // Paths for debugging with source maps in dev tools
      { pattern: libBase + '**/*.ts', included: false, watched: false },
      { pattern: libBase + '**/*.js.map', included: false, watched: false },

      { pattern: libBase + '**/*.d.ts', included: true, watched: false },

      // Required so that the Autodesk module is registered and unit tests pass
      // NOTE: To adhere to Autodesk's license, The Autodesk Forge Viewer
      // JavaScript **MUST** be delivered from an Autodesk hosted URL.
      'https://developer.api.autodesk.com/modelderivative/v2/viewers/three.min.js?v=4.*.*',
      'https://developer.api.autodesk.com/modelderivative/v2/viewers/viewer3D.min.js?v=4.*.*',
    ],

    // Proxied base paths for loading assets
    proxies: {
      // required for modules fetched by SystemJS
      '/base/src/lib/node_modules/': '/base/node_modules/',
      '/base/src/lib/demo/': '/base/src/demo/'
    },

    exclude: [],
    preprocessors: {},
    reporters: ['progress', 'kjhtml'],

    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
  })
}
