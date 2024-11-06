import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserstatusService {

  private isLoggedInSubject: BehaviorSubject<boolean>;  

  constructor(private authService: AuthService) {

    this.isLoggedInSubject = new BehaviorSubject<boolean>(this.authService.isLoggedIn());
  }


  updateLoginStatus() {
    this.isLoggedInSubject.next(this.authService.isLoggedIn());
  }


  logout() {
    this.authService.clearToken();
    this.updateLoginStatus();  
  }

  
  get isLoggedIn$() {
    return this.isLoggedInSubject.asObservable();
  }
}