import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../../app.config.prod';
import { ContactMessage, ContactMessageResponse } from './contact-message.model';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  constructor(private http: HttpClient) {}

  baseUrl = `${AppConfig.apiUrl}/contactmessage`;

  insertMessage(messageData: ContactMessage): Observable<any> {
    return this.http.post(this.baseUrl, messageData);
  }

  getAllMessages(): Observable<ContactMessageResponse[]> {
    return this.http.get<ContactMessageResponse[]>(this.baseUrl);
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


}
