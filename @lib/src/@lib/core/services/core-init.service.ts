import { Injectable, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Observable, ReplaySubject, Subject} from 'rxjs';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { SiteInfo } from '../models/site.model';
import { SiteService } from './site.service';
import { AuthService } from './auth.service';
import { Util } from '../../utilities';
import { environment } from '../../environments';

@Injectable({ providedIn: 'root' })
export class CoreInitService implements OnDestroy {

    readonly ready = new ReplaySubject<SiteInfo>(1);

    private siteName = '...';
    private pageTitle = '...';
    private unsubscribe = new Subject<void>();
    
    constructor(
        private sitesvc: SiteService,
        private auth: AuthService,
        private title: Title,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) {
        this.initTitle();
    }

    get isProduction() { return Util.isProduction(environment); }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    init(): Observable<SiteInfo> 
    {
        if(this.auth.isLoggedIn)
           return this.sitesvc.info().pipe(tap(info => this.infoReady(info)));
        else    
           return this.auth.sysLogin().pipe(switchMap(()=>  this.sitesvc.info().pipe(tap(info => this.infoReady(info)))));
    }

    setTitle(title?: string) {
        if (title)
            this.pageTitle = title;

        this.title.setTitle(`${this.pageTitle} | ${this.siteName}`);
    }

    private initTitle() {
        this.router.events.pipe(

            filter((event) => event instanceof NavigationEnd),
            map(() => {
                let route = this.activatedRoute;
                while (route.firstChild) route = route.firstChild;
                return route;
            }),
            filter((route: any) => route.outlet === 'primary'),
            map((route: any) => route.snapshot),
            map((snapshot: any) => snapshot.data.title || ''),
            takeUntil(this.unsubscribe))
            .subscribe(pageTitle => this.setTitle(pageTitle));
    }

    private infoReady(info: SiteInfo) {
        this.siteName = info.name;
        this.setTitle();
        
        this.ready.next(info);
    }
}
