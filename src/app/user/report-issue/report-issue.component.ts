import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/authentication.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Issue } from 'src/app/models/issueModel';
import { UserService } from 'src/app/user.service';
import { generate } from 'shortid';

@Component({
  selector: 'app-report-issue',
  templateUrl: './report-issue.component.html',
  styleUrls: ['./report-issue.component.css']
})
export class ReportIssueComponent implements OnInit {

  public reportIssueFormGroup : FormGroup;
  public issue : Issue;
  public users : any;
  public files : any;

  constructor(private authService : AuthenticationService, private formBuilder : FormBuilder, private userService : UserService) { 
    this.issue = new Issue();
    this.issue.reporter = authService.getUserInfo().name;
    this.issue.status = "In Progress";
    this.issue.seen = false;
  }

  ngOnInit(): void {
    this.authService.setLoginStatus(true);
    this.reportIssueFormGroup = this.formBuilder.group({
      title : [this.issue.title,[Validators.required]],
      description : [this.issue.description,[Validators.required]],
      status : [{value : this.issue.status,disabled : true}],
      assignedTo : [this.issue.assignedTo,[Validators.required]],
      reporter : [{value : this.issue.reporter, disabled : true}]
    });

    this.authService.getAllUsers().subscribe(
      data=>{
        this.users = data["data"];
      }
    )
    
  }

  reportIssue(newIssue){
    //this.issue.attachments = this.files;
    this.issue.reporter = this.authService.getUserInfo().userId;  
    this.issue.issueId = generate();
    this.issue.createdOn = new Date();
    this.issue.assignedTo = newIssue.assignedTo;
    this.issue.description = newIssue.description;
    this.issue.title = newIssue.title; 
    let formData = new FormData();
    if(this.files!=undefined && this.files !=null && this.files != ""){
      
      for(let file of this.files){
        formData.append("file",file);
      }
    }     
      
    
    this.userService.reportIssue(this.issue).subscribe(
      data=>{
        if(data["error"]){
          console.log("failed");
        }else{
          if(this.files!=undefined && this.files !=null && this.files != ""){
            this.userService.addAttachments(data["data"].issueId,formData).subscribe(
              data=>{
                if(!data["error"]){
                  console.log("Issue Reported");
                }
                else{
                  console.log("somthing went wrong");
                }
              },
              err=>{
                console.log("something went wrong")
              }
            );
          }
        }
      },
      err=>{
        console.log("Something went Wrong");
      }
    );
  }

  fileChangeEvent(event){
    this.files = event.target.files;
  }

}
