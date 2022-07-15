import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { User } from 'src/app/models/user.model';
import { EmailValidator } from 'src/app/ui/form.validators';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm = new FormGroup({
    email: new FormControl(null, [Validators.required, EmailValidator]),
    password: new FormControl(null, [Validators.required]),
  });

  registrationForm = new FormGroup({
    email: new FormControl(null, [Validators.required, EmailValidator]),
    password: new FormControl(null, [
      Validators.minLength(8),
      Validators.required,
    ]),
    username: new FormControl(null, Validators.required),
  });
  activeUser: User;
  registrationPage: boolean;
  subscriptions: Subscription[] = [];

  get loginEmail() {
    return this.loginForm.get('email');
  }

  get loginPassword() {
    return this.loginForm.get('password');
  }

  get registrationEmail() {
    return this.registrationForm.get('email');
  }

  get registrationPassword() {
    return this.registrationForm.get('password');
  }
  get registrationUsername() {
    return this.registrationForm.get('username');
  }
  constructor(
    private authService: AuthService,
    private router: Router,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<LoginComponent>
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.authService.isLoggedIn$
        .pipe(
          tap((isLoggedIn) => {
            if (isLoggedIn) {
              this.router.navigate(['/homepage']);
              try {
                this.dialogRef?.close();
              } catch (error) {}
            }
          })
        )
        .subscribe()
    );
  }

  login() {
    this.authService.login(this.loginForm.value);
  }

  handleRegistration() {
    this.registrationPage = true;
  }

  register() {
    this.authService.register(this.registrationForm.value);
    if (this.registrationForm.valid) {
      this.registrationPage = false;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => {
      s.unsubscribe();
    });
  }
}
