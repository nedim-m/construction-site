import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';

export const routes: Routes = [
   
    {
        path:'aboutus',component:AboutComponent
    },
    {
        path:'projects',component:HomeComponent
        
    },
    {
        path:'services',component:HomeComponent
        
    },
    {
        path:'contactus',component:HomeComponent
        
    },
    

];
