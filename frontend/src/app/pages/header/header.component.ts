import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../utilis/auth.service';
import { CommonModule } from '@angular/common';
import { UserstatusService } from '../../utilis/userstatus.service';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { ContactService } from '../contact/contact.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;
  unreadMessageCount$ = new BehaviorSubject<number>(0);

  private userStatusSubscription!: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private userStatusService: UserstatusService, 
    private contactService: ContactService
  ) {
    

  }

  ngOnInit() {
  
    this.userStatusSubscription = this.userStatusService.isLoggedIn$.subscribe(
      (status) => {
        this.isLoggedIn = status;  
      }
    );
    this.loadUnreadMessageCount();
   
 
    
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
    this.refreshUnreadMessageCount();
    console.log("Ispis iz openMenu!!");
   
  }

  loadUnreadMessageCount(): void {
    this.contactService.getUnreadMessageCount().subscribe({
      next: (count) => {
        console.log('Inicijalni broj poruka:', count);  // Proverite inicijalnu vrednost
        this.unreadMessageCount$.next(count);  
      },
      error: (err) => console.error('Greška prilikom učitavanja broja poruka', err)
    });
  }

  refreshUnreadMessageCount(): void {
    this.contactService.getUnreadMessageCount().subscribe({
      next: (count) => {
        console.log('Osveženi broj poruka:', count);  
        this.unreadMessageCount$.next(count);  
      },
      error: (err) => console.error('Greška prilikom osvežavanja broja poruka', err)
    });
  }
 
  closeMenu() {
    this.menuValue = false;
    this.menu_icon = 'bi bi-list';
  }

  handleMenuClick() {
    this.refreshUnreadMessageCount(); 
  }


  logout() {
    this.userStatusService.logout();
    this.router.navigate(['/home']);  
  }
}
