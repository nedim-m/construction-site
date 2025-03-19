import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { HeaderComponent } from "./pages/header/header.component";
import { ContactService } from './pages/contact/contact.service';
import { UserstatusService } from './utilis/userstatus.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {

  isLoggedIn = false;
  private userStatusSubscription!: Subscription;

  constructor(
    private contactService: ContactService,
    private userStatusService: UserstatusService
  ) {}

  ngOnInit(): void {
    this.userStatusSubscription = this.userStatusService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;

      
      if (this.isLoggedIn) {
        this.contactService.loadUnreadCountFromStorage();
        this.contactService.refreshUnreadMessageCount();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.userStatusSubscription) {
      this.userStatusSubscription.unsubscribe();
    }
  }

  title = 'Jaric doo';
}
