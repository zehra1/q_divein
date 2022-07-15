import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class GuiService{
    private readonly _isDarkMode = new BehaviorSubject<boolean>(false)
    readonly isDarkMode$ = this._isDarkMode.asObservable()

    get isDarkMode(){
        return this._isDarkMode.getValue()
    }

    set isDarkMode(value: boolean){
        this._isDarkMode.next(value)
    }
}