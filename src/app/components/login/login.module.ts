import { CommonModule } from "@angular/common";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MaterialModule } from "src/app/ui/material.module";
import { LoginRoutingModule } from "./login-routing-module";
import { LoginComponent } from "./login.component";

@NgModule({
    declarations:[
        LoginComponent
    ],
    imports:[
        LoginRoutingModule,
        FormsModule,
        MaterialModule,
        HttpClientModule,
        ReactiveFormsModule,
        MatDialogModule,
        CommonModule
    ],
    providers:[HttpClient, {
        provide: MatDialogRef,
        useValue: {}
      },]
})
export class LoginModule {}