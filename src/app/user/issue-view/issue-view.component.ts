import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/user.service';
import { AuthenticationService } from 'src/app/authentication.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommentModel } from 'src/app/models/commentModel';
import { saveAs } from 'file-saver';
import { SocketService } from 'src/app/socket.service';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';

@Component({
  selector: 'app-issue-view',
  templateUrl: './issue-view.component.html',
  styleUrls: ['./issue-view.component.css'],
  providers: [SocketService, Location],
})
export class IssueViewComponent implements OnInit, OnDestroy {
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
  public watching: boolean;
  public currentUser = this.authService.getUserInfo().userId;
  public currentAssignee: any;
  public deleting: boolean = false;
  public adding: boolean = false;
  public socketObserver: Subscription;

  constructor(
    private _snackBar: MatSnackBar,
    private _router: ActivatedRoute,
    private userService: UserService,
    private authService: AuthenticationService,
    private formBuilder: FormBuilder,
    private _socket: SocketService,
    private router: Router,
    private location: Location
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

  ngOnDestroy() {
    this.socketObserver.unsubscribe();
  }

  ngOnInit(): void {
    this.getCurrentIssue();

    this.authService.getAllUsers().subscribe((data) => {
      this.users = data['data'];
    });

    this.getComment();

    this.listenToEvents();
  }

  goBack() {
    this.location.back();
  }

  listenToEvents() {
    this.socketObserver = this._socket
      .listenToEvent(this.authService.getUserInfo().userId)
      .subscribe((data) => {
        if (data.issueId == this.issue.issueId) {
          this.getCurrentIssue();
          this.getComment();
        } else {
          this.showNotification(data);
        }
      });
  }

  showNotification(data) {
    let notification = this._snackBar.open(
      'Issue : ' + data.issueTitle + ' Update : ' + data.message,
      'Open',
      { duration: 4000 }
    );

    notification.onAction().subscribe(() => {
      this.router.navigate(['user/viewIssue', data.issueId]);
    });
  }

  getCurrentIssue() {
    this.found = false;
    this.issueSpinner = false;
    this.userService.getIssue(this.issueId).subscribe(
      (data) => {
        if (data['error']) {
          this.issueSpinner = false;
          console.log(data['message']);
        } else {
          this.issueSpinner = false;
          this.found = true;
          this.issue = data['data'];
          this.currentAssignee = data['data'].assignedTo.userId;
          this.isWatching();
        }
      },
      (err) => {
        this.issueSpinner = false;
        console.log('Something went wrong');
      }
    );
  }

  startWatching() {
    this.userService
      .addWatcher(this.issueId, this.currentUser)
      .subscribe((data) => {
        this.issue = data['data'];
        this.isWatching();
        this._socket.emitWatchersModified(this.issueId);
      });
  }

  stopWatching() {
    this.userService
      .removeWatcher(this.issueId, this.currentUser)
      .subscribe((data) => {
        this.issue = data['data'];
        this.isWatching();
        this._socket.emitWatchersModified(this.issueId);
      });
  }

  isWatching() {
    for (let user of this.issue.watchers) {
      if (user.userId == this.currentUser) {
        this.watching = true;
        break;
      }
      this.watching = false;
    }
  }

  getComment() {
    this.commentFound = false;
    this.commentSpinner = true;
    this.userService.getComment(this.issueId).subscribe(
      (data) => {
        if (data['error']) {
          this.commentSpinner = false;
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
            this._socket.emitComment({
              userName: this.authService.getUserInfo().name,
              issueId: this.issueId,
            });
          }
        },
        (err) => {
          console.log('something went wrong');
        }
      );
    }
  }

  updateIssue() {
    if (
      this.issue.description != null &&
      this.issue.description != undefined &&
      this.issue.description != ''
    ) {
      this.issue.assignedTo.userId = this.currentAssignee;
      this.userService.updateIssue(this.issueId, this.issue).subscribe(
        (data) => {
          if (data['error']) {
            console.log(data['message']);
          } else {
            this.issue = data['data'];
            this.isWatching();
            this._socket.emitIssueModified(this.issueId);
          }
        },
        (err) => {
          console.log('something went Wrong');
        }
      );
    } else {
      this._snackBar.open('Description Cannot be Empty', 'Dismiss', {
        duration: 2000,
      });
    }
  }

  fileChangeEvent(event) {
    this.files = event.target.files;
  }

  addAttachment() {
    if (this.files != null && this.files != undefined && this.files != '') {
      this.adding = true;
      let formData = new FormData();
      for (let file of this.files) {
        formData.append('file', file);
      }
      this.userService.addAttachments(this.issueId, formData).subscribe(
        (data) => {
          if (data['error']) {
            this.adding = false;
            console.log(data['message']);
          } else {
            this.adding = false;
            this.issue.attachments = data['data'];
            this._socket.emitAttachmentsModified(this.issueId);
          }
        },
        (err) => {
          this.adding = false;
          console.log('something went wrong');
        }
      );
    } else {
      this._snackBar.open('Attach Data First', 'Dismiss', {
        duration: 3000,
      });
    }
  }

  deleteAttachment(filename) {
    this.deleting = true;
    this.userService.deleteAttachment(this.issueId, filename).subscribe(
      (data) => {
        if (data['error']) {
          this.deleting = false;
          console.log(data['message']);
        } else {
          this.deleting = false;
          this.issue.attachments = data['data'];
          this._socket.emitAttachmentsModified(this.issueId);
        }
      },
      (err) => {
        this.deleting = false;
        console.log('Something went wrong');
      }
    );
  }

  downloadAttachment(filename) {
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
