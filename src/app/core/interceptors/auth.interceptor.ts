import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthService);
  const token = authService.getAccessToken();

  console.log("INTERCEPTOR RUN");
  console.log("TOKEN:", token);

  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log("HEADER ADDED");

    return next(cloned);
  }

  console.log("NO TOKEN FOUND");
  return next(req);
};