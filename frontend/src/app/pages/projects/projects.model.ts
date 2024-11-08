export interface Project {
    startDate: Date;
    endDate: Date;
    location: string;
    description: string;
    images: string[];  
    name:string;
  }

  export interface ProjectResponse {
    id:number;
    startDate: Date;
    endDate: Date;
    location: string;
    description: string;
    images: string[];  
    name:string;
  }
  export interface ImageResponse {
    id: number;
    mimeType: string;
    img: string; 
    cover:boolean;
}