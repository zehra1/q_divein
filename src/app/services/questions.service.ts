import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Comment } from '../models/comment.model';
import { DefaultParameters } from '../models/pagination.model';
import { Question } from '../models/question.model';
import { StoreEntity } from '../models/store-entity.model';
import { ErrorService } from '../ui/error.service';
import { AuthService } from './auth.service';
import { EndpointURIs } from './service.model';
const routes = {
  questions: () => `${EndpointURIs.QUESTIONS}`,
  upvote: () => `${EndpointURIs.QUESTIONS}`,
  question: (id: number) => `${EndpointURIs.QUESTIONS}/${id}`,
  comment: () => `${EndpointURIs.COMMENT}`,
  comments: (id: number) => `${EndpointURIs.COMMENT}?questionId=${id}`,
};
@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  httpOptions = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json',
    }),
  };
  questions = new StoreEntity<Question[]>(null, true, true);
  selectedQuestion = new StoreEntity<Question>(null, true, true);
  totalQuestions = 0;
  constructor(
    private httpClient: HttpClient,
    private errorService: ErrorService
  ) {}

  public getQuestions(params: DefaultParameters = { page: 1, limit: 20, order: 'desc', sort: 'id' }) {
    let httpParams = new HttpParams();
    if (params?.page) {
      httpParams = httpParams.set('_page', params?.page.toString());
    }
    if (params?.limit) {
      httpParams = httpParams.set('_limit', params?.limit.toString());
    }
    if (params?.order) {
      httpParams = httpParams.set('_order', params?.order.toString());
    }
    if (params?.sort) {
      httpParams = httpParams.set('_sort', params?.sort.toString());
    }
    if (params?.userId > 0) {
      httpParams = httpParams.set('userId', params?.userId.toString());
    }
    this.questions.loading = true;
    return this.httpClient
      .get(routes.questions(), {
        params: httpParams,
        observe: 'response',
        headers: this.httpOptions.headers,
      })
      .pipe(
        map((response: any) => {
          this.totalQuestions = response.headers.get('X-Total-Count');
          this.questions.data = response.body;
          this.questions.loading = false;
        }),
        catchError((err) => {
          this.questions.loading = false;
          this.errorService.handleError(err);
          return of(err);
        })
      )
      .subscribe();
  }

  public getTopQuestions(params: DefaultParameters = { page: 1, limit: 5 }) {
    let httpParams = new HttpParams();
    if (params?.page) {
      httpParams = httpParams.set('_page', params?.page.toString());
    }
    if (params?.limit) {
      httpParams = httpParams.set('_limit', params?.limit.toString());
    }
    if (params?.order) {
      httpParams = httpParams.set('_order', params?.order.toString());
    }
    if (params?.sort) {
      httpParams = httpParams.set('_sort', params?.sort.toString());
    }
    return this.httpClient
      .get(routes.questions(), {
        params: httpParams,
        observe: 'response',
        headers: this.httpOptions.headers,
      })
      .pipe(
        map((res) => res.body),
        catchError((err) => {
          this.questions.loading = false;
          this.errorService.handleError(err);
          return of(err);
        })
      );
  }

  public getQuestionDetails(id: number) {
    this.selectedQuestion.loading = true;
    this.httpClient
      .get(routes.question(id), {
        observe: 'response',
        headers: this.httpOptions.headers,
      })
      .pipe(
        tap((res: any) => {
          this.selectedQuestion.loading = false;
          this.selectedQuestion.data = res.body;
        }),
        catchError((err) => {
          this.selectedQuestion.loading = false;
          this.errorService.handleError(err);
          return of(err);
        })
      )
      .subscribe();
  }

  public upvote(question: Question) {
    this.httpClient
      .put(routes.question(question.id), question, {
        headers: this.httpOptions.headers,
      })
      .pipe(
        catchError((err) => {
          this.errorService.handleError(err);
          return of(err);
        })
      )
      .subscribe();
  }

  public addComment(comment: Comment) {
    return this.httpClient
      .post(routes.comment(), comment, {
        headers: this.httpOptions.headers,
      })
      .pipe(
        tap((_) => {
          this.updateQuestionNotification(this.selectedQuestion.data.id);
        }),
        catchError((err) => {
          this.errorService.handleError(err);
          return of(err);
        })
      );
  }

  updateQuestionNotification(id: number, clear = false) {
    this.httpClient
      .patch(
        routes.question(id),
        {
          numberOfNewComments: clear ? 0 : ++this.selectedQuestion.data.numberOfNewComments,
        },
        this.httpOptions
      )
      .pipe(
        catchError((err) => {
          this.errorService.handleError(err);
          return of(err);
        })
      )
      .subscribe();
  }

  public addQuestion(question: Question) {
    return this.httpClient
      .post(routes.questions(), question, {
        headers: this.httpOptions.headers,
      })
      .pipe(
        catchError((err) => {
          this.errorService.handleError(err);
          return of(err);
        })
      );
  }

  public getComments(id: number) {
    return this.httpClient
      .get(routes.comments(id), {
        headers: this.httpOptions.headers,
      })
      .pipe(
        catchError((err) => {
          this.errorService.handleError(err);
          return of(err);
        })
      );
  }
}
