import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/user.service';
import { AuthenticationService } from 'src/app/authentication.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommentModel } from 'src/app/models/commentModel';

@Component({
  selector: 'app-issue-view',
  templateUrl: './issue-view.component.html',
  styleUrls: ['./issue-view.component.css']
})
export class IssueViewComponent implements OnInit {

  public issueId : string;
  public issue : any;
  public found : boolean;
  public spinner : boolean;
  public commentFormGroup : FormGroup;
  public comment : string;

  constructor(private _snackBar: MatSnackBar,private _router : ActivatedRoute,private userService : UserService,private authService : AuthenticationService,private formBuilder : FormBuilder) {
    this.authService.setLoginStatus(true);
    this.found = false;
    this.spinner = true;
    this.issueId = _router.snapshot.paramMap.get('issueId');

    this.commentFormGroup = this.formBuilder.group({
      comment : [this.comment,[]]
    })
   }

  ngOnInit(): void {
    this.userService.getIssue(this.issueId).subscribe(
      data=>{
        if(data["error"]){
          console.log(data);
          this.spinner = false;
          console.log(data["message"]);
        }else{
          this.spinner = false;
          this.found = true
          this.issue = data["data"];
          console.log("Got issue");
        }
      },
      err=>{
        this.spinner = false;
        console.log("Something went wrong");
      }
    )
  }

  addComment(data){

    if(data.comment=="" || data.comment == undefined || data.comment==null){
      this._snackBar.open("Enter Comment First","Dismiss",{duration : 1000})
    }else{
      const comment = new CommentModel();
      comment.userId = this.authService.getUserInfo().userId;
      comment.issueId = this.issueId;
      comment.comment = data.comment;
      comment.createdOn = new Date();
      this.userService.addComment(comment).subscribe(
        data=>{
          console.log(data);
        }
      )
    }
  }

}
