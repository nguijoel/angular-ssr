import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CoreServerPlatformService {
    constructor(@Inject(PLATFORM_ID) private platformId: any) {}
    get isPlatformServer(): boolean { return isPlatformServer(this.platformId);}
    get isPlatformBrowser(): boolean { return isPlatformBrowser(this.platformId);}  
}
