import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../../utilis/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserstatusService } from '../../utilis/userstatus.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  username: string = '';  
  password: string = '';  
  errorMessage: string = '';  

  constructor(
    private authService: AuthService,
    private router: Router,
    private userStatusService: UserstatusService  
  ) {}

  onSubmit() {

    console.log(this.username);
    console.log(this.password);
    this.authService.login(this.username, this.password).subscribe(
      (response) => {
        console.log('response:', response);
      
        this.authService.saveToken(response.accessToken);
        this.userStatusService.updateLoginStatus(); 
        this.router.navigate(['/']);  
      },
      (error) => {
      
        console.log('NeUspjesan');
        this.errorMessage = 'Pogrešan email ili lozinka!';
      }
    );
  }
}
