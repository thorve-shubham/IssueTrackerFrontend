import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import * as jwt from 'jwt-decode'; 
import { signUpModel } from './models/signUpModel';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private loginStatus = new BehaviorSubject<boolean>(false);
  private currentUser = new BehaviorSubject<string>(localStorage.getItem('userName'));

  constructor(public _http:HttpClient, public router:Router) {
    
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
    this._http.post("http://localhost:3000/user/login",data).subscribe(
      data=>{
        if(data["error"]){
          console.log("error");
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
        console.log('err');
      }
    );
  }

  signUpUser(userData:signUpModel){
    this._http.post("http://localhost:3000/user/create",userData).subscribe(
      data=>{
        if(data["error"]==null){
          this.router.navigate(["auth/logIn"]);
        }else{
          //something went wrong
        }
      },
      error=>{
        //something went wrong
      }
    );
  }

  isAuthenticated(){
    const token = localStorage.getItem('authToken');
    //console.log('checking auth');
    if(!token){
      //this.toastr.errorToastr("Access Denied","Oops!");
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
    return this._http.get("http://localhost:3000/user/get");
  }
}
