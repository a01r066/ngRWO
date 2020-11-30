import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'ngRWO';
  opened: boolean = true;
  mode = new FormControl('side');

  constructor() {
  }

  ngOnInit(): void {
  }

  back(){
    window.history.back();
  }

  next(){
    window.history.forward();
  }
}
