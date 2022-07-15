import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { QuestionService } from 'src/app/services/questions.service';
import { tap } from 'rxjs/operators';
import { Question } from 'src/app/models/question.model';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { QuestionAddComponent } from './question-add/question-add.component';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  questions: Question[] = [];
  topFiveQuestions: Question[] = [];
  noData: boolean;
  page = 1;
  ownOnly = false;
  isLoggedIn: boolean;
  subscriptions: Subscription[] = [];
  constructor(
    private questionService: QuestionService,
    private router: Router,
    public dialog: MatDialog,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getQuestions();
    this.subscriptions.push(
      this.questionService
        .getTopQuestions({ sort: 'votes', order: 'desc', limit: 5 })
        .pipe(
          tap((questions) => {
            console.log(" qqq ", questions);
            
            this.topFiveQuestions = questions;
          })
        )
        .subscribe(),

      this.questionService.questions.showNoData$
        .pipe(
          tap((noData) => {
            this.noData = noData;
          })
        )
        .subscribe(),

      this.questionService.questions.data$
        .pipe(
          tap((questions) => {
            this.questions.push(...questions);
          })
        )
        .subscribe(),

      this.authService.isLoggedIn$
        .pipe(
          tap((isLogged) => {
            this.isLoggedIn = isLogged;
          })
        )
        .subscribe()
    );
  }

  onScroll() {
    this.getQuestions();
  }

  getQuestions() {
    this.questionService.getQuestions({
      page: this.page++,
      order: 'desc',
      sort: 'id',
      limit: 10,
      userId: this.ownOnly ? this.authService.activeUser.id : 0,
    });
  }

  handleQuestionClick(question: Question) {
    this.router.navigate(['/homepage', question.id]);
  }

  toggleOwnQuestions() {
    this.ownOnly = !this.ownOnly;
    this.questions = [];
    this.page = 0;
    this.getQuestions();
  }

  addQuestion(): void {
    const dialogRef = this.dialog.open(QuestionAddComponent, {
      panelClass: 'add-question',
    });

    dialogRef.afterClosed().subscribe((newQuestion: Question) => {
      if (newQuestion) {
        newQuestion.createdAt = new Date();
        newQuestion.numberOfNewComments = 0;
        newQuestion.votes = 0;
        newQuestion.userId = this.authService.activeUser.id;
        this.subscriptions.push(
          this.questionService
            .addQuestion(newQuestion)
            .pipe(
              tap((question) => {
                this.page = 0;
                this.questions = [];
                this.getQuestions();
              })
            )
            .subscribe()
        );
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => {
      s.unsubscribe();
    });
  }
}
