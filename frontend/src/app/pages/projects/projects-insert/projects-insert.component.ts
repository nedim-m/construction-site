import { Component, ViewChild } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Project } from '../projects.model';
import { ProjectsService } from '../projects.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project-insert',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './projects-insert.component.html',
  styleUrl: './projects-insert.component.css'
})
export class ProjectInsertComponent {
  project: Project = {
    startDate: new Date(),
    endDate: new Date(),
    name:'',
    location: '',
    description: '',
    images: []
  };

  @ViewChild('projectForm') projectForm!: NgForm;
  constructor(private service: ProjectsService,private router: Router) {}

  onFileChange(event: any) {
    const files = event.target.files;
    this.project.images = []; 

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const base64Image = e.target.result;
        this.project.images.push(base64Image);
      };

      reader.readAsDataURL(file); 
    }
  }

  
  onSubmit() {
    if (this.projectForm.valid) {
      this.service.addProject(this.project).subscribe(
        response => {
          console.log('Project added:', response);
          Swal.fire({
            icon: 'success',
            title: 'Uspešno!',
            text: 'Projekat je uspešno dodat.',
            confirmButtonText: 'U redu'
          }).then(() => {
            
            this.router.navigate(['/admin-projects']); 
          });
          this.projectForm.reset(); 
        },
        error => {
          console.error('Greška prilikom dodavanja projekta:', error);
          Swal.fire({
            icon: 'error',
            title: 'Greška!',
            text: 'Došlo je do greške prilikom dodavanja projekta.',
            confirmButtonText: 'U redu'
          });
        }
      );
    }
  }
}
