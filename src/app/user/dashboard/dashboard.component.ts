import { Component, OnInit, ComponentFactoryResolver } from '@angular/core';
import { AuthenticationService } from 'src/app/authentication.service';
import { Issue } from 'src/app/models/issueModel';
import { UserService } from 'src/app/user.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public issues : [any];
  public found : boolean;
  public user : string;
  public spinner : boolean;
  public searchFormGroup : FormGroup;
  public title : string;

  constructor(private _router : Router,private formBuilder : FormBuilder,private authService : AuthenticationService,private userService : UserService) { }

  ngOnInit(): void {
    this.user = this.authService.getUserInfo().name;
    this.authService.setLoginStatus(true);

    this.searchFormGroup = this.formBuilder.group({
      title : [this.title,[Validators.required]]
    });

    this.spinner = true;
    this.getMyIssues();
  }

  searchIssue(data){
    this._router.navigate(['user/search',data.title]);
  }

  getMyIssues(){
    this.userService.getMyIssues().subscribe(
      data=>{
        if(data["error"]){
          this.spinner = false;
          console.log("No Issues Reported Yet");
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

}
