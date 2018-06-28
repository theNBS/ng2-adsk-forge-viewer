import { browser, element, by } from 'protractor';

describe('QuickStart Lib E2E Tests', () => {

  beforeEach(async (done: Function) => {
    await browser.waitForAngularEnabled(true);
    await browser.get('/');
    done();
  });

  afterEach(async (done: Function) => {
    const browserLog = await browser.manage().logs().get('browser');
    expect(browserLog).toEqual([]);
    done();
  });

  it('Should have a viewer component', async (done: Function) => {
    const elm = element(by.id('viewer-component'));
    const actual = await elm.isPresent();
    expect(actual).toEqual(true);
    done();
  });

  it('Should have a Forge Viewer container', async (done: Function) => {
    const elm = element(by.id('ng2-adsk-forge-viewer-container'));
    const actual = await elm.isPresent();
    expect(actual).toEqual(true);
    done();
  });

});
