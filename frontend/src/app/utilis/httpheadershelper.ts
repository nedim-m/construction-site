import { HttpHeaders } from '@angular/common/http';

export class HttpHeadersHelper {

  static getAuthHeaders(): HttpHeaders {
   
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const token = sessionStorage.getItem('auth_token'); 
      let headers = new HttpHeaders();

      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      }

      return headers;
    } else {
     
      return new HttpHeaders();
    }
  }
}

