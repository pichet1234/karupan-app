import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const auth = inject(AuthService);
  const router = inject(Router);

  const token = auth.getAccessToken();

  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(authReq).pipe(
    catchError(err => {

      // 🔄 ถ้า access token หมดอายุ
      if (err.status === 401) {

        return auth.refreshToken().pipe(
          switchMap((res: any) => {

            auth.saveTokens(res.accessToken, auth.getRefreshToken()!);

            const newReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${res.accessToken}`
              }
            });

            return next(newReq);
          }),
          catchError(() => {

            // ❌ refresh ไม่สำเร็จ → logout
            auth.logout();
            router.navigate(['/auth/login']);
            return throwError(() => err);
          })
        );
      }

      return throwError(() => err);
    })
  );
};