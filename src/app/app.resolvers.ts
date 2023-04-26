import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({providedIn: 'root'})
export class AppResolver 
{

    /**
     * Use this resolver to resolve initial mock-api for the application
     *
     */
    resolve(): Observable<unknown> {
        
        console.log('RESOLVER....');
        return of({});
    }
}
