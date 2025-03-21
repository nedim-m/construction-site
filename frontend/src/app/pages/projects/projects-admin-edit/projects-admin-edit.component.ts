import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ProjectsService } from '../projects.service';
import { CommonModule } from '@angular/common';
import { ImageResponse, ProjectResponse } from '../projects.model';
import { ImagesService } from '../images.service';

@Component({
  selector: 'app-projects-admin-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './projects-admin-edit.component.html',
  styleUrl: './projects-admin-edit.component.css',
})
export class ProjectsAdminEditComponent implements OnInit {
  editProjectForm: FormGroup;
  isGalleryOpen = false;
  projectImages: ImageResponse[] = [];

  selectedFiles: string[] = [];
  projectId!: number;

  constructor(
    private fb: FormBuilder,
    private projectsService: ProjectsService,
    private imageService: ImagesService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.editProjectForm = this.fb.group({
      name: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      location: ['', Validators.required],
      description: ['', Validators.required],
      newClient: [false, Validators.required],
    }, { validator: this.dateValidator });
  }

  @ViewChild('fileInput') fileInput!: ElementRef;
  ngOnInit(): void {
    this.projectId = this.route.snapshot.params['id'];
    this.loadProjectData();
    this.loadProjectImages();
  }

  private loadProjectData() {
    this.projectsService
      .getProjectById(this.projectId)
      .subscribe((project: ProjectResponse) => {
        this.editProjectForm.patchValue({
          name: project.name,
          startDate: this.formatDate(project.startDate),
          endDate: this.formatDate(project.endDate),
          location: project.location,
          description: project.description,
          newClient:project.newClient
        });
      });
  }

  private loadProjectImages() {
    this.imageService.getImagesByProjectId(this.projectId).subscribe(
      (images: ImageResponse[]) => {
        console.log('Loaded images:', images); 
        this.projectImages = images; 
      },
      (error) => {
        console.error('Error loading images:', error);
      }
    );
}

  private formatDate(date: Date): string {
    if (!date) return '';
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  }

  onSave() {
    if (this.editProjectForm.invalid) {
      Swal.fire('Greška', 'Molimo popunite sva obavezna polja ispravno.', 'error');
      return;
    }

    const projectData = this.editProjectForm.value;
    this.projectsService.updateProject(this.projectId, projectData).subscribe(
      (response) => {
        console.log('Project updated:', response);
        Swal.fire('Uspješno!', 'Projekat je uspješno izmijenjen.', 'success')
          .then(() => this.router.navigate(['/projects']));
      },
      (error) => {
        Swal.fire('Greška', 'Došlo je do greške prilikom ažuriranja projekta.', 'error');
      }
    );
  }


  goBack() {
    this.router.navigate(['/admin-projects']);
  }

  openGallery() {
    this.isGalleryOpen = true;
    
  }

  closeGallery() {
    this.isGalleryOpen = false;
  }

 
  onFileChange(event: any) {
    const files = event.target.files;
    this.selectedFiles = []; 
  
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
  
      reader.onload = (e: any) => {
        const base64Image = e.target.result;
        this.selectedFiles.push(base64Image); 
      };
  
      reader.readAsDataURL(file); 
    }
  }
  addImages() {
    if (this.selectedFiles.length === 0) return; 
  
  
    Swal.fire({
      title: 'Dodavanje slika...',
      text: 'Molimo vas, sačekajte.',
      icon: 'info',
      showConfirmButton: false, 
      allowOutsideClick: false, 
      didOpen: () => {
        Swal.showLoading(); 
      }
    });
  
    this.imageService.addImages(this.projectId, this.selectedFiles).subscribe(
      (response) => {
        this.loadProjectImages(); 
        this.selectedFiles = []; 
  
        if (this.fileInput) {
          this.fileInput.nativeElement.value = ''; 
        }
  
       
        Swal.fire('Uspjeh', 'Slike su uspješno dodate!', 'success');
      },
      (error) => {
        
        Swal.fire('Greška', 'Dodavanje slika nije uspelo', 'error');
      }
    );
  }
  
  
  setAsCover(imageId: number) {
  Swal.fire({
    title: 'Da li želite postaviti ovu sliku kao naslovnu?',
    text: "Ova akcija će postaviti ovu sliku kao naslovnu za projekat.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Da, postavi!',
    cancelButtonText: 'Otkaži'
  }).then((result) => {
    if (result.isConfirmed) {
      this.imageService.setAsCover(this.projectId, imageId).subscribe({
        next: () => {
          Swal.fire(
            'Uspešno!',
            'Slika je postavljena kao naslovna.',
            'success'
          );
        },
        error: (error) => {
          console.error('Greška prilikom postavljanja naslovne slike:', error);
          Swal.fire(
            'Greška!',
            'Došlo je do greške prilikom postavljanja naslovne slike.',
            'error'
          );
        }
      });
    }
  });
}
  
  
  

  deleteImage(imageId: number) {
    console.log(`Ispis iz servisa ID: ${imageId}`);
    
    Swal.fire({
        title: 'Da li ste sigurni?',
        text: 'Ovo će trajno obrisati sliku.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Da, obriši je!',
        cancelButtonText: 'Ne, otkaži',
    }).then((result) => {
        if (result.isConfirmed) {
           
            const imageIdsToDelete = [imageId]; 
            
        
            this.imageService.deleteImages(this.projectId, imageIdsToDelete).subscribe(
                (response) => {
                    this.loadProjectImages(); 
                    Swal.fire('Obrisano!', 'Vaša slika je obrisana.', 'success');
                },
                (error) => {
                    Swal.fire('Greška', 'Nije uspelo brisanje slike', 'error');
                }
            );
        }
    });
}

private dateValidator(group: FormGroup) {
  const startDate = new Date(group.get('startDate')?.value);
  const endDate = new Date(group.get('endDate')?.value);

  return startDate && endDate && startDate > endDate
    ? { invalidDateRange: true }
    : null;
}

}
