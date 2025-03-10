import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { gsap } from 'gsap';
import { ProjectsService } from '../projects/projects.service';
import { count } from 'console';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isBrowser: boolean = false; 
  projectCount: number = 0;
  yearsOfExpirience=0;
  todayYear= new Date().getFullYear();
  happyCustomer :number=0;

  latitude = 43.66028; 
  longitude = 17.76167;


  constructor(private projectService : ProjectsService){}

  ngOnInit(): void {
    this.isBrowser = typeof window !== 'undefined';

    this.projectService.getProjectNumber().subscribe(
      (data) => {
        this.projectCount = data.numberOfProjects || 0; 
        this.happyCustomer=data.numberOfClients || 0;
        
      }
    );
    this.yearsOfExpirience=this.todayYear-2023;
    


    if (this.isBrowser && window.innerWidth > 900) {
      this.animateElements();
    }
    
  
    

  }
  
   private animateElements(): void {
    gsap.from('.animate', {
      opacity: 0,
      y: 50, 
      duration: 1,
      stagger: 0.2, 
      ease: 'power2.out'
    });
  }

 
  get mapUrl(): string {
    return `https://www.google.com/maps?q=${this.latitude},${this.longitude}&output=embed`;
  }
}
