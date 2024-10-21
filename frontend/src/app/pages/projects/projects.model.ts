export interface Project {
    startDate: Date;
    endDate: Date;
    location: string;
    description: string;
    images: string[];  
  }

  export interface ProjectResponse {
    id:number;
    startDate: Date;
    endDate: Date;
    location: string;
    description: string;
    images: string[];  
  }