import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthenticationService } from 'src/app/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/user.service';
import { Subscription } from 'rxjs';
import { SocketService } from 'src/app/socket.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';

@Component({
  selector: 'app-search-view',
  templateUrl: './search-view.component.html',
  styleUrls: ['./search-view.component.css'],
  providers: [SocketService, Location],
})
export class SearchViewComponent implements OnInit, OnDestroy {
  public title: string;
  public issues: any;
  public spinner: boolean;
  public found: boolean;
  public socketObserver: Subscription;

  constructor(
    private location: Location,
    private _router: Router,
    private _snackBar: MatSnackBar,
    private socket: SocketService,
    private authService: AuthenticationService,
    private router: ActivatedRoute,
    private userService: UserService
  ) {
    this.spinner = true;
    this.found = false;
    this.title = router.snapshot.paramMap.get('title');
  }
  ngOnDestroy(): void {
    this.socketObserver.unsubscribe();
  }

  ngOnInit(): void {
    this.authService.setLoginStatus(true);

    this.getIssues();

    this.listenToEvents();
  }

  getIssues() {
    this.found = false;
    this.spinner = true;
    this.userService.searchIssue(this.title).subscribe(
      (data) => {
        if (data['error']) {
          this.found = false;
          this.spinner = false;
          console.log(data['message']);
        } else {
          this.spinner = false;
          this.found = true;
          this.issues = data['data'];
        }
      },
      (err) => {
        this.spinner = false;
        console.log('something went wrong');
      }
    );
  }

  goBack() {
    this.location.back();
  }

  listenToEvents() {
    this.socketObserver = this.socket
      .listenToEvent(this.authService.getUserInfo().userId)
      .subscribe((data) => {
        this.getIssues();
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
}
