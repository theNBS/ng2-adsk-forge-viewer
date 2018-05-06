import { Injectable } from '@angular/core';

declare var document: any;

export interface ScriptInfoLookup {
  [key: string]: ScriptInfo;
}

export interface ScriptInfo {
  src: string;
  loaded: boolean;
  status?: string;
}

@Injectable()
export class ScriptService {

  private scripts: ScriptInfoLookup = {};

  constructor() {
    // Nothing to do
  }

  public load(...urls: string[]): Promise<ScriptInfo[]> {
    const promises: Promise<ScriptInfo>[] = [];

    urls.forEach((src) => {
      if (this.scripts[src] && this.scripts[src].loaded) {
        return;
      }

      this.scripts[src] = { src, loaded: false };
      return promises.push(this.loadScript(src));
    });

    return Promise.all(promises);
  }

  public loadScript(name: string): Promise<ScriptInfo> {
    return new Promise((resolve, reject) => {
      // resolve if already loaded
      if (this.scripts[name] && this.scripts[name].loaded) {
        resolve({ src: name, loaded: true, status: 'Already Loaded' });
        return;
      }

      // load script
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = this.scripts[name].src;

      if (script.readyState) {  // IE
        script.onreadystatechange = () => {
          if (script.readyState === 'loaded' || script.readyState === 'complete') {
            script.onreadystatechange = null;
            this.scripts[name].loaded = true;

            resolve({ src: name, loaded: true, status: 'Loaded' });
          }
        };
      } else {  // Others
        script.onload = () => {
          this.scripts[name].loaded = true;

          resolve({ src: name, loaded: true, status: 'Loaded' });
        };
      }

      script.onerror = (error: any) => resolve({ src: name, loaded: false, status: 'Loaded' });
      document.getElementsByTagName('head')[0].appendChild(script);
    });
  }
}
