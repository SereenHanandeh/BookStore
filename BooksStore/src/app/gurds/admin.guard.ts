import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // التحقق إذا كان هناك مستخدم مسجل
  const user = auth.getUser();

  if (user && user.role === 'admin') {
    return true;
  }


  router.navigate(['/']);
  return false;
};
