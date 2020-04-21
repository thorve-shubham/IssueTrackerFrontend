import { Component, OnInit, ComponentFactoryResolver, OnDestroy } from '@angular/core';
import { AuthenticationService } from 'src/app/authentication.service';
import { Issue } from 'src/app/models/issueModel';
import { UserService } from 'src/app/user.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SocketService } from 'src/app/socket.service';
import { Observable, Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers : [SocketService]
})
export class DashboardComponent implements OnInit,OnDestroy {

  public issues : [any];
  public found : boolean;
  public user : string;
  public spinner : boolean;
  public searchFormGroup : FormGroup;
  public title : string;
  public socketobserver : Subscription;
  

  constructor(private _snackBar: MatSnackBar,private socket : SocketService,private _router : Router,private formBuilder : FormBuilder,private authService : AuthenticationService,private userService : UserService) { }
  
  ngOnInit(): void {
    this.user = this.authService.getUserInfo().name;
    this.authService.setLoginStatus(true);

    this.listenToEvents();

    this.searchFormGroup = this.formBuilder.group({
      title : [this.title,[Validators.required]]
    });

    this.spinner = true;
    this.getMyIssues();
  }

  listenToEvents(){
    this.socketobserver = this.socket.listenToEvent(this.authService.getUserInfo().userId).subscribe(
      data=>{
        this.showNotification(data)
        this.getMyIssues();
      }
    )
  }

  showNotification(data){
    let notification = this._snackBar.open("Issue : "+data.issueTitle+" Update : "+data.message,"Open",{duration :4000});

    notification.onAction().subscribe(()=>{
      this._router.navigate(['user/viewIssue',data.issueId]);
    });
  }

  searchIssue(data){
    this._router.navigate(['user/search',data.title]);
  }

  getMyIssues(){
    this.found = false;
    this.spinner =true;
    this.userService.getMyIssues().subscribe(
      data=>{
        if(data["error"]){
          this.spinner = false;
          this.found = false;
        }else{
          this.spinner = false;
          this.found = true
          this.issues = data["data"];
        }
      },
      err=>{
        this.spinner = false;
        console.log("something went wrong");
      }
    )
  }

  ngOnDestroy(): void {
    this.socketobserver.unsubscribe();
  }

}
