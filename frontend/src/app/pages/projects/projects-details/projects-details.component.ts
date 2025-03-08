import { Component, OnInit } from '@angular/core';
import { ProjectResponse } from '../projects.model';
import { ActivatedRoute } from '@angular/router';
import { ProjectsService } from '../projects.service';
import { CommonModule } from '@angular/common';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryModule } from '@kolkov/ngx-gallery';

@Component({
  selector: 'app-projects-details',
  standalone: true,
  imports: [CommonModule, NgxGalleryModule],
  templateUrl: './projects-details.component.html',
  styleUrl: './projects-details.component.css'
})
export class ProjectsDetailsComponent implements OnInit {

  project: ProjectResponse | null = null;
  galleryOptions: NgxGalleryOptions[] = [];
  galleryImages: NgxGalleryImage[] = [];

  constructor(
    private route: ActivatedRoute,
    private projectsService: ProjectsService
  ) {}

  ngOnInit(): void {
    const projectId = this.route.snapshot.paramMap.get('id');
    if (projectId) {
      this.projectsService.getProjectById(+projectId).subscribe((data) => {
        this.project = data;
        if (this.project && this.project.images.length > 0) {
          this.setupGallery();
        }
      });
    }
  }

  private setupGallery(): void {
    this.galleryOptions = [
      {
        width: '100%',
        height: '500px',
        thumbnails: true,
        imageAnimation: 'zoom',
        preview: true, 
        previewFullscreen: true, 
        previewCloseOnClick: true, 
        previewKeyboardNavigation: true 
      },
      {
        breakpoint: 600,
        width: '100%',
        height: '300px',
        thumbnailsColumns: 2
      }
    ];

    this.galleryImages = this.project!.images.map(img => ({
      small: img,
      medium: img,
      big: img
    }));
  }
}
