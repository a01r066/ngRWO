import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FirebaseService} from '../../firebase.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  isSearchBarHidden: boolean = true;
  @ViewChild('searchText') searchTextRef: ElementRef;

  constructor(private firebaseService: FirebaseService) { }

  ngOnInit(): void {
    this.firebaseService.isSearchBarHiddenSub.subscribe(isHidden => {
      this.isSearchBarHidden = isHidden;
    });
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
