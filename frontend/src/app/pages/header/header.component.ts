import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../utilis/auth.service';
import { CommonModule } from '@angular/common';
import { UserstatusService } from '../../utilis/userstatus.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;
  private userStatusSubscription!: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private userStatusService: UserstatusService  
  ) {}

  ngOnInit() {
  
    this.userStatusSubscription = this.userStatusService.isLoggedIn$.subscribe(
      (status) => {
        this.isLoggedIn = status;  
      }
    );
  }

  ngOnDestroy() {
   
    if (this.userStatusSubscription) {
      this.userStatusSubscription.unsubscribe();
    }
  }

  menuValue: boolean = false;
  menu_icon: string = 'bi bi-list';

  openMenu() {
    this.menuValue = !this.menuValue;
    this.menu_icon = this.menuValue ? 'bi bi-x' : 'bi bi-list';
  }

  closeMenu() {
    this.menuValue = false;
    this.menu_icon = 'bi bi-list';
  }

  logout() {
    this.userStatusService.logout();
    this.router.navigate(['/login']);  
  }
}
