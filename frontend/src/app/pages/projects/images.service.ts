import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from '../../app.config.prod';
import { Observable } from 'rxjs';
import { ImageResponse } from './projects.model';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {

  constructor(private http:HttpClient) { }

  baseUrl=`${AppConfig.apiUrl}/image`;



  addImages(projectId: number, images: string[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/${projectId}`, images);
  }
  


deleteImages(projectId: number, imageIds: number[]): Observable<any> {
  console.log(`Ispis iz servisa ID: ${imageIds}`);
  return this.http.delete<any>(`${this.baseUrl}/${projectId}`, { body: imageIds });
}

getImagesByProjectId(projectId: number): Observable<any[]> {
  return this.http.get<ImageResponse[]>(`${this.baseUrl}/${projectId}`);
}
}
