import { Injectable } from '@angular/core';
import { ContentEndpoint } from './http-content-endpoint.service';

@Injectable({
    providedIn: 'root'
  })
export class DynamicEndpointService extends ContentEndpoint {
    private contentType$: string;
    protected override get contentType() { return this.contentType$; }
    setContentType = (alias: string) => this.contentType$ = alias;
}
