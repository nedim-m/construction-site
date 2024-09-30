import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isBrowser: boolean = false; 

  ngOnInit(): void {
    this.isBrowser = typeof window !== 'undefined'; 

    if (this.isBrowser) {
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
}
