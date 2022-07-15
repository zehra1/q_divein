import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
  } from '@angular/common/http';
  import { Injectable } from '@angular/core';
  import { MatDialog } from '@angular/material/dialog';
  import { Router } from '@angular/router';
  import { Observable, throwError } from 'rxjs';
  import { catchError } from 'rxjs/operators';
  import { LoginComponent } from '../components/login/login.component';
  import { AuthService } from './auth.service';
  
  @Injectable()
  export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService, private router: Router, public dialog: MatDialog) {}
  
    intercept(
      req: HttpRequest<any>,
      next: HttpHandler
    ): Observable<HttpEvent<any>> {
      req = req.clone({
        headers: req.headers.set(
          'authorization',
          'Bearer ' + this.authService.token
        ),
      });
      return next.handle(req).pipe(catchError((err)=>{
        if(err.status === 401){
          this.openBottomSheet()
        }
        return throwError(err);
      }));
    }
  
    openBottomSheet(): void {
      this.dialog.open(LoginComponent)
    }
  
  }
  