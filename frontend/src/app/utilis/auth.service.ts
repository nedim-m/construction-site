import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from '../app.config.prod';
import { catchError, Observable } from 'rxjs';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  baseUrl = `${AppConfig.apiUrl}/login`;



  login(email: string, password: string): Observable<any> {
    const body = { email, password };

    return this.http.post<any>(this.baseUrl, body);
    
  }

  saveToken(token: string): void {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('auth_token', token); // Snimanje tokena u sessionStorage
    }

    var test=this.getToken();
    console.log("Pokusaj da se uzme token iz logina:", test);
   
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('auth_token'); // Dohvatanje tokena iz sessionStorage
    }
    return null;
  }

  clearToken(): void {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('auth_token'); // Brisanje tokena iz sessionStorage
    }
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null; // Provera da li je korisnik ulogovan
  }
}
