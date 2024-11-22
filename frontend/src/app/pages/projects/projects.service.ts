import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from '../../app.config.prod';
import { PagedResponse, Project, ProjectResponse } from './projects.model';
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

  getAllProjects(location?: string, page?: number, pageSize?: number,sortBy?: string): Observable<PagedResponse<ProjectResponse>> {
    let params = new HttpParams();
  
    if (location) {
      params = params.append('location', location);
    }
  
    if (page !== undefined && pageSize !== undefined) {
      params = params.append('page', page.toString());
      params = params.append('pageSize', pageSize.toString());
    }
    if(sortBy){
      params=params.append('sortBy',sortBy);
    }  
    return this.http.get<PagedResponse<ProjectResponse>>(this.baseUrl, { params });
  }
  
  

  getProjectById(id: number): Observable<ProjectResponse> {
    return this.http.get<ProjectResponse>(`${this.baseUrl}/${id}`);
  }

  deleteProject(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
}
updateProject(id: number, project: Project): Observable<Project> {
  return this.http.put<Project>(`${this.baseUrl}/${id}`, project);
}

getProjectNumber(): Observable<number> {
  return this.http.get<number>(`${this.baseUrl}/projectNumber`);
}


}
