import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CoreInitService } from '../../@lib/src/@lib/core';


@Injectable({providedIn: 'root'})
export class AppResolver 
{
    /**
     * Constructor
     */
    constructor(private coresvc: CoreInitService) { }

    /**
     * Use this resolver to resolve initial mock-api for the application
     *
     */
    resolve(): Observable<unknown> {
        return this.coresvc.init()
    }
}
