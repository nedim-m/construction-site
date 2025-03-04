import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AppConfig } from '../../app.config.prod';
import { ContactMessage, ContactMessageResponse } from './contact-message.model';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  constructor(private http: HttpClient) {}

  baseUrl = `${AppConfig.apiUrl}/contactmessage`;

  private unreadMessageCountSubject = new BehaviorSubject<number>(0);
  unreadMessageCount$ = this.unreadMessageCountSubject.asObservable();

  insertMessage(messageData: ContactMessage): Observable<any> {
    return this.http.post(this.baseUrl, messageData);
  }

  getAllMessages(): Observable<ContactMessageResponse[]> {
    const token = sessionStorage.getItem('auth_token');
    
    // Kreiraj headers sa Authorization header ako token postoji
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    // Napravi HTTP GET zahtjev sa zaglavljem
    return this.http.get<ContactMessageResponse[]>(this.baseUrl, { headers });
  }

  getMessageById(id: number): Observable<ContactMessageResponse> {
    
    return this.http.get<ContactMessageResponse>(`${this.baseUrl}/${id}`);
  }

  deleteMessage(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  updateMessageStatus(id: number, isRead: boolean): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}/status`, isRead);
  }

  getUnreadMessageCount(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/unread-message-count`).pipe(
      tap(count => {
        this.unreadMessageCountSubject.next(count);
        // Provjera da li se kod pokreće u browseru
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('unreadMessageCount', count.toString());
        }
      })
    );
  }

  refreshUnreadMessageCount(): void {
    this.getUnreadMessageCount().subscribe();
  }

  loadUnreadCountFromStorage(): void {
    // Provjera da li je kod u browseru prije nego što pristupite localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedCount = localStorage.getItem('unreadMessageCount');
      if (storedCount !== null) {
        this.unreadMessageCountSubject.next(Number(storedCount));
      }
    }
  }
}
