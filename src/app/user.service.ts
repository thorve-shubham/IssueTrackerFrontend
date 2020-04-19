import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Issue } from './models/issueModel';
import { AuthenticationService } from './authentication.service';
import { CommentModel } from './models/commentModel';

@Injectable({
  providedIn: 'root'
})
export class UserService {

 

  constructor(private _http : HttpClient,private authService : AuthenticationService) {
   
  }

  reportIssue(issue:Issue){
    return this._http.post("http://localhost:3000/issue/create",issue);
  }

  addAttachments(issueId,files){
    return this._http.post("http://localhost:3000/attachment/create/"+issueId,files);
  }

  getMyIssues(){

    return this._http.get("http://localhost:3000/issue/get/assignedTo/"+this.authService.getUserInfo().userId); 
  }

  addComment(comment: CommentModel){
    return this._http.post("http://localhost:3000/comment/add",comment);
  }

  getIssue(issueId : string){
    return this._http.get("http://localhost:3000/issue/get/issue/"+issueId);
  }

}
