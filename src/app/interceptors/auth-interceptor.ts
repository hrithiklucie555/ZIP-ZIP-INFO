import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  console.log('HTTP Request:', req.method, req.url);

  const token = localStorage.getItem('token');

  console.log('JWT Token:', token);

  if (token) {

    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log(
      'Authorization header added:',
      req.headers.get('Authorization')
    );

  }

  return next(req);

};