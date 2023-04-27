import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CoreServerPlatformService } from './core-server-platform.service';

const STATE_KEY_PREFIX = 'http_requests:';

@Injectable()
export class CoreServerHttpInterceptor implements HttpInterceptor {
  
    constructor(
        private transferState: TransferState,
        private server: CoreServerPlatformService) { }

        intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
          
          if (req.method !== 'GET') return next.handle(req);
      
          const key = makeStateKey<HttpResponse<object>>(STATE_KEY_PREFIX + req.url);
      
          if (this.server.isPlatformBrowser) {
            // Try reusing transferred response from server
            const cachedResponse = this.transferState.get(key, null);
            if (cachedResponse) {
              this.transferState.remove(key); // cached response should be used for the very first time
              return of(new HttpResponse({
                body: cachedResponse.body,
                status: 200,
                statusText: 'OK (from server)',
                // headers are not transferred by current implementation.
              }));
            }
            return next.handle(req);
          }
      
          if (this.server.isPlatformServer) {
            // Try saving response to be transferred to browser
            return next.handle(req).pipe(tap(event => {
              if (event instanceof HttpResponse && event.status == 200) {
                // Only body is preserved as it is and it seems sufficient for now. 
                // It would be nice to transfer whole response, but http response is not
                // a POJO and it needs custom serialization/deserialization.
                const response = {
                  body: event.body
                };
                
                this.transferState.set(key, response);
              }
            }));
          }

          return next.handle(req);
        }
}