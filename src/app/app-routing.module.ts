import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {SearchComponent} from './search/search.component';
import {LoginComponent} from './auth/login/login.component';
import {SignupComponent} from './auth/signup/signup.component';
import {LibraryComponent} from './library/library.component';
import {GenreListComponent} from './search/genre/genre-list/genre-list.component';
import {GenreDetailComponent} from './search/genre/genre-detail/genre-detail.component';
import {GenreComponent} from './search/genre/genre.component';
import {PlaylistComponent} from './shared/playlist/playlist.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'search', component: SearchComponent, children: [
      { path: '', component: GenreListComponent }
    ] },
  { path: 'genre', component: GenreComponent, children: [
      { path: ':id', component: GenreDetailComponent }
    ]},
  { path: 'playlist/:id', component: PlaylistComponent },
  { path: 'library', component: LibraryComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
