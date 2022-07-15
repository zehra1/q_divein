import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionService } from 'src/app/services/questions.service';
import { tap, take } from 'rxjs/operators';
import { Question } from 'src/app/models/question.model';
import { FormControl, FormGroup } from '@angular/forms';
import { Comment } from 'src/app/models/comment.model';
import { AuthService } from 'src/app/services/auth.service';

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
  @Input() question: Question;
  @Input() showVoteBar = true
  @Input() summary: boolean
  eVoteAction = VoteAction;

  isLoggedIn: boolean;

  constructor(
    private questionService: QuestionService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    
  }

  handleQuestionVotes(question){
    this.questionService.upvote(question);
  }

  handleQuestionClick(){
    this.router.navigate(['/homepage', this.question.id])
  }

}
