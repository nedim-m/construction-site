import { Component, HostListener, Inject, OnInit, PLATFORM_ID, TransferState,makeStateKey } from '@angular/core';
import { ProjectResponse } from '../projects.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectsService } from '../projects.service';
import { CommonModule, isPlatformBrowser, isPlatformServer } from '@angular/common';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryModule } from '@kolkov/ngx-gallery';
import { Meta, Title } from '@angular/platform-browser';


const META_STATE_KEY = makeStateKey('metaTags');

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
  mobile: boolean = false;
  private defaultTitle: string = 'Jaric d.o.o';

  constructor(
    private route: ActivatedRoute,
    private projectsService: ProjectsService, 
    private router: Router,
    private meta: Meta,  
    private title: Title,
    private state: TransferState, 
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
        
        this.updateMetaTags(); 
      });
    }
  }

  
  private updateMetaTags(): void {
    if (!this.project) return;
  
    const imageUrl = this.project.images.length > 0 
      ? this.project.images[0] 
      : 'https://default-image-url.com/default.jpg';
  
    const projectUrl = `https://jaric.runasp.net/project/${this.project.id}`;

    this.defaultTitle = this.title.getTitle();  
  
    this.title.setTitle(this.project.name);
  

    const tags: { property?: string; name?: string; content: string }[] = [
      { name: 'title', content: this.project.name }, 
      { name: 'description', content: this.project.description },
      { property: 'og:title', content: this.project.name },
      { property: 'og:description', content: this.project.description },
      { property: 'og:image', content: imageUrl },
      { property: 'og:url', content: projectUrl },
      { property: 'og:type', content: 'website' },
      { property: 'og:image:alt', content: 'Project image' }
    ];
  

    tags.forEach(tag => {
      if (tag.property) {
        this.meta.updateTag({ property: tag.property, content: tag.content });
      } else if (tag.name) {
        this.meta.updateTag({ name: tag.name, content: tag.content });
      }
    });
  
  
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
        thumbnailsColumns: 3,
        preview: false
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
  
    if (this.mobile) {
     
      const facebookAppUrl = `fb://facewebmodal/share?href=${encodeURIComponent(url)}`;
  
      
      const appWindow = window.open(facebookAppUrl, '_blank');
  
      
      if (!appWindow || appWindow.closed || typeof appWindow.closed === 'undefined') {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
      }
    } else {
      
      const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
      window.open(facebookUrl, '_blank');
    }
  }
  
  
  


  copyLink() {
    const url = window.location.href;  
    navigator.clipboard.writeText(url).then(() => {
      alert('Link je kopiran!');
    }).catch(err => {
      console.error('Greška prilikom kopiranja: ', err);
    });
  }

  ngOnDestroy(): void {
    this.title.setTitle(this.defaultTitle);
    console.log('Naslov resetovan prilikom napuštanja komponente:', this.defaultTitle);
  }
}
