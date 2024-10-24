import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProjectsService } from '../projects.service';
import { ProjectResponse } from '../projects.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent implements OnInit  {

  projects: ProjectResponse[] = [];
  constructor(private projectService: ProjectsService) {}
  ngOnInit(): void {
    this.fetchProjects();
  }
  
  fetchProjects(): void {
    this.projectService.getAllProjects().subscribe(
      (data) => {
        this.projects = data; 
      },
      (error) => {
        console.error('Došlo je do greške prilikom dohvata projekata', error);
      }
    );
  }

}
