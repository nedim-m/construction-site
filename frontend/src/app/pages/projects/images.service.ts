import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from '../../app.config.prod';
import { Observable } from 'rxjs';
import { ImageResponse } from './projects.model';
import { HttpHeadersHelper } from '../../utilis/httpheadershelper';


@Injectable({
  providedIn: 'root'
})
export class ImagesService {

  constructor(private http: HttpClient) { }

  baseUrl = `${AppConfig.apiUrl}/image`;

  addImages(projectId: number, images: string[]): Observable<any> {
    const headers = HttpHeadersHelper.getAuthHeaders();  
    return this.http.post(`${this.baseUrl}/${projectId}`, images, { headers });
  }

  deleteImages(projectId: number, imageIds: number[]): Observable<any> {
    const headers = HttpHeadersHelper.getAuthHeaders();  
    console.log(`Ispis iz servisa ID: ${imageIds}`);
    return this.http.delete<any>(`${this.baseUrl}/${projectId}`, { body: imageIds, headers });
  }

  getImagesByProjectId(projectId: number): Observable<any[]> {
    const headers = HttpHeadersHelper.getAuthHeaders();  
    return this.http.get<ImageResponse[]>(`${this.baseUrl}/${projectId}`, { headers });
  }

  setAsCover(projectId: number, imageId: number): Observable<boolean> {
    const headers = HttpHeadersHelper.getAuthHeaders();  
    return this.http.post<boolean>(`${this.baseUrl}/${projectId}/SetCover/${imageId}`, {}, { headers });
  }

}
