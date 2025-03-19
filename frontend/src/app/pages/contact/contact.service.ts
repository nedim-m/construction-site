import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AppConfig } from '../../app.config.prod';
import { ContactMessage, ContactMessageResponse } from './contact-message.model';
import { HttpHeadersHelper } from '../../utilis/httpheadershelper';



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
    
    const headers = HttpHeadersHelper.getAuthHeaders();

    
    return this.http.get<ContactMessageResponse[]>(this.baseUrl, { headers });
  }

  getMessageById(id: number): Observable<ContactMessageResponse> {
    const headers = HttpHeadersHelper.getAuthHeaders();
    return this.http.get<ContactMessageResponse>(`${this.baseUrl}/${id}`,{ headers });
  }

  deleteMessage(id: number): Observable<void> {
    const headers = HttpHeadersHelper.getAuthHeaders();
    return this.http.delete<void>(`${this.baseUrl}/${id}`,{ headers });
  }

  updateMessageStatus(id: number, isRead: boolean): Observable<void> {
    const headers = HttpHeadersHelper.getAuthHeaders();
    return this.http.put<void>(`${this.baseUrl}/${id}/status`, isRead,{ headers });
  }

  getUnreadMessageCount(): Observable<number> {
    const headers = HttpHeadersHelper.getAuthHeaders();
    return this.http.get<number>(`${this.baseUrl}/unread-message-count`, { headers }).pipe(
      tap(count => {
        const safeCount = count ?? 0; 
        this.unreadMessageCountSubject.next(safeCount);
        
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('unreadMessageCount', safeCount.toString());
        }
      })
    );
}

  refreshUnreadMessageCount(): void {
    this.getUnreadMessageCount().subscribe();
  }

  loadUnreadCountFromStorage(): void {
    
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedCount = localStorage.getItem('unreadMessageCount');
      if (storedCount !== null) {
        this.unreadMessageCountSubject.next(Number(storedCount));
      }
    }
  }
}
