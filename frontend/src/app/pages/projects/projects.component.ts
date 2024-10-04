import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent {
  projects = [
    {
      title: 'Stambeni Objekat Sarajevo',
      description: 'Izgradnja stambenog objekta u Sarajevu.',
      image: 'assets/project1.jpg',
      link: '#'
    },
    {
      title: 'Komercijalni Objekat Mostar',
      description: 'Renoviranje poslovnog objekta u Mostaru.',
      image: 'assets/project2.jpg',
      link: '#'
    },
    {
      title: 'Industrijski Objekat Tuzla',
      description: 'Izgradnja industrijskog kompleksa u Tuzli.',
      image: 'assets/project3.jpg',
      link: '#'
    }
  ];

}
