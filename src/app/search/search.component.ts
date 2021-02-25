import { Component, OnInit } from '@angular/core';
import {FirebaseService} from '../firebase.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  searchText = '';

  constructor(private firebaseService: FirebaseService) { }

  ngOnInit(): void {
    this.searchText = this.firebaseService.searchedText;
    this.firebaseService.searchTextSub.subscribe(searchText => {
      this.searchText = searchText;
    });
  }
}
