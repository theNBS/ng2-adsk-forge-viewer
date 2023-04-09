import { Component, Input, OnChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

export interface ThumbnailOptions {
  getAccessToken?: (onGetAccessToken: (token: string, expire: number) => void) => void;
  documentId: string;
  width?: 100|200|400;
  height?: 100|200|400;
  defaultImageSrc?: string;
}

@Component({
  selector: 'adsk-forge-thumbnail',
  templateUrl: './thumbnail.component.html',
})
export class ThumbnailComponent implements OnChanges {
  @Input() public thumbnailOptions!: ThumbnailOptions;
  public imageSrc!: SafeUrl;

  private token!: string;
  private expire!: number;   // tslint:disable-line

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
  ) { }

  public ngOnChanges() {
    if (this.thumbnailOptions) {
      this.setImageSrc(this.thumbnailOptions.defaultImageSrc);
      this.getThumbnail(this.thumbnailOptions.documentId);
    }
  }

  private getThumbnail(documentId: string) {
    let url = `https://developer.api.autodesk.com/modelderivative/v2/designdata/${documentId}/thumbnail`;

    let opts: string = '';
    if (this.thumbnailOptions.width) opts += `width=${this.thumbnailOptions.width}&`;
    if (this.thumbnailOptions.height) opts += `height=${this.thumbnailOptions.height}&`;
    if (opts) url += `?${opts.slice(0, -1)}`;

    if (this.thumbnailOptions?.getAccessToken) {
      this.thumbnailOptions.getAccessToken(this.setAccessToken.bind(this));
    }
    const headers = {
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'image/png',
    };

    this.http.get(url, { headers, responseType: 'arraybuffer' })
      .subscribe({
        next: data => (data) ? this.setImageSrc(`data:image/png;base64,${this.toBase64(data)}`) : this.setImageSrc(),
        error: error => this.setImageSrc(),
      });
  }

  private setAccessToken(accessToken: string, expiryTime: number) {
    this.token = accessToken;
    this.expire = expiryTime;
  }

  private toBase64(data: ArrayBuffer) {
    return btoa(String.fromCharCode(...new Uint8Array(data) as any));
  }

  private setImageSrc(src: string = '') {
    let imageSrc = '';

    if (src) {
      imageSrc = src;
    } else {
      imageSrc = (this.thumbnailOptions && this.thumbnailOptions.defaultImageSrc) || '';
    }

    this.imageSrc = this.sanitizer.bypassSecurityTrustUrl(imageSrc);
  }
}
