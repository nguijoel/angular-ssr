import { NgModule, inject } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotFoundComponent } from './modules/general/not-found/not-found.component';
import { LayoutComponent } from './layout/layout.component';
import { AppResolver } from './app.resolvers';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },

  // App routes
  {
    path: '',
    component: LayoutComponent,
    data: { logoHidden: true },
    resolve: { data: () => inject(AppResolver).resolve() },
    children: [
 
      {
        path: 'about',
        loadChildren: () => import('./modules/general/about/about.module')
          .then(mod => mod.AboutModule)
      },
      {
        path: 'login',
        loadChildren: () => import('./modules/general/login/login.module')
          .then(mod => mod.LoginModule)
      },
      {
        path: 'signup',
        loadChildren: () => import('./modules/general/signup/signup.module')
          .then(mod => mod.SignupModule)
      },

      {
        path: 'contact',
        loadChildren: () => import('./modules/general/contact/contact.module')
          .then(mod => mod.ContactModule)
      },
      {
        path: 'bootstrap',
        loadChildren: () => import('./modules/application/example-bootstrap/tutorial.module')
          .then(mod => mod.TutorialModule)
      },
      {
        path: 'components',
        loadChildren: () => import('./modules/application/example-components/tutorial.module')
          .then(mod => mod.TutorialModule)
      },
      {
        path: 'forms',
        loadChildren: () => import('./modules/application/example-forms/tutorial.module')
          .then(mod => mod.TutorialModule)
      },
      {
        path: 'services',
        loadChildren: () => import('./modules/application/example-services/tutorial.module')
          .then(mod => mod.TutorialModule)
      },

      { path: '**', component: NotFoundComponent }]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking'
  })],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule { }