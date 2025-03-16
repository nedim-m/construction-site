import { Component, HostListener, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ProjectResponse } from '../projects.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectsService } from '../projects.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
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
  mobile:boolean =false;

  constructor(
    private route: ActivatedRoute,
    private projectsService: ProjectsService,private router: Router,
    @Inject(PLATFORM_ID) private platformId: any

  ) {}

  ngOnInit(): void {

    this.checkScreenSize();
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
        height: '50vh',
        thumbnails: true,
        imageAnimation: 'zoom',
        preview: true, 
        previewFullscreen: true, 
        previewCloseOnClick: true, 
        previewKeyboardNavigation: true 
      },
      {
        breakpoint: 768,
        width: '100%',
        height: '50vh',
        thumbnailsColumns: 3
      }
    ];

    this.galleryImages = this.project!.images.map(img => ({
      small: img,
      medium: img,
      big: img
    }));
  }

  @HostListener('window:resize', [])
  checkScreenSize() {
    if (isPlatformBrowser(this.platformId)) {
      this.mobile = window.innerWidth <= 768;
    }
  }


  navigateToProjects() {
    this.router.navigate(['projects']);
  }


  shareOnFacebook() {
    const url = window.location.href; 
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, '_blank');
  }

  copyLink() {
    const url = window.location.href;  
    navigator.clipboard.writeText(url).then(() => {
      alert('Link je kopiran!');
    }).catch(err => {
      console.error('Greška prilikom kopiranja: ', err);
    });
  }
}
