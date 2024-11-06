import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../utilis/auth.service';

export const authGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);


  if (authService.isLoggedIn()) {
    return true; 
  } else {

    router.navigate(['/admin-login']);
    return false;
  }
};
