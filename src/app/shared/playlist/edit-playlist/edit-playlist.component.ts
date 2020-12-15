import { Component, OnInit } from '@angular/core';
import {UiService} from '../../ui.service';

@Component({
  selector: 'app-edit-playlist',
  templateUrl: './edit-playlist.component.html',
  styleUrls: ['./edit-playlist.component.css']
})
export class EditPlaylistComponent implements OnInit {

  constructor(private uiService: UiService) { }

  ngOnInit(): void {
  }

  onDismiss(){
    this.uiService.editPlaylistChanged.next(false);
  }
}
