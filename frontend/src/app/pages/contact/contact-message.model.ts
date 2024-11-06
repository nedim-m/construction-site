export interface ContactMessage {
  name: string;
  email: string;
  message: string;
}


export interface ContactMessageResponse {
  id:number;
  name: string;
  email: string;
  message: string;
  read:boolean;
  dateTime:Date
}

