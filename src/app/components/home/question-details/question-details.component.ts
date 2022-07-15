import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Comment } from 'src/app/models/comment.model';
import { Question } from 'src/app/models/question.model';
import { AuthService } from 'src/app/services/auth.service';
import { QuestionService } from 'src/app/services/questions.service';

@Component({
  selector: 'app-question-details',
  templateUrl: './question-details.component.html',
  styleUrls: ['./question-details.component.scss'],
})
export class QuestionDetailsComponent implements OnInit, OnDestroy {
  question: Question;
  comments: Comment[] = [];

  commentForm = new FormGroup({
    comment: new FormControl(),
  });
  isLoggedIn: boolean;
  subscriptions: Subscription[] = [];
  commentsLoading = true;
  constructor(
    private questionService: QuestionService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = !!this.authService.token;
    this.subscriptions.push(
      this.route.params.subscribe((params) => {
        if (params && params.id) {
          this.questionService.getQuestionDetails(params.id);
        }
      }),
      this.questionService.selectedQuestion.data$
        .pipe(
          tap((question) => {
            this.question = question;
            this.getComments();
          })
        )
        .subscribe()
    );
  }

  handleLogin() {
    this.router.navigate(['/login']);
  }

  onSubmit() {
    const comment = {
      comment: this.commentForm.get('comment').value,
      userId: this.authService.activeUser.id,
      commentedAt: new Date(),
      questionId: this.question.id,
    } as Comment;

    this.subscriptions.push(
      this.questionService
        .addComment(comment)
        .pipe(
          tap((_) => {
            this.commentForm.reset();
            this.getComments();
          })
        )
        .subscribe()
    );
  }

  getComments() {
    this.authService.getUsers();
    this.subscriptions.push(
      this.authService.users.data$
        .pipe(
          tap((users) => {
            this.questionService
              .getComments(this.question.id)
              .pipe(
                map((comments: Comment[]) => {
                  comments.forEach((comment) => {
                    comment.username = users.find(
                      (u) => u.id == comment.userId
                    )?.username;
                  });
                  this.comments = comments;
                  this.commentsLoading = false;
                })
              )
              .subscribe();
          })
        )
        .subscribe()
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => {
      s.unsubscribe();
    });
  }
}
