import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { AuthenticationService } from 'src/app/authentication.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  public logInFormGroup : FormGroup;
  public email : string;
  public password : string;

  constructor(
        public formBuilder : FormBuilder,
        private authService : AuthenticationService,
    ) { }

  ngOnInit(): void {
    this.logInFormGroup = this.formBuilder.group({
      email : [this.email,[Validators.required,Validators.email]],
      password : [this.password,Validators.required]
    });
  }

  login(Data){
    this.authService.login(Data);
  }


}
