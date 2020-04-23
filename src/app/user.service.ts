import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Issue } from './models/issueModel';
import { AuthenticationService } from './authentication.service';
import { CommentModel } from './models/commentModel';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private _http: HttpClient,
    private authService: AuthenticationService
  ) {}

  reportIssue(issue: Issue) {
    // return this._http.post(
    //   'http://localhost:3000/issue/create?authToken=' +
    //     localStorage.getItem('authToken'),
    //   issue
    // );
    return this._http.post(
      'http://api.shubhamthorvetest.in/issue/create?authToken=' +
        localStorage.getItem('authToken'),
      issue
    );
  }

  addAttachments(issueId, files) {
    // return this._http.post(
    //   'http://localhost:3000/attachment/create/' +
    //     issueId +
    //     '?authToken=' +
    //     localStorage.getItem('authToken'),
    //   files
    // );
    return this._http.post(
      'http://api.shubhamthorvetest.in/attachment/create/' +
        issueId +
        '?authToken=' +
        localStorage.getItem('authToken'),
      files
    );
  }

  getMyIssues() {
    // return this._http.get(
    //   'http://localhost:3000/issue/get/assignedTo/' +
    //     this.authService.getUserInfo().userId +
    //     '?authToken=' +
    //     localStorage.getItem('authToken')
    // );
    return this._http.get(
      'http://api.shubhamthorvetest.in/issue/get/assignedTo/' +
        this.authService.getUserInfo().userId +
        '?authToken=' +
        localStorage.getItem('authToken')
    );
  }

  addComment(comment: CommentModel) {
    // return this._http.post(
    //   'http://localhost:3000/comment/add' +
    //     '?authToken=' +
    //     localStorage.getItem('authToken'),
    //   comment
    // );
    return this._http.post(
      'http://api.shubhamthorvetest.in/comment/add' +
        '?authToken=' +
        localStorage.getItem('authToken'),
      comment
    );
  }

  getIssue(issueId: string) {
    // return this._http.get(
    //   'http://localhost:3000/issue/get/issue/' +
    //     issueId +
    //     '?authToken=' +
    //     localStorage.getItem('authToken')
    // );
    return this._http.get(
      'http://api.shubhamthorvetest.in/issue/get/issue/' +
        issueId +
        '?authToken=' +
        localStorage.getItem('authToken')
    );
  }

  getComment(issueId) {
    // return this._http.get(
    //   'http://localhost:3000/comment/get/' +
    //     issueId +
    //     '?authToken=' +
    //     localStorage.getItem('authToken')
    // );
    return this._http.get(
      'http://api.shubhamthorvetest.in/comment/get/' +
        issueId +
        '?authToken=' +
        localStorage.getItem('authToken')
    );
  }

  updateIssue(issueId, issue) {
    // return this._http.put(
    //   'http://localhost:3000/issue/update/' +
    //     issueId +
    //     '?authToken=' +
    //     localStorage.getItem('authToken'),
    //   issue
    // );
    return this._http.put(
      'http://api.shubhamthorvetest.in/issue/update/' +
        issueId +
        '?authToken=' +
        localStorage.getItem('authToken'),
      issue
    );
  }

  deleteAttachment(issueId, filename) {
    // return this._http.put(
    //   'http://localhost:3000/attachment/delete/' +
    //     issueId +
    //     '?authToken=' +
    //     localStorage.getItem('authToken'),
    //   { filename: filename }
    // );
    return this._http.put(
      'http://api.shubhamthorvetest.in/attachment/delete/' +
        issueId +
        '?authToken=' +
        localStorage.getItem('authToken'),
      { filename: filename }
    );
  }

  downloadAttachment(filename) {
    // return this._http.get(
    //   'http://localhost:3000/attachment/download/' +
    //     filename +
    //     '?authToken=' +
    //     localStorage.getItem('authToken'),
    //   {
    //     responseType: 'blob',
    //   }
    // );
    return this._http.get(
      'http://api.shubhamthorvetest.in/attachment/download/' +
        filename +
        '?authToken=' +
        localStorage.getItem('authToken'),
      {
        responseType: 'blob',
      }
    );
  }

  searchIssue(title) {
    // return this._http.get(
    //   'http://localhost:3000/issue/search/' +
    //     title +
    //     '?authToken=' +
    //     localStorage.getItem('authToken')
    // );
    return this._http.get(
      'http://api.shubhamthorvetest.in/issue/search/' +
        title +
        '?authToken=' +
        localStorage.getItem('authToken')
    );
  }

  addWatcher(issueId, userId) {
    // return this._http.post(
    //   'http://localhost:3000/issue/addWatcher/' +
    //     issueId +
    //     '?authToken=' +
    //     localStorage.getItem('authToken'),
    //   { userId: userId }
    // );
    return this._http.post(
      'http://api.shubhamthorvetest.in/issue/addWatcher/' +
        issueId +
        '?authToken=' +
        localStorage.getItem('authToken'),
      { userId: userId }
    );
  }

  removeWatcher(issueId, userId) {
    // return this._http.post(
    //   'http://localhost:3000/issue/removeWatcher/' +
    //     issueId +
    //     '?authToken=' +
    //     localStorage.getItem('authToken'),
    //   { userId: userId }
    // );
    return this._http.post(
      'http://api.shubhamthorvetest.in/issue/removeWatcher/' +
        issueId +
        '?authToken=' +
        localStorage.getItem('authToken'),
      { userId: userId }
    );
  }
}
