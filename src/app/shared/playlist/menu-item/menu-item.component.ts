import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {NavItem} from '../../nav-item';
import {Router} from '@angular/router';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.css']
})
export class MenuItemComponent implements OnInit {
  @Input() items: NavItem[];
  // @ViewChild('childMenu') public childMenu;
  @ViewChild('childMenu', {static: true}) public childMenu: any;

  constructor(public router: Router) {}

  ngOnInit() {}
}
