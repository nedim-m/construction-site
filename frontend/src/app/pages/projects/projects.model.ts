import { SafeHtml } from "@angular/platform-browser";

export interface Project {
    startDate: Date;
    endDate: Date;
    location: string;
    description: string;
    images: string[];  
    name:string;
    newClient:boolean;
  }

  export interface ProjectResponse {
    id:number;
    startDate: Date;
    endDate: Date;
    location: string;
    description: string;
    images: string[];  
    name:string;
    newClient:boolean;
    safeDescription?:SafeHtml;
  }
  export interface ImageResponse {
    id: number;
    mimeType: string;
    imgUrl: string; 
    cover:boolean;
}
export interface PagedResponse<T> {
  result: T[];
  count: number;
}
export interface ProjectAndCustomerNumber {

  numberOfProjects:number;
  numberOfClients:number;

}