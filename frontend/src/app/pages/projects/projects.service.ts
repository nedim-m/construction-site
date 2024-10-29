import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from '../../app.config.prod';
import { Project, ProjectResponse } from './projects.model';
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

  getAllProjects(location?: string): Observable<ProjectResponse[]> {
    let params = new HttpParams();
    if (location) {
      params = params.append('location', location);
    }
    return this.http.get<ProjectResponse[]>(this.baseUrl, { params });
  }

  getProjectById(id: number): Observable<ProjectResponse> {
    return this.http.get<ProjectResponse>(`${this.baseUrl}/${id}`);
  }

  deleteProject(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
}


}
