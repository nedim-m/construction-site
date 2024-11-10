import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { HeaderComponent } from "./pages/header/header.component";
import { ContactService } from './pages/contact/contact.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,  HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{

  constructor(private contactService: ContactService) {}

  ngOnInit(): void {
    this.contactService.loadUnreadCountFromStorage();
    this.contactService.refreshUnreadMessageCount();
  }
  title = 'Jaric doo';
}
