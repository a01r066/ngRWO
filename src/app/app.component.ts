import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {CommonService} from './services/common.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'ngRWO';
  opened: boolean = true;
  mode = new FormControl('side');

  constructor(private commonService: CommonService) {
  }

  ngOnInit(): void {
  }
}
