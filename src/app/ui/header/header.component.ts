import { Component, OnDestroy, OnInit } from '@angular/core';
import { GuiService } from '../gui.service';
import { tap, take } from 'rxjs/operators';
import { Question } from 'src/app/models/question.model';
import { QuestionService } from 'src/app/services/questions.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { Subscription, timer } from 'rxjs';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  isDarkMode: boolean;
  unreadComments: Question[] = [];
  isLoggedIn: boolean;
  subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private guiService: GuiService,
    private questionService: QuestionService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.guiService.isDarkMode$
        .pipe(
          tap((isDarkMode) => {
            this.isDarkMode = isDarkMode;
          })
        )
        .subscribe(),
      this.authService.isLoggedIn$
        .pipe(
          tap((isLogged) => {
            this.isLoggedIn = isLogged;
          })
        )
        .subscribe(),

      this.questionService.questions.data$
        .pipe(
          tap((questions: Question[]) => {
            if (this.authService.activeUser) {
              this.unreadComments = questions.filter(
                (q) =>
                  q.userId === this.authService.activeUser.id &&
                  q.numberOfNewComments > 0
              );
            }
          })
        )
        .subscribe()
    );
  }

  toggleDarkMode() {
    this.guiService.isDarkMode = !this.guiService.isDarkMode;
  }

  handleNotifClick(question: Question) {
    this.questionService.selectedQuestion.data = question;
    this.router.navigate(['/homepage', question.id]);
    this.questionService.getQuestions();
    this.questionService.updateQuestionNotification(question.id, true);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => {
      s.unsubscribe();
    });
  }
}
