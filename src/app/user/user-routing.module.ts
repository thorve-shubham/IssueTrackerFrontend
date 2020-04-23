import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UnauthService } from '../routeGuards/unauth.service';
import { AuthService } from '../routeGuards/auth.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReportIssueComponent } from './report-issue/report-issue.component';
import { IssueViewComponent } from './issue-view/issue-view.component';
import { SearchViewComponent } from './search-view/search-view.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthService],
  },
  {
    path: 'reportIssue',
    component: ReportIssueComponent,
    canActivate: [AuthService],
  },
  {
    path: 'viewIssue/:issueId',
    component: IssueViewComponent,
    canActivate: [AuthService],
  },
  {
    path: 'search/:title',
    component: SearchViewComponent,
    canActivate: [AuthService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
