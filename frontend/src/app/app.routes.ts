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
        path:'contactus',component:ContactComponent
        
    },
    {
        path:'home',component:HomeComponent
        
    },
    {
        path:'admin-login',component:LoginComponent
        
    },
    {
        path:'admin-projects',component:ProjectsAdminOverviewComponent
        
    },

    {
        path:'insert-projects',component:ProjectInsertComponent
        
    },
    {
        path:'project/:id', component:ProjectsDetailsComponent
    },
    { 
        path: 'projects/edit/:id', component: ProjectsAdminEditComponent 
    },
    

];
