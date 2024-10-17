import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Project } from '../projects.model';
import { ProjectsService } from '../projects.service';

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
    location: '',
    description: '',
    images: []
  };

  constructor(private service: ProjectsService) {}

  onFileChange(event: any) {
    const files = event.target.files;
    this.project.images = []; // Clear previous images if any

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
    this.service.addProject(this.project).subscribe(response => {
      console.log('Project added:', response);
    });
  }
}
