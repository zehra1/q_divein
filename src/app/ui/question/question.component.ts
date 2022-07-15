import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionService } from 'src/app/services/questions.service';
import { tap, take } from 'rxjs/operators';
import { Question } from 'src/app/models/question.model';
import { FormControl, FormGroup } from '@angular/forms';
import { Comment } from 'src/app/models/comment.model';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user.model';

enum VoteAction {
  UPVOTE = 'UPWOTE',
  DOWNVOTE = 'DOWNVOTE',
}

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
})
export class QuestionComponent implements OnInit {
  @Input('question') set _question(question: Question) {
    this.question = question;

    if (this.question) {
      this.authService.getUsers();
      this.authService.users.data$
        .pipe(
          tap((users) => {
            this.postedBy = users.find((u) => u.id == this.question?.userId);
          })
        )
        .subscribe();
    }
  }
  @Input() showVoteBar = true;
  @Input() showDate = true;
  @Input() summary: boolean;
  eVoteAction = VoteAction;
  question: Question;
  postedBy: User = null;
  isLoggedIn: boolean;

  constructor(
    private questionService: QuestionService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {}

  handleQuestionVotes(question) {
    this.questionService.upvote(question);
  }

  handleQuestionClick() {
    this.router.navigate(['/homepage', this.question.id]);
  }
}
