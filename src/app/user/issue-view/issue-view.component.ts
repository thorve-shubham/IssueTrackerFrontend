import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/user.service';
import { AuthenticationService } from 'src/app/authentication.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommentModel } from 'src/app/models/commentModel';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-issue-view',
  templateUrl: './issue-view.component.html',
  styleUrls: ['./issue-view.component.css'],
})
export class IssueViewComponent implements OnInit {
  public issueId: string;
  public issue: any;
  public found: boolean;
  public issueSpinner: boolean;
  public commentFormGroup: FormGroup;
  public comment: string;
  public comments: [any];
  public commentSpinner: boolean;
  public commentFound: boolean;
  public users: [any];
  public files: any;
  public watching : boolean;
  public currentUser = this.authService.getUserInfo().userId;
  public currentAssignee : any;

  @ViewChild('select') select : ElementRef;

  constructor(
    private _snackBar: MatSnackBar,
    private _router: ActivatedRoute,
    private userService: UserService,
    private authService: AuthenticationService,
    private formBuilder: FormBuilder
  ) {
    this.authService.setLoginStatus(true);
    this.found = false;
    this.commentFound = false;
    this.issueSpinner = true;
    this.commentSpinner = true;
    this.issueId = _router.snapshot.paramMap.get('issueId');

    this.commentFormGroup = this.formBuilder.group({
      comment: [this.comment, []],
    });
  }

  ngOnInit(): void {
    

    this.getCurrentIssue();
  
    this.authService.getAllUsers().subscribe((data) => {
      this.users = data['data'];
    });

    this.getComment();
  }

  getCurrentIssue(){
    this.userService.getIssue(this.issueId).subscribe(
      (data) => {
        if (data['error']) {
          console.log(data);
          this.issueSpinner = false;
          console.log(data['message']);
        } else {
          this.issueSpinner = false;
          this.found = true;
          this.issue = data['data'];
          console.log('Got issue');
          this.currentAssignee = data["data"].assignedTo;
          console.log(this.currentAssignee);
          this.isWatching();
        }
      },
      (err) => {
        this.issueSpinner = false;
        console.log('Something went wrong');
      }
    );
  }

  startWatching(){
    this.userService.addWatcher(this.issueId,this.currentUser).subscribe(
      data=>{
        this.issue = data["data"];
        this.isWatching();
      }
    )
  }

  stopWatching(){
    this.userService.removeWatcher(this.issueId,this.currentUser).subscribe(
      data=>{
        this.issue = data["data"];
        this.isWatching();
      }
    )
  }

  isWatching(){
    for(let user of this.issue.watchers){
      if(user.userId == this.currentUser){
        this.watching =true;
        break;
      }
      this.watching =false;
    }
    
  }

  getComment() {
    this.commentSpinner = true;
    this.userService.getComment(this.issueId).subscribe(
      (data) => {
        if (data['error']) {
          this.commentSpinner = false;
          console.log('no comments');
        } else {
          this.commentSpinner = false;
          this.commentFound = true;
          this.comments = data['data'];
        }
      },
      (err) => {
        this.commentSpinner = false;
        console.log('Something went Wrong');
      }
    );
  }

  addComment(data) {
    this.commentFormGroup.reset();
    if (
      data.comment == '' ||
      data.comment == undefined ||
      data.comment == null
    ) {
      this._snackBar.open('Enter Comment First', 'Dismiss', { duration: 1000 });
    } else {
      const comment = new CommentModel();
      comment.userId = this.authService.getUserInfo().userId;
      comment.issueId = this.issueId;
      comment.comment = data.comment;
      comment.createdOn = new Date();
      this.userService.addComment(comment).subscribe(
        (data) => {
          if (data['error']) {
            console.log(data['message']);
          } else {
            this.getComment();
          }
        },
        (err) => {
          console.log('something went wrong');
        }
      );
    }
  }

  updateIssue() {
    if(this.issue.description!=null && this.issue.description!=undefined && this.issue.description!=""){
      this.issue.assignedTo.userId =  this.currentAssignee.userId;
      this.userService.updateIssue(this.issueId, this.issue).subscribe(
        (data) => {
          if (data['error']) {
            console.log('update failed');
            console.log(data['message']);
          } else {
            console.log('updated');
            this.issue = data['data'];
            this.isWatching();
          }
        },
        (err) => {
          console.log('something went Wrong');
        }
      );
    }
    else{
      
      this._snackBar.open("Description Cannot be Empty","Dismiss",{duration : 2000});
    }
  }

  fileChangeEvent(event) {
    this.files = event.target.files;
    console.log(this.files);
  }

  addAttachment() {
    if (this.files != null && this.files != undefined && this.files != '') {
      let formData = new FormData();
      for (let file of this.files) {
        formData.append('file', file);
      }
      this.userService
        .addAttachments(this.issueId, formData)
        .subscribe((data) => {
          this.issue.attachments = data['data'];
        });
    }else{
      this._snackBar.open("Attach Data First","Dismiss",{
        duration : 3000
      })
    }
  }

  deleteAttachment(filename) {
    this.userService.deleteAttachment(this.issueId, filename).subscribe(
      (data) => {
        if (data['error']) {
          console.log(data['message']);
        } else {
          this.issue.attachments = data['data'];
        }
      },
      (err) => {
        console.log('Something went wrong');
      }
    );
  }

  downloadAttachment(filename) {
    console.log('ala');
    this.userService.downloadAttachment(filename).subscribe(
      (data) => {
        saveAs(data, filename);
      },
      (err) => {
        console.log('Something went wrong');
      }
    );
  }
}
