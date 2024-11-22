import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { gsap } from 'gsap';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isBrowser: boolean = false; 

  ngOnInit(): void {
    this.isBrowser = typeof window !== 'undefined';

    if (this.isBrowser) {
      
      this.animateElements();

     
      setTimeout(() => {
        this.initializeMap();
      }, 2000); 
    }
  }
  
   private animateElements(): void {
    gsap.from('.animate', {
      opacity: 0,
      y: 50, 
      duration: 1,
      stagger: 0.2, 
      ease: 'power2.out'
    });
  }

 
  private initializeMap(): void {
    import('leaflet').then(L => {
      const map = L.map('map').setView([43.515678, 18.307556], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      const marker = L.marker([43.515678, 18.307556]).addTo(map);
      marker.bindPopup("<b>Jaric d.o.o.</b><br>Naša firma se nalazi ovde.").openPopup();
    });
  }
}
