import { browser, element, by } from 'protractor';

describe('QuickStart Lib E2E Tests', () => {

  beforeEach(() => browser.get(''));

  afterEach(() => {
    browser.manage().logs().get('browser').then((browserLog: any[]) => {
      expect(browserLog).toEqual([]);
    });
  });

  it('should display view 1 by default', () => {
    const elm = element(by.id('3D'));
    expect(elm.isElementPresent).toEqual(true);
  });

  it('View 2 should be hidden', () => {
    const elm = element(by.id('2D'));
    expect(elm.isElementPresent).toEqual(false);
  });

  it('View 3 should be hidden', () => {
    const elm = element(by.id('Thumbnail'));
    expect(elm.isElementPresent).toEqual(false);
  });

});
