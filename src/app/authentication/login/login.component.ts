import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as jwt from 'jwt-decode';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public logInFormGroup: FormGroup;
  public email: string;
  public password: string;
  public loading: boolean;

  constructor(
    public formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private _snackBar: MatSnackBar,
    private _router: Router
  ) {
    this.loading = false;
  }

  ngOnInit(): void {
    this.logInFormGroup = this.formBuilder.group({
      email: [this.email, [Validators.required, Validators.email]],
      password: [this.password, Validators.required],
    });
  }

  login(Data) {
    this.loading = true;
    this.authService.login(Data).subscribe((data) => {
      this.loading = false;
      if (data['error']) {
        this._snackBar.open(data['message'], 'Dismiss', { duration: 3000 });
      } else {
        localStorage.setItem('authToken', data['data']);
        const decoded = jwt(data['data']);
        localStorage.setItem('userName', decoded.Data.name);
        this.authService.setLoginStatus(true);
        this.authService.setCurrentUser(decoded.Data.name);
        this._router.navigate(['user/dashboard']);
      }
    });
  }

  goToSignUp() {
    this._router.navigate(['auth/signUp']);
  }
}
