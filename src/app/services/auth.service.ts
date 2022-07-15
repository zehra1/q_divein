import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from '../models/user.model';
import { ErrorService } from '../ui/error.service';
import { EndpointURIs } from './service.model';
const routes = {
  user: (id: number) => `${EndpointURIs.USER}/${id}`,
  login: () => `${EndpointURIs.LOGIN}`,
  register: () => `${EndpointURIs.REGISTER}`,
};
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _activeUser = new BehaviorSubject<User>(null);
  readonly activeUser$ = this._activeUser.asObservable();
  _isLoggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this._isLoggedIn.asObservable();

  get token() {
    return localStorage.getItem('token') || '';
  }

  get activeUser() {
    return this._activeUser.getValue();
  }

  set activeUser(value: User) {
    this._activeUser.next(value);
  }

  httpOptions = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json',
    }),
  };
  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private errorService: ErrorService
  ) {}

  login(credentials: User) {
    this.httpClient
      .post(routes.login(), credentials, this.httpOptions)
      .pipe(
        tap((response: any) => {
          this.activeUser = response.user;
          localStorage.setItem('token', response.accessToken);
          localStorage.setItem('loggedUser', JSON.stringify(response.user));
          this._isLoggedIn.next(true);
        }),
        catchError((err) => {
          this.errorService.handleError(err);
          return of(err);
        })
      )
      .subscribe();
  }

  register(userDetails: User) {
    this.httpClient
      .post(routes.register(), userDetails, this.httpOptions)
      .pipe(
        catchError((err) => {
          this.errorService.handleError(err);
          return of(err);
        })
      )
      .subscribe();
  }

  getUser(id: number){
    return this.httpClient
      .get(routes.user(id), {
        headers: this.httpOptions.headers,
      })
      .pipe(
        catchError((err) => {
          this.errorService.handleError(err);
          return of(err);
        })
      )
  }

  logout() {
    this.activeUser = null
    this._isLoggedIn.next(false)
    localStorage.setItem('token', '')
    localStorage.setItem('userId', '')
  }
}
