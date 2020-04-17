import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  public loggedIn$ : Observable<boolean>;
  public currentUser$ : Observable<string>;

  constructor(private authService : AuthenticationService) { }

  ngOnInit(): void {
    this.loggedIn$ = this.authService.isLoggedIn;
    this.currentUser$ = this.authService.isCurrentUser;
  }

}
