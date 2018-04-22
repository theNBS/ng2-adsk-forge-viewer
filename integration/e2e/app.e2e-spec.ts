import { browser, element, by } from 'protractor';

describe('QuickStart Lib E2E Tests', () => {

  beforeEach(() => {
    browser.waitForAngularEnabled(true);
    browser.get('/');
  });

  afterEach(() => {
    browser.manage().logs().get('browser').then((browserLog: any[]) => {
      expect(browserLog).toEqual([]);
    });
  });

  it('Should have a viewer component', () => {
    const elm = element(by.id('viewer-component'));
    expect(elm.isPresent()).toEqual(true);
  });

  it('Should have a Forge Viewer container', () => {
    const elm = element(by.id('ng2-adsk-forge-viewer-container'));
    expect(elm.isPresent()).toEqual(true);
  });

});
