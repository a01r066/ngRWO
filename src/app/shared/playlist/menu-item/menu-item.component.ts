import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
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
  @Output() subMenuEvent = new EventEmitter<NavItem>();

  constructor(public router: Router) {}

  ngOnInit() {}

  onSelectSubMenu(item: NavItem){
    // console.log("SubMenu: " + item.title);
    this.subMenuEvent.emit(item);
  }
}
