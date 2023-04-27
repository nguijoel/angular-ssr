// ====================================================
// Creative Medium Template
// ====================================================
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { DBkeys, LocalStoreManager } from '@lib/@helpers';
import { ILoginResponse } from '@lib/common/http/http.types';
import { environment } from '@lib/environments';


const TS = (environment as any).ts;

@Injectable({ providedIn: 'root' })
export class AuthEndpointService {
    loginRedirectUrl: string;
    logoutRedirectUrl: string;
    reLoginDelegate: () => void;
    private previousIsLoggedInCheck = false;
    private $loginStatus = new Subject<boolean>();
    private $ts: number;


    constructor(
        private localStorage: LocalStoreManager) {
    }

    get isLoggedIn(): boolean {
        return this.getEnvData(DBkeys.ACCESS_TOKEN) !== null;
    }

    get acceptLanguage() { return this.localStorage.getData(DBkeys.LANG_ACCEPT); }
    get multiLanguage() { return this.localStorage.getData(DBkeys.LANG_MULTI); }


    get accessToken(): string {
        this.reevaluateLoginStatus();
        return this.getEnvData(DBkeys.ACCESS_TOKEN);
    }

    get refreshToken(): string {
        this.reevaluateLoginStatus();
        return  this.localStorage.getData(DBkeys.REFRESH_TOKEN); //this.getEnvData(DBkeys.REFRESH_TOKEN);
    }

    get rememberMe(): boolean {
        return this.localStorage.getDataObject<boolean>(DBkeys.REMEMBER_ME) === true;
    }

    getLoginStatusEvent(): Observable<boolean> {
        return this.$loginStatus.asObservable();
    }

    processLoginResponse(response: ILoginResponse, rememberMe = false): void {

        if (response.access_token == null)
            throw new Error('Received accessToken was empty');

        const accessToken = response.access_token,
            refreshToken = response.refresh_token || this.refreshToken,
            expiresIn = response.expires_in,
            tokenExpiryDate = this.createExpiry(expiresIn);

        this.saveUserDetails(accessToken, refreshToken, tokenExpiryDate, rememberMe);
        this.reevaluateLoginStatus();
    }

    private createExpiry(expiresIn: number): Date {
        const date = new Date();
        date.setSeconds(date.getSeconds() + expiresIn);
        return date;
    }

    private saveUserDetails(accessToken: string, refreshToken: string, expiresIn: Date, rememberMe: boolean) {

        if (rememberMe) {
            this.localStorage.savePermanentData(accessToken, DBkeys.ACCESS_TOKEN);
            this.localStorage.savePermanentData(refreshToken, DBkeys.REFRESH_TOKEN);
            this.localStorage.savePermanentData(expiresIn, DBkeys.TOKEN_EXPIRES_IN);
            if (TS) this.localStorage.savePermanentData(TS, DBkeys.APP_TS);
        }
        else {
            this.localStorage.saveSyncedSessionData(accessToken, DBkeys.ACCESS_TOKEN);
            this.localStorage.saveSyncedSessionData(refreshToken, DBkeys.REFRESH_TOKEN);
            this.localStorage.saveSyncedSessionData(expiresIn, DBkeys.TOKEN_EXPIRES_IN);
            if (TS) this.localStorage.saveSyncedSessionData(TS, DBkeys.APP_TS);
        }
        this.localStorage.savePermanentData(rememberMe, DBkeys.REMEMBER_ME);
    }

    private reevaluateLoginStatus() {

        const isLoggedIn = this.isLoggedIn;

        if (this.previousIsLoggedInCheck != isLoggedIn)
            setTimeout(() => {
                this.$loginStatus.next(isLoggedIn);
            });

        this.previousIsLoggedInCheck = isLoggedIn;
    }

    private getEnvData(key: string): string {

        if (TS  &&  TS !== this.ts) return null;

        return this.localStorage.getData(key);
    }

    private get ts(): number {return this.$ts || (this.$ts = this.localStorage.getDataObject<number>(DBkeys.APP_TS));}
}
