import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './containers/home/home.component';
import { NotFoundComponent } from './containers/not-found/not-found.component';
import { Route } from './core/services/route.service';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';

const routes: Routes = [
  Route.withShell([
    {
      path: '',
      redirectTo: '/home',
      pathMatch: 'full'
    },
    {
      path: 'item',
      loadChildren: () => import('./main/items/items.module').then(m => m.ItemModule)
    },
    {
      path: 'sample',
      loadChildren: () => import('./main/sample/sample.module').then(m => m.SampleModule)
    },
    {
      path: 'customers',
      loadChildren: () => import('./+customers/customers.module').then(m => m.CustomersModule)
    },
    { 
      path: 'register', 
      component: RegisterComponent
     },
    {
       path: 'login', 
       component: LoginComponent 
      },
    {
      path: 'home',
      component: HomeComponent
    }
  ]),
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
