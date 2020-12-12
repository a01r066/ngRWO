import {NgModule} from '@angular/core';
import {TrendComponent} from './trend/trend.component';
import {TrendDetailComponent} from './trend/trend-detail/trend-detail.component';
import {MusicRoutingModule} from './music-routing.module';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  declarations: [
    TrendComponent,
    TrendDetailComponent
  ],
  imports: [
    SharedModule,
    MusicRoutingModule
  ],
  exports: []
})
export class MusicModule {

}
