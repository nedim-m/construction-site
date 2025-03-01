import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css'
})
export class ServicesComponent {
  @HostListener('window:scroll', [])
  onScroll() {
    const elements = document.querySelectorAll('.fade-in');
  
   
    if (window.innerWidth < 768) {
      elements.forEach(el => el.classList.add('show'));
      return;
    }
  
    
    elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 100) {
        el.classList.add('show');
      }
    });
  }
  
}
