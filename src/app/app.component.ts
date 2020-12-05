import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {FirebaseService} from './firebase.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'Relaxing World Online';
  opened: boolean = true;
  mode = new FormControl('side');

  constructor() {
  }

  ngOnInit(): void {
  }
}
