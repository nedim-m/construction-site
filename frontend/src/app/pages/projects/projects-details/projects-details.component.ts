import { Component, OnInit } from '@angular/core';
import { ProjectResponse } from '../projects.model';
import { ActivatedRoute } from '@angular/router';
import { ProjectsService } from '../projects.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-projects-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects-details.component.html',
  styleUrl: './projects-details.component.css'
})
export class ProjectsDetailsComponent implements OnInit {

  project: ProjectResponse | null = null;
  isModalOpen = false; // Kontrolira prikaz modal-a
  currentImage: string = ''; // Trenutna slika koja je uvećana
  currentIndex: number = 0; // Trenutni indeks slike

  constructor(
    private route: ActivatedRoute,
    private projectsService: ProjectsService
  ) {}

  ngOnInit(): void {
    const projectId = this.route.snapshot.paramMap.get('id');
    if (projectId) {
      this.projectsService.getProjectById(+projectId).subscribe((data) => {
        this.project = data;
        // Postavi prvu sliku na početku
        if (this.project && this.project.images.length > 0) {
          this.currentImage = this.project.images[0];
        }
      });
    }
  }

  openModal(index: number): void {
    if (this.project && this.project.images.length > 0) {
      this.currentImage = this.project.images[index];
      this.currentIndex = index;
      this.isModalOpen = true;
    }
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  nextImage(event: Event): void {
    event.stopPropagation(); // Spriječi zatvaranje modala na klik
    if (this.project && this.currentIndex < this.project.images.length - 1) {
      this.currentIndex++;
      this.currentImage = this.project.images[this.currentIndex];
    }
  }

  previousImage(event: Event): void {
    event.stopPropagation(); // Spriječi zatvaranje modala na klik
    if (this.project && this.currentIndex > 0) {
      this.currentIndex--;
      this.currentImage = this.project.images[this.currentIndex];
    }
  }
}