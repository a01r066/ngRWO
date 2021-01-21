import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {SearchComponent} from './search/search.component';
import {GenreListComponent} from './search/genre/genre-list/genre-list.component';
import {GenreDetailComponent} from './search/genre/genre-detail/genre-detail.component';
import {GenreComponent} from './search/genre/genre.component';
import {PlaylistComponent} from './shared/playlist/playlist.component';
import {SearchDetailComponent} from './search/search-detail/search-detail.component';
import {AuthGuard} from './auth/auth.guard';
import {TrendDetailComponent} from './music/trend/trend-detail/trend-detail.component';
import {DonateComponent} from './donate/donate.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'search', component: SearchComponent, children: [
      { path: '', component: GenreListComponent },
      { path: ':id', component: SearchDetailComponent }
    ] },
  { path: 'search/:text/albums', component: TrendDetailComponent },
  { path: 'search/:text/tracks', component: SearchDetailComponent },
  { path: 'genre', component: GenreComponent, children: [
      { path: ':id', component: GenreDetailComponent }
    ]},
  { path: 'playlist/:id', component: PlaylistComponent },
  { path: 'album/:id', component: PlaylistComponent },
  { path: 'donate', component: DonateComponent }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {
}
