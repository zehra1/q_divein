import { Question } from 'src/app/models/question.model';
import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
enum VoteAction {
  UPVOTE = 'UPWOTE',
  DOWNVOTE = 'DOWNVOTE',
}

@Component({
  selector: 'app-vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.scss'],
})
export class VoteComponent implements OnInit {
  @Input() question: Question;
  @Output() updatedQuestion: EventEmitter<Question> = new EventEmitter();
  eVoteAction = VoteAction;
  constructor(private authServie: AuthService) {}

  ngOnInit(): void {}

  vote(action: VoteAction) {
    const { activeUser } = this.authServie;
    const userId = activeUser?.id || 0;
    const userAlreadyUpvoted =
      this.question.votesBy?.some((q) => q === userId) || false;

    if (action == VoteAction.DOWNVOTE && !userAlreadyUpvoted) {
      this.question.votesBy = this.question.votesBy?.filter(
        (v) => v !== userId
      );
      this.question.votes--;
    } else if (action == VoteAction.UPVOTE && !userAlreadyUpvoted) {
      this.question.votes++;
    }

    if (this.question.votesBy) {
      this.question.votesBy.push(userId);
    } else {
      this.question.votesBy = [userId];
    }

    this.updatedQuestion.emit(this.question);
  }
}
