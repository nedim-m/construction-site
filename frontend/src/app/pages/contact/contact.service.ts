import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../../app.config.prod';
import { ContactMessage } from './contact-message.model';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(private http: HttpClient) { }

  baseUrl=`${AppConfig.apiUrl}/contactmessage`;

  insertMessage(messageData: ContactMessage): Observable<any> {
    return this.http.post(this.baseUrl, messageData);;
}
}