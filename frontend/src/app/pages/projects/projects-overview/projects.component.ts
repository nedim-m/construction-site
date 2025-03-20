import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProjectsService } from '../projects.service';
import { ProjectResponse } from '../projects.model';
import { RouterLink } from '@angular/router';
import { TruncatePipe } from '../../../utilis/truncate.pipe';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, RouterLink,FormsModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css',
})
export class ProjectsComponent implements OnInit {
  projects: ProjectResponse[] = [];

  

  page = 1;
  pageSize = 6;
  totalProjects: number = 0;
  totalPages: number = 0;
  sortBy: string = 'startdate_desc';
  safeDescription!: SafeHtml;

  constructor(private projectService: ProjectsService,private sanitizer: DomSanitizer) {}
  ngOnInit(): void {
    this.fetchProjects();
    
  }

  fetchProjects(): void {
    this.projectService
      .getAllProjects(undefined, this.page, this.pageSize,this.sortBy)
      .subscribe(
        (data) => {
          this.projects = data.result;
          this.totalProjects = data.count;
          this.totalPages = Math.ceil(this.totalProjects / this.pageSize);
          this.projects.forEach(project => {
            // Ograniči opis na 50 karaktera
            const truncatedDescription = project.description.length > 50 
              ? project.description.substring(0, 50) + '...' 
              : project.description;
            
            // Dodeli sigurnu vrednost za HTML
            project.safeDescription = this.sanitizer.bypassSecurityTrustHtml(truncatedDescription);
          });
        },
        (error) => {
          console.error('Došlo je do greške prilikom dohvata projekata', error);
        }
      );
  }


 
  

  onSortChange(): void {
    this.page = 1; 
    this.fetchProjects();
  }

  nextPage() {
    this.page++;
    this.fetchProjects();
  }

  previousPage() {
    if (this.page > 1) {
      this.page--;
      this.fetchProjects();
    }
  }
}
