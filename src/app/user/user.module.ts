import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';
import { ReportIssueComponent } from './report-issue/report-issue.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IssueListComponent } from './issue-list/issue-list.component';
import { MaterialModule } from '../material/material.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { IssueViewComponent } from './issue-view/issue-view.component';
import { SearchViewComponent } from './search-view/search-view.component';
import { EditorModule } from '@tinymce/tinymce-angular';


@NgModule({
  declarations: [ReportIssueComponent, IssueListComponent,DashboardComponent, IssueViewComponent, SearchViewComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    EditorModule,
  ]
})
export class UserModule { }
