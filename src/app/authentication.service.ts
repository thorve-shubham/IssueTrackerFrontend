import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import * as jwt from 'jwt-decode'; 

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

  login(data){
    this._http.post("http://localhost:3000/user/login",data).subscribe(
      data=>{
        if(data["error"]){
          console.log("error");
        }else{
          this.loginStatus.next(true);
          console.log(data['data']);
          localStorage.setItem('authToken',data['data']);
          const decoded = jwt(data['data']);
          localStorage.setItem('userName',decoded.Data.name);
          this.currentUser.next(decoded.Data.name);
          setTimeout(()=>{
            this.router.navigate(["user/home"]);
          },1000); 
        }
      },
      err=>{
        console.log('err');
      }
    );
  }

  isAuthenticated(){
    const token = localStorage.getItem('authToken');
    console.log('checking auth');
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
}
