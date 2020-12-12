import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TrendComponent} from './trend/trend.component';
import {TrendDetailComponent} from './trend/trend-detail/trend-detail.component';

const routes: Routes = [
  { path: 'trend', component: TrendComponent, children: [
      { path: ':id', component: TrendDetailComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MusicRoutingModule {
}
