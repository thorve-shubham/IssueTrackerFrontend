import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import * as jwt from 'jwt-decode'; 
import { signUpModel } from './models/signUpModel';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private loginStatus = new BehaviorSubject<boolean>(false);
  private currentUser = new BehaviorSubject<string>(localStorage.getItem('userName'));

  constructor(public _http:HttpClient, public router:Router,private _snackBar : MatSnackBar) {
    
  }

  get isLoggedIn() {
    return this.loginStatus.asObservable(); 
  }

  get isCurrentUser(){
    return this.currentUser.asObservable();
  }

  setLoginStatus(status : boolean){
    this.loginStatus.next(status);
  } 

  login(data){
    this._http.post("api.shubhamthorvetest.in/user/login",data).subscribe(
      data=>{
        if(data["error"]){
          this._snackBar.open(data["message"],"Dismiss",{duration : 4000});
        }else{
          this.loginStatus.next(true);
          localStorage.setItem('authToken',data['data']);
          const decoded = jwt(data['data']);
          localStorage.setItem('userName',decoded.Data.name);
          this.currentUser.next(decoded.Data.name);
          setTimeout(()=>{
            this.router.navigate(["user/dashboard"]);
          },1000); 
        }
      },
      err=>{
        console.log(err);
      }
    );
  }

  signUpUser(userData:signUpModel){
    this._http.post("api.shubhamthorvetest.in/user/create",userData).subscribe(
      data=>{
        if(data["error"]==null){
          this.router.navigate(["auth/logIn"]);
        }else{
          this._snackBar.open(data["message"],"Dismiss",{duration : 4000});
        }
      },
      error=>{
        console.log("Something went Wrong");
      }
    );
  }

  isAuthenticated(){
    const token = localStorage.getItem('authToken');
    if(!token){
      return false;
    }else{
      try{
        const decoded = jwt(token);
        return true;
      }
      catch(err){
        return false;
      }
    }
  }

  logout(){
    this.loginStatus.next(false);
    this.currentUser.next(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
    this.router.navigate(["auth/logIn"]);
  }

  getUserInfo(){
    const token = localStorage.getItem("authToken");
    const data = jwt(token);
    return data.Data;
  }

  getAllUsers(){
    return this._http.get("api.shubhamthorvetest.in/user/get"+"?authToken="+localStorage.getItem('authToken'));
  }
}
