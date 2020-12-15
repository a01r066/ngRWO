import {Album} from '../music/models/album.model';

export interface NavItem {
  title: string;
  subItems?: Album[];
}
