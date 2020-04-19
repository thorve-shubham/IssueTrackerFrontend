import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';
import { ReportIssueComponent } from './report-issue/report-issue.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IssueListComponent } from './issue-list/issue-list.component';
import { MaterialModule } from '../material/material.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { IssueViewComponent } from './issue-view/issue-view.component';


@NgModule({
  declarations: [ReportIssueComponent, IssueListComponent,DashboardComponent, IssueViewComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ]
})
export class UserModule { }
