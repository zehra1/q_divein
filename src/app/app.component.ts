import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { GuiService } from './ui/gui.service';
import { tap } from 'rxjs/operators';
import { AuthService } from './services/auth.service';
import { Observable, Subscription } from 'rxjs';
import { User } from './models/user.model';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'frodav2';
  activeUser: User;
  isLoggedIn: boolean;
  subscriptions: Subscription[] = [];
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private guiService: GuiService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.authService.isLoggedIn$
        .pipe(
          tap((isLoggedIn) => {
            this.isLoggedIn = isLoggedIn;
          })
        )
        .subscribe()
    );

    if (localStorage.getItem('loggedUser')) {
      this.authService.activeUser = JSON.parse(
        localStorage.getItem('loggedUser')
      );
    }

    if (localStorage.getItem('token')) {
      this.authService._isLoggedIn.next(true);
    }

    this.subscriptions.push(
      this.guiService.isDarkMode$
        .pipe(
          tap((isDarkMode) => {
            this.renderer.removeClass(this.document.body, 'dark-mode');
            this.renderer.removeClass(this.document.body, 'light-mode');
            if (isDarkMode) {
              this.renderer.addClass(this.document.body, 'dark-mode');
            } else {
              this.renderer.addClass(this.document.body, 'light-mode');
            }
          })
        )
        .subscribe()
    );
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/homepage']);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => {
      s.unsubscribe();
    });
  }
}
