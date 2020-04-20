import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/authentication.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/user.service';

@Component({
  selector: 'app-search-view',
  templateUrl: './search-view.component.html',
  styleUrls: ['./search-view.component.css']
})
export class SearchViewComponent implements OnInit {

  public title : string;
  public issues : any;
  public spinner : boolean;
  public found : boolean;

  constructor(private authService : AuthenticationService,private router : ActivatedRoute,private userService : UserService) {
    this.spinner = true;
    this.found = false;
    this.title = router.snapshot.paramMap.get('title');
   }

  ngOnInit(): void {
    this.authService.setLoginStatus(true);

    this.userService.searchIssue(this.title).subscribe(
      data=>{
        if(data["error"]){
          this.found = false;
          this.spinner = false;
          console.log(data["message"]);
        }else{
          this.spinner = false;
          this.found =true;
          this.issues = data["data"];
          console.log(this.issues);
          console.log(data);
        }
      },
      err=>{
        this.spinner = false;
        console.log("something went wrong");
      }
    )
  }

}
