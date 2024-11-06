import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ProjectsComponent } from './pages/projects/projects-overview/projects.component';
import { ServicesComponent } from './pages/servicess/services.component';


import { LoginComponent } from './pages/login/login.component';
import { ProjectInsertComponent } from './pages/projects/projects-insert/projects-insert.component';
import { ProjectsDetailsComponent } from './pages/projects/projects-details/projects-details.component';
import { ProjectsAdminOverviewComponent } from './pages/projects/projects-admin-overview/projects-admin-overview.component';
import { ProjectsAdminEditComponent } from './pages/projects/projects-admin-edit/projects-admin-edit.component';
import { ContactComponent } from './pages/contact/contact-insert/contact.component';
import { ContactMessagesAdminOverviewComponent } from './pages/contact/contact-messages-admin-overview/contact-messages-admin-overview.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
   
    {
        path:'aboutus',component:AboutComponent
    },
    {
        path:'projects',component:ProjectsComponent
        
    },
    {
        path:'services',component:ServicesComponent
        
    },
    {
        path:'contact-us',component:ContactComponent
        
    },
    {
        path:'admin-messages',canActivate: [authGuard],component:ContactMessagesAdminOverviewComponent
        
    },
    {
        path:'home',component:HomeComponent
        
    },
    {
        path:'admin-login',component:LoginComponent
        
    },
    {
        path:'admin-projects',canActivate: [authGuard],component:ProjectsAdminOverviewComponent
        
    },

    {
        path:'insert-projects',canActivate: [authGuard],component:ProjectInsertComponent
        
    },
    {
        path:'project/:id', component:ProjectsDetailsComponent
    },
    { 
        path: 'projects/edit/:id',canActivate: [authGuard], component: ProjectsAdminEditComponent 
    },
    

];
