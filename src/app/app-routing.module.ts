import {Injectable, NgModule, OnDestroy} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterModule, RouterStateSnapshot, Routes, UrlTree} from '@angular/router';
import {OverlayComponent} from './modules/overlay/overlay.component';
import {AnnounceComponent} from './modules/announce/announce.component';
import {StreamCompleteComponent} from './modules/stream-complete/stream-complete.component';
import {WaitingScreenWrapperComponent} from './modules/waiting-screen/waiting-screen-wrapper.component';
import {HomeComponent} from './modules/home/home.component';
import {StreamConfigService} from './modules/admin/stream-manager/stream-config.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';


// Using this one weird trick to redirect to an external URL.
@Injectable()
class TalkRedirectGuard implements CanActivate, OnDestroy {
  readonly destroy$ = new Subject();

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  constructor(contentService: StreamConfigService) {
    contentService.currentStream$
      .pipe(takeUntil(this.destroy$)).subscribe(
      (a) => {
        if (a && a.talkUrl) {
          window.location.href = a.talkUrl;
        }
      });
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    return new UrlTree();
  }
}

const routes: Routes = [
  {path: 'overlay', component: OverlayComponent},
  {path: '', component: HomeComponent},
  {path: 'waiting', component: WaitingScreenWrapperComponent},
  {path: 'complete', component: StreamCompleteComponent},
  {path: 'talk', canActivate: [TalkRedirectGuard], children: []},
  {
    path: 'admin',
    loadChildren: () =>
      import('./modules/admin/admin.module').then(m => m.AdminModule),
  },
  {path: 'announce', component: AnnounceComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [TalkRedirectGuard],
})
export class AppRoutingModule {
}
