import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ProjectsComponent } from './pages/projects/projects-overview/projects.component';
import { ServicesComponent } from './pages/servicess/services.component';
import { ContactComponent } from './pages/contact/contact.component';
import { HeaderComponent } from './pages/header/header.component';
import { LoginComponent } from './pages/login/login.component';
import { ProjectInsertComponent } from './pages/projects/projects-insert/projects-insert.component';

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
        path:'loginAdmin',component:LoginComponent
        
    },
    {
        path:'insert-projects',component:ProjectInsertComponent
        
    },
    

];
