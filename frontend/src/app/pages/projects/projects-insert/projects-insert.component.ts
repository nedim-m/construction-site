import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Project } from '../projects.model';
import { ProjectsService } from '../projects.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { QuillEditorComponent } from 'ngx-quill';

@Component({
  selector: 'app-project-insert',
  standalone: true,
  imports: [CommonModule, FormsModule,QuillEditorComponent],
  templateUrl: './projects-insert.component.html',
  styleUrl: './projects-insert.component.css'
})
export class ProjectInsertComponent {
  project: Project = {
    startDate: new Date(),
    endDate: new Date(),
    name: '',
    location: '',
    description: '',
    newClient: true,
    images: []
  };
  isLoading = false;

  @ViewChild('projectForm') projectForm!: NgForm;

  constructor(private service: ProjectsService, private router: Router) {}

  onFileChange(event: any) {
    const files = event.target.files;
    this.project.images = [];
    this.isLoading = true;

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

  validateDates(): boolean {
    const startDate = new Date(this.project.startDate);
    const endDate = new Date(this.project.endDate);

    if (!this.project.startDate || !this.project.endDate) {
      Swal.fire('Greška', 'Morate uneti oba datuma.', 'error');
      return false;
    }

    if (startDate > endDate) {
      Swal.fire('Greška', 'Datum početka ne može biti veći od datuma završetka.', 'error');
      return false;
    }

    return true;
  }

  onSubmit() {
    if (!this.projectForm.valid) {
      Swal.fire('Greška', 'Molimo popunite sva obavezna polja.', 'error');
      return;
    }

    if (!this.validateDates()) {
      return;
    }

    Swal.fire({
      title: 'Dodavanje projekta...',
      text: 'Molimo vas, sačekajte.',
      icon: 'info',
      showConfirmButton: false,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

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
