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



addImages(projectId: number, images: File[]): Observable<boolean> {
  const formData = new FormData();
  formData.append('projectId', projectId.toString());

  images.forEach((image, index) => {
    formData.append(`images[${index}]`, image);
  });

  return this.http.post<boolean>(this.baseUrl, formData);
}


deleteImages(projectId: number, imageIds: number[]): Observable<any> {
  console.log(`Ispis iz servisa ID: ${imageIds}`);
  return this.http.delete<any>(`${this.baseUrl}/${projectId}`, { body: imageIds });
}

getImagesByProjectId(projectId: number): Observable<any[]> {
  return this.http.get<ImageResponse[]>(`${this.baseUrl}/${projectId}`);
}
}
