import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  itemsCounterSub = new Subject<number>();
}
