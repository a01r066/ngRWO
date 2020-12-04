import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {FirebaseService} from './firebase.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'ngRWO';
  opened: boolean = true;
  mode = new FormControl('side');
  @ViewChild('searchText') searchTextRef: ElementRef;

  constructor(private firebaseService: FirebaseService) {
  }

  ngOnInit(): void {
  }

  back(){
    window.history.back();
  }

  next(){
    window.history.forward();
  }

  clearText(){
    this.searchTextRef.nativeElement.value = '';
    this.firebaseService.searchTextSub.next('');
  }

  onTextChange(){
    this.processSearch();
  }

  onBackspace(){
    this.processSearch();
  }

  processSearch(){
    const searchText = this.searchTextRef.nativeElement.value;
    if(searchText === ''){
      this.clearText();
    } else {
      this.firebaseService.searchTextSub.next(searchText);
    }
  }
}
