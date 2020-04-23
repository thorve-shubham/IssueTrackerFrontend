import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { signUpModel } from './models/signUpModel';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as jwt from 'jwt-decode'; 

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
  
  setCurrentUser(userName : string){
    this.currentUser.next(userName);
  }

  login(data){
    return this._http.post("http://localhost:3000/user/login",data);
    //return this._http.post("http://api.shubhamthorvetest.in/user/login",data);
  }

  signUpUser(userData:signUpModel){
    return this._http.post("http://localhost:3000/user/create",userData);
    //return this._http.post("http://api.shubhamthorvetest.in/user/create",userData);
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
    return this._http.get("http://localhost:3000/user/get"+"?authToken="+localStorage.getItem('authToken'));
    //return this._http.get("http://api.shubhamthorvetest.in/user/get"+"?authToken="+localStorage.getItem('authToken'));
  }
}
