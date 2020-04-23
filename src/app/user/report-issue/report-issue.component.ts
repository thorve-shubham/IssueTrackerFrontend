import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthenticationService } from 'src/app/authentication.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Issue } from 'src/app/models/issueModel';
import { UserService } from 'src/app/user.service';
import { generate } from 'shortid';
import { Router } from '@angular/router';
import { SocketService } from 'src/app/socket.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';

@Component({
  selector: 'app-report-issue',
  templateUrl: './report-issue.component.html',
  styleUrls: ['./report-issue.component.css'],
  providers: [SocketService, Location],
})
export class ReportIssueComponent implements OnInit, OnDestroy {
  public reportIssueFormGroup: FormGroup;
  public issue: Issue;
  public users: any;
  public files: any;
  public reporting: boolean = false;
  public socketObserver: Subscription;

  constructor(
    private location: Location,
    private _snackBar: MatSnackBar,
    private socket: SocketService,
    private _router: Router,
    private authService: AuthenticationService,
    private formBuilder: FormBuilder,
    private userService: UserService
  ) {
    this.issue = new Issue();
    this.issue.reporter = authService.getUserInfo().name;
    this.issue.status = 'In Progress';
    this.issue.seen = false;
  }

  goBack() {
    this.location.back();
  }

  ngOnDestroy(): void {
    this.socketObserver.unsubscribe();
  }

  ngOnInit(): void {
    this.authService.setLoginStatus(true);
    this.reportIssueFormGroup = this.formBuilder.group({
      title: [this.issue.title, [Validators.required]],
      description: [this.issue.description, [Validators.required]],
      status: [{ value: this.issue.status, disabled: true }],
      assignedTo: [this.issue.assignedTo, [Validators.required]],
      reporter: [{ value: this.issue.reporter, disabled: true }],
    });

    this.authService.getAllUsers().subscribe((data) => {
      this.users = data['data'];
    });

    this.listenToEvents();
  }

  listenToEvents() {
    this.socketObserver = this.socket
      .listenToEvent(this.authService.getUserInfo().userId)
      .subscribe((data) => {
        this.showNotification(data);
      });
  }

  showNotification(data) {
    let notification = this._snackBar.open(
      'Issue : ' + data.issueTitle + ' Update : ' + data.message,
      'Open',
      { duration: 4000 }
    );

    notification.onAction().subscribe(() => {
      this._router.navigate(['user/viewIssue', data.issueId]);
    });
  }

  reportIssue(newIssue) {
    this.reporting = true;
    //this.issue.attachments = this.files;
    this.issue.reporter = this.authService.getUserInfo().userId;
    this.issue.issueId = generate();
    this.issue.createdOn = new Date();
    this.issue.assignedTo = newIssue.assignedTo;
    this.issue.description = newIssue.description;
    this.issue.title = newIssue.title;
    let formData = new FormData();
    if (this.files != undefined && this.files != null && this.files != '') {
      for (let file of this.files) {
        formData.append('file', file);
      }
    }

    this.userService.reportIssue(this.issue).subscribe(
      (res) => {
        if (res['error']) {
          this.reporting = false;
          console.log(res['message']);
        } else {
          if (
            this.files != undefined &&
            this.files != null &&
            this.files != ''
          ) {
            this.userService
              .addAttachments(res['data'].issueId, formData)
              .subscribe(
                (data) => {
                  this.reporting = false;
                  if (!data['error']) {
                    this._router.navigate([
                      'user/viewIssue',
                      res['data'].issueId,
                    ]);
                  } else {
                    console.log(data['message']);
                  }
                },
                (err) => {
                  this.reporting = false;
                  console.log('something went wrong');
                }
              );
          } else {
            this.reporting = false;
            this._router.navigate(['user/viewIssue', res['data'].issueId]);
          }
        }
      },
      (err) => {
        this.reporting = false;
        console.log('Something went Wrong');
      }
    );
  }

  fileChangeEvent(event) {
    this.files = event.target.files;
  }
}
