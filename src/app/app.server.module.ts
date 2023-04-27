import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { CoreServerModule } from '../../@lib/src/@lib/core/server';

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    CoreServerModule
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
