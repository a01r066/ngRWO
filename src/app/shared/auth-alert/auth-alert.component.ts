import {Component, Input, OnInit} from '@angular/core';
import {UiService} from '../ui.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-auth-alert',
  templateUrl: './auth-alert.component.html',
  styleUrls: ['./auth-alert.component.css']
})
export class AuthAlertComponent implements OnInit {
  // @Input() message: string;
  constructor(private uiService: UiService,
              private router: Router) { }

  ngOnInit(): void {
  }

  onClose(){
    this.uiService.loginAlertChanged.next(false);
  }

  onSignUp(){
    this.onClose();
    this.router.navigate(['/signup']);
  }

  onLogin(){
    this.onClose();
    this.router.navigate(['/login']);
  }

  onDownload(){
    this.onClose();
    window.open('https://apps.apple.com/vn/app/kho-ebooks-audiobooks/id1366613779', '_blank');
  }
}
