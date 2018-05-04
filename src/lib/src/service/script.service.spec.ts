// tslint:disable:no-string-literal
import { ScriptService, ScriptInfo } from './script.service';

describe('ScriptService', () => {
  let service: ScriptService;

  beforeEach(() => {
    service = new ScriptService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should skip script that has been loaded', async (done: Function) => {
    const scriptUrl = 'http://test.com/test.js';

    service['scripts'][scriptUrl] = {
      src: scriptUrl,
      loaded: true,
      status: 'loaded',
    };

    const actual = await service.loadScript(scriptUrl);
    const expected = {
      src: scriptUrl,
      loaded: true,
      status: 'Already Loaded',
    } as ScriptInfo;

    expect(actual).toEqual(expected);

    done();
  });

  it('should load all scripts', async (done: Function) => {
    const scriptUrl = 'http://test.com/test.js';
    const mockResult = { src: 'name', loaded: true, status: 'Loaded' };

    spyOn(service, 'loadScript').and.returnValue(Promise.resolve(mockResult));

    const result = await service.load(scriptUrl);

    expect(result).toEqual([mockResult]);
    done();
  });
});
