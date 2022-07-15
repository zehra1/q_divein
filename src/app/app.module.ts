import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginModule } from './components/login/login.module';
import { HeaderComponent } from './ui/header/header.component';
import { MaterialModule } from './ui/material.module';
import { AuthInterceptor } from './services/auth.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { TruncatePipe } from './ui/truncate.pipe';
import { QuestionComponent } from './ui/question/question.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VoteComponent } from './ui/vote/vote.component';
import { QuestionDetailsComponent } from './components/home/question-details/question-details.component';
import { QuestionAddComponent } from './components/home/question-add/question-add.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TruncatePipe,
    HeaderComponent,
    QuestionComponent,
    VoteComponent,
    QuestionDetailsComponent,
    QuestionAddComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MaterialModule,
    LoginModule,
    BrowserAnimationsModule,
    InfiniteScrollModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
