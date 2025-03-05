import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from '../../app.config.prod';
import { PagedResponse, Project, ProjectResponse } from './projects.model';
import { Observable } from 'rxjs';
import { HttpHeadersHelper } from '../../utilis/httpheadershelper';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  constructor(private http:HttpClient) { }
  baseUrl=`${AppConfig.apiUrl}/project`;
  

  addProject(project: Project): Observable<Project> {
    const headers = HttpHeadersHelper.getAuthHeaders(); 
    return this.http.post<Project>(this.baseUrl, project, { headers });
  }

  getAllProjects(location?: string, page?: number, pageSize?: number,sortBy?: string): Observable<PagedResponse<ProjectResponse>> {
    let params = new HttpParams();
    const headers = HttpHeadersHelper.getAuthHeaders();
  
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
    return this.http.get<PagedResponse<ProjectResponse>>(this.baseUrl, { params,headers });
  }
  
  

  getProjectById(id: number): Observable<ProjectResponse> {
    const headers = HttpHeadersHelper.getAuthHeaders(); 
    return this.http.get<ProjectResponse>(`${this.baseUrl}/${id}`, { headers });
  }

  deleteProject(id: number) {
    const headers = HttpHeadersHelper.getAuthHeaders(); 
    return this.http.delete<any>(`${this.baseUrl}/${id}`, { headers });
}
updateProject(id: number, project: Project): Observable<Project> {
  const headers = HttpHeadersHelper.getAuthHeaders(); 
    return this.http.put<Project>(`${this.baseUrl}/${id}`, project, { headers });
}

getProjectNumber(): Observable<number> {
  const headers = HttpHeadersHelper.getAuthHeaders();
    return this.http.get<number>(`${this.baseUrl}/projectNumber`, { headers });
}


}
