import { Component } from '@angular/core';
import { ProjectsService } from '../projects.service';
import { ProjectResponse } from '../projects.model';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-projects-admin-overview',
  standalone: true,
  imports: [CommonModule, TableModule],
  templateUrl: './projects-admin-overview.component.html',
  styleUrl: './projects-admin-overview.component.css',
})
export class ProjectsAdminOverviewComponent {
  projects: ProjectResponse[] = [];

  constructor(private projectsService: ProjectsService, private router: Router) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.projectsService.getAllProjects().subscribe({
      next: (data) => {
        this.projects = data;
      },
      error: (err) => {
        console.error('Greška prilikom preuzimanja projekata:', err);
      },
    });
  }

  onEdit(project: ProjectResponse): void {
    console.log('Editing project:', project);
    // Ovdje dodaj logiku za uređivanje
  }

  onDelete(project: ProjectResponse): void {
    console.log('Deleting project:', project);
    // Ovdje dodaj logiku za brisanje
  }
  navigateToAddProject() {
    this.router.navigate(['insert-projects']);
  }
}
