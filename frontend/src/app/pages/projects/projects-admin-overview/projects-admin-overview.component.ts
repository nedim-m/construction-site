import { Component } from '@angular/core';
import { ProjectsService } from '../projects.service';
import { ProjectResponse } from '../projects.model';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

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

  onDelete(projectId: number): void {
    Swal.fire({
      title: 'Jeste li sigurni?',
      text: 'Ovaj projekat i sve njegove slike bit će trajno obrisani.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Da, obriši!',
      cancelButtonText: 'Otkaži'
    }).then((result) => {
      if (result.isConfirmed) {
        
        this.projectsService.deleteProject(projectId).subscribe(() => {
          Swal.fire(
            'Obrisano!',
            'Projekat je uspješno obrisan.',
            'success'
          );
         
          this.loadProjects();
        }, error => {
          Swal.fire(
            'Greška!',
            'Došlo je do problema prilikom brisanja projekta.',
            'error'
          );
        });
      }
    });
  }
  navigateToAddProject() {
    this.router.navigate(['insert-projects']);
  }
}
