import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from '../../app.config.prod';
import { Project } from './projects.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  constructor(private http:HttpClient) { }
  baseUrl=`${AppConfig.apiUrl}/project`;

  addProject(project: Project): Observable<Project> {
    return this.http.post<Project>(this.baseUrl, project);
  }


}
