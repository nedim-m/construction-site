import { Component } from '@angular/core';

import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  menuValue:boolean=false;
  menu_icon :string ='bi bi-list';
  openMenu(){
     this.menuValue =! this.menuValue ;
     this.menu_icon = this.menuValue ? 'bi bi-x' : 'bi bi-list';
   }
    closeMenu() {
     this.menuValue = false;
     this.menu_icon = 'bi bi-list';
   }
}
