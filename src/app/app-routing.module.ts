import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { ShowDetailsComponent } from './show-details/show-details.component';
import { AboutComponent } from './about/about.component';
import { AdminComponent } from './admin/admin.component';


const routes: Routes = [
  { path: 'landing', component: LandingComponent },
  { path: 'about', component: AboutComponent },
  { path: 'details', component: ShowDetailsComponent },
  { path: 'admin', component: AdminComponent },
  { path: '', redirectTo: 'landing', pathMatch: 'full'},
  { path: '**', redirectTo: 'landing', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash : true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
