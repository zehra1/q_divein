import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Question } from 'src/app/models/question.model';

@Component({
  selector: 'app-question-add',
  templateUrl: './question-add.component.html',
  styleUrls: ['./question-add.component.scss']
})
export class QuestionAddComponent implements OnInit {
  questionAddForm = new FormGroup({
    title: new FormControl(null, [Validators.required]),
    body: new FormControl(null, [Validators.required]),
  });

  get title(){
    return this.questionAddForm.get('title')
  }

  get body(){
    return this.questionAddForm.get('body')
  }
  constructor(public dialogRef: MatDialogRef<QuestionAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Question) { }

  ngOnInit(): void {

  }

  dismiss(){
    this.dialogRef.close()
  }
}
