import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CoreServerHttpInterceptor } from './core-server-http.interceptor';

@NgModule({
  imports: [],
  providers: [
    {
        provide: HTTP_INTERCEPTORS,
        useClass: CoreServerHttpInterceptor,
        multi: true
    }
]
})
export class CoreServerModule {}
