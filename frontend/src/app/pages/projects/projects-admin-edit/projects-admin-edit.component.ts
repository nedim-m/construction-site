import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ProjectsService } from '../projects.service';
import { CommonModule } from '@angular/common';
import { ProjectResponse } from '../projects.model';

@Component({
  selector: 'app-projects-admin-edit',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule ],
  templateUrl: './projects-admin-edit.component.html',
  styleUrl: './projects-admin-edit.component.css'
})
export class ProjectsAdminEditComponent implements OnInit {

    editProjectForm: FormGroup;

    constructor(
      private fb: FormBuilder,
      private projectsService: ProjectsService,
      private route: ActivatedRoute,
      private router: Router
    ) {
      this.editProjectForm = this.fb.group({
        name: ['', Validators.required],
        startDate: ['', Validators.required],
        endDate: ['', Validators.required],
        location: ['', Validators.required],
        description: ['', Validators.required]
      });
    }
  
    ngOnInit(): void {
        const projectId = this.route.snapshot.params['id'];
        this.projectsService.getProjectById(projectId).subscribe((project: ProjectResponse) => {
          this.editProjectForm.patchValue({
            name: project.name,
     
            startDate: this.formatDate(project.startDate),
            endDate: this.formatDate(project.endDate),
            location: project.location,
            description: project.description
          });
        });
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
      if (this.editProjectForm.valid) {
        const projectData = this.editProjectForm.value;
        const projectId = this.route.snapshot.params['id'];
        this.projectsService.updateProject(projectId, projectData).subscribe(response => {
          console.log('Project updated:', response);
          this.router.navigate(['/projects']); 
        });
      }
    }
  
    goBack() {
      this.router.navigate(['/admin-projects']); 
    }
  }
