import { Injectable } from '@angular/core';
import { SiteEndpointService } from './site-endpoint.service';
import { Observable, of } from 'rxjs';
import { SiteInfo } from '../models/site.model';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class SiteService {

  current?: SiteInfo;

  constructor(private endpoint: SiteEndpointService) { }

  get domain(): string {return this.current?.uid || '';}

  info = (): Observable<SiteInfo> => this.current
     ? of(this.current)
     : this.endpoint.getContentNodeEndpoint<SiteInfo>('site').pipe(
      map(response => this.current =  new SiteInfo(response)));
}
