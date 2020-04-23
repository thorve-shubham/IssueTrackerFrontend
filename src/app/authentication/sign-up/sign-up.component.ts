import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { AuthenticationService } from 'src/app/authentication.service';
import { generate } from 'shortid';
import { signUpModel } from 'src/app/models/signUpModel';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent implements OnInit {
  public signUpFormGroup: FormGroup;
  public signUpData: signUpModel;
  public cPassword: string;
  public creating: boolean;

  constructor(
    public _router: Router,
    public formBuilder: FormBuilder,
    public authService: AuthenticationService,
    private _snackBar: MatSnackBar
  ) {
    this.creating = false;
    this.signUpData = new signUpModel();
  }

  ngOnInit(): void {
    this.signUpFormGroup = this.formBuilder.group(
      {
        name: [this.signUpData.name, Validators.required],
        email: [this.signUpData.email, [Validators.required, Validators.email]],
        password: [
          this.signUpData.password,
          [Validators.required, this.validatePassword],
        ],
        confirmPassword: [this.cPassword, [Validators.required]],
      },
      {
        validators: this.matchPassword,
      }
    );
  }

  matchPassword(control: AbstractControl) {
    let password = control.get('password').value;
    let cPassword = control.get('confirmPassword').value;
    if (password != cPassword) {
      control.get('confirmPassword').setErrors({ confirmPassword: true });
    } else {
      return null;
    }
  }

  validatePassword(control: AbstractControl) {
    if (!control.value) {
      return null;
    } else {
      const regex = new RegExp(
        '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])'
      );
      const valid = regex.test(control.value);
      return valid ? null : { invalidPassword: true };
    }
  }

  goToLogin() {
    this._router.navigate(['auth/logIn']);
  }

  createUser(Data) {
    this.creating = true;
    Data.userId = generate();
    this.authService.signUpUser(Data).subscribe(
      (data) => {
        this.creating = false;
        if (data['error']) {
          this._snackBar.open(data['message'], 'Dismiss', { duration: 3000 });
        } else {
          this._snackBar.open(data['message'], 'Dismiss', { duration: 3000 });
          this._router.navigate(['auth/logIn']);
        }
      },
      (err) => {
        this.creating = false;
        console.log('something went wrong');
      }
    );
  }
}
