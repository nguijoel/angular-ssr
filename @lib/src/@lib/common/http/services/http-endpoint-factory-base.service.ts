// ====================================================
// Creative Medium Template
// ====================================================
import { Injectable} from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { map, mergeMap, switchMap, catchError } from 'rxjs/operators';
import { ILoginResponse } from '../http.types';


@Injectable()
export class EndpointFactoryBase {
    private taskPauser: Subject<any>;
    private isRefreshingLogin: boolean;
   
    constructor(protected http: HttpClient) { }
    protected get loginUrl(): string { return null; }
    protected get baseApiUrl(): string { return null; }
    protected get refreshToken(): string { return null; }
    protected get accessToken(): string { return null; }
    protected get apiVersion(): string | number { return null; } 
    protected get appVersion(): string { return null; }
    protected get appDomain(): string { return null; }
    protected get clientId(): string { return 'ONTOO';}
    protected get acceptLanguage() { return null; }
    protected get multiLanguage() { return null; }
    
    getLoginEndpoint = <T>(userName: string, password: string, credentials?: boolean, endpoint?: string): Observable<T> =>
    this.loginEndpoint<T>(userName, password,'password', credentials, endpoint);
   
    getClientLoginEndpoint = <T>(): Observable<T> => this.loginEndpoint<T>(null, null,'client');
    
    getLoginExternalEndpoint = <T>(): Observable<T> => this.loginEndpoint<T>(null,null,'external', true);
   
    getRefreshLoginEndpoint<T>(): Observable<T> {

        console.log('XXX:SSR:', 'getRefreshLoginEndpoint');
        
        if(!this.refreshToken) return this.getClientLoginEndpoint();


        // eslint-disable-next-line @typescript-eslint/naming-convention
        const header = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }),
         params = new HttpParams()
            .append('refresh_token', this.refreshToken)
            .append('grant_type', 'refresh_token')
            .append('client_id', this.clientId)
            .append('scope', this.loginScope),

         requestBody = params.toString();

        return this.http.post<T>(this.loginUrl, requestBody, { headers: header }).pipe<T>(
            catchError(error => this.handleError(error, () => this.getRefreshLoginEndpoint())));
    }

    protected processLoginResponse(response: ILoginResponse): void {console.log(response)}

    protected get loginScope(): string{return  'openid email phone profile offline_access roles';}

    protected appendPagingQuery(page: number, size: number, level?: number, sort?: string, extended?: string[]){
      
        const q = [];

            if(page)
               q.push('page=' + page); 
            
            if(size)
               q.push('size=' + size); 
            
             if(level)
               q.push('level=' + level);    

            if(sort)
               q.push('sort=' + sort); 
            
            extended?.forEach(e=> q.push(e));   
               
            if(q.length)
               return '?' + q.join('&');
                
            return '';
    }

   protected getRequestHeaders = (): { headers: HttpHeaders | { [header: string]: string | string[] } } => ({ headers: new HttpHeaders(this.getRequestHeaderOptions()) });
   
   // eslint-disable-next-line @typescript-eslint/naming-convention
   protected getAuthorizationRequestHeaderOptions= (): any => ({Authorization: 'Bearer ' + this.accessToken});

   protected getRequestHeaderOptions(): any {
    
    const options = {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Authorization: 'Bearer ' + this.accessToken,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'Content-Type': 'application/json',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Accept: `application/vnd.iman.v${this.apiVersion}+json, application/json, text/plain, */*`,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'App-Version': this.appVersion
     };

    if(this.multiLanguage){
        options['Accept-Language'] = this.acceptLanguage;
        options['Filter-Language'] = this.acceptLanguage;
   }else
   options['Accept-Language'] = 'en-US';

    return  this.appendDomain(options, this.appDomain);

   }

   protected handleError(error: any, continuation: () => Observable<any>) {
        
        if (error.status == 401) {
            
            if (this.isRefreshingLogin) 
                return this.pauseTask(continuation);
      
            this.isRefreshingLogin = true;

            return this.refreshLogin().pipe(
                mergeMap(data => {
                    this.isRefreshingLogin = false;
                    this.resumeTasks(true);

                    return continuation();
                }),
                catchError(refreshLoginError => {
                    this.isRefreshingLogin = false;
                    this.resumeTasks(false);

                    if (refreshLoginError.status == 401 ||  this.isLoginRedirect(refreshLoginError.url)) 
                        return this.throwErrorMessage('session expired');
                    else 
                        return throwError(refreshLoginError || 'server error');
                }));
        }

        if (this.isLoginRedirect(error.url)) 
            return this.throwErrorMessage(error, 'session expired');
        else 
            return this.throwErrorMessage(error);
   }

    private isLoginRedirect = (url: string): boolean => url &&  this.loginUrl && url.toLowerCase().includes(this.loginUrl.toLowerCase());

    private throwErrorMessage(error: any, context?: string){
        
         const message = error.error 
         ? error.error.error_description || error.error.errorDescription 
         : null;

         if(context && message) 
            return throwError(context + ' (' + message + ')');

         else if(context)
            return throwError(context);

         else if(message)
            return throwError(message);
        
        return throwError(error);
    }

    private pauseTask(continuation: () => Observable<any>) {
        if (!this.taskPauser)
            this.taskPauser = new Subject();

        return this.taskPauser.pipe(switchMap(continueOp => continueOp ? continuation() : throwError('session expired')));
    }

    private resumeTasks(continueOp: boolean) {
        setTimeout(() => {
            if (this.taskPauser) {
                this.taskPauser.next(continueOp);
                this.taskPauser.complete();
                this.taskPauser = null;
            }
        });
    }

    private refreshLogin = (): Observable<any> => this.getRefreshLoginEndpoint<any>().pipe(map(response => this.processLoginResponse(response)));

    private loginEndpoint<T>(username: string, password: string, grant: string, credentials?: boolean, endpoint?: string): Observable<T> {
  
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const headers = this.appendDomain({ 'Content-Type': 'application/x-www-form-urlencoded'}, this.appDomain),
        options =  { headers: new HttpHeaders(headers)};

        let  params = new HttpParams()
        .append('grant_type', grant)
        .append('client_id', this.clientId)
        .append('scope', this.loginScope);
         
        if(password && username)
         params = params
         .append('username', username)
         .append('password', password);
        if(credentials) options['withCredentials'] = true;
        return this.http.post<T>(endpoint || this.loginUrl,  params.toString(), options);
    }

    private appendDomain(options: any, domain: string): any {
        if(domain) options['App-Domain'] = domain;
         return options;
    }
}
