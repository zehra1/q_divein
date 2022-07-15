import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { BehaviorSubject, throwError } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ErrorService{
    constructor(private snackbar: MatSnackBar){}
    handleError(error: any){
        this.snackbar.open(error.error || error.message, '', {duration: 5000})
    }
}