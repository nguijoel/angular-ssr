import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { AuthEndpointFactory, AuthEndpointService, ILoginResponse } from '../../common/http';
import { Observable } from 'rxjs';

@Injectable({providedIn:'root'})
export class AuthService {
    constructor(
        private endpointFactory: AuthEndpointFactory,
        private endpointService: AuthEndpointService
    ) { }

    login(userName: string, password: string, rememberMe?: boolean): Observable<boolean> {
        return this.endpointFactory.getLoginEndpoint<ILoginResponse>(userName, password).pipe(
          map(response => this.endpointService.processLoginResponse(response, rememberMe)));
    }

    sysLogin(): Observable<boolean> {
        return this.endpointFactory.getClientLoginEndpoint<ILoginResponse>().pipe(
        map(response => this.endpointService.processLoginResponse(response, false)));
    }

    get isLoggedIn(): boolean { return this.endpointService.isLoggedIn;}
}
