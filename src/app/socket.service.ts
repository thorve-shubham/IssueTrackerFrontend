import { Injectable, OnDestroy } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable()
export class SocketService implements OnDestroy{

  public socket : any;

  constructor() { 
    this.socket = io("api.shubhamthorvetest.in/issueTracker");
  }


  emitAttachmentsModified(issueId){
    this.socket.emit("attachment",issueId)
  }

  emitWatchersModified(issueId){
    this.socket.emit("watchersModified",issueId);
  }

  emitIssueModified(issueId){
    this.socket.emit("issueModified",issueId);
  }
  
  emitComment(data){
    this.socket.emit("commentModified",data);
  }

  listenToEvent(userId){
    return Observable.create((observer)=>{
      this.socket.on(userId,(data)=>{
        observer.next(data);
      })
    })
  }

  ngOnDestroy(): void {
    this.socket.destroy();
  }
}
