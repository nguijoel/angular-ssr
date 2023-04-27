// ====================================================
// Creative Medium Template
// ====================================================
import { Injectable} from '@angular/core';
import { AuthEndpointService } from './http-auth-endpoint.service';
import { HttpClient} from '@angular/common/http';
import { EndpointFactoryBase } from './http-endpoint-factory-base.service';
import { ConfigurationService } from '../../configuration';
import { ILoginResponse } from '../http.types';


@Injectable({providedIn:'root'})
export class AuthEndpointFactory extends EndpointFactoryBase {
    constructor(
        private endpoint: AuthEndpointService,
        protected override http: HttpClient
    ) {  super(http);}
    
    protected override get loginUrl(): string {  return ConfigurationService.webUrl + '/oauth/token'; }
    protected override get baseApiUrl(): string {return ConfigurationService.apiUrl; }
    protected override get refreshToken(): string { return this.endpoint.refreshToken; }
    protected override get accessToken(): string { return  this.endpoint.accessToken; }
    protected override get apiVersion(): string | number { return ConfigurationService.apiVersion; } 
    protected override get appVersion(): string  { return ConfigurationService.appVersion; }
    protected override get acceptLanguage() { return this.endpoint.acceptLanguage; }
    protected override get multiLanguage() { return this.endpoint.multiLanguage; }
    protected override get clientId(): string { return ConfigurationService.clientId || 'ONTOO';}

    protected get apiVersionNumber(): number { return ConfigurationService.apiVersionNumber; } 

    protected override processLoginResponse(response: ILoginResponse): boolean {
       return this.endpoint.processLoginResponse(response, this.endpoint.rememberMe);
    }
}
