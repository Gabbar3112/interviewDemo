import {Injectable} from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {catchError} from 'rxjs/operators';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private router: Router) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    const token = localStorage.getItem('token');
    if (token) {
      request = request.clone({
        setHeaders: {
          'authToken': `${token}`
        }
      });
    } else {
      this.router.navigate(['/login']);
    }
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          // Handle 401 error
          console.log('==================err', err);
          // return throwError(err);
          localStorage.clear();
          this.router.navigate(['/login']);
        } else {
          return throwError(err);
        }
      })
    );
  }
}
