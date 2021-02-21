import { Injectable } from '@angular/core';
import {Meta} from '@angular/platform-browser';
import {MetaTag} from '../shared/meta-tag';

@Injectable({
  providedIn: 'root'
})
export class ShareService {

  private urlMeta = 'og:url';
  private titleMeta = 'og:title';
  private descriptionMeta = 'og:description';
  private imageMeta = 'og:image';
  private secureImageMeta = 'og:image:secure_url';

  constructor(private metaService: Meta) { }

  public setFacebookTags(url: string, title: string, description: string, image: string): void {
    // let imageUrl = `https://mytunes.top/${image}`;
    let tags = [
      new MetaTag(this.urlMeta, url),
      new MetaTag(this.titleMeta, title),
      new MetaTag(this.descriptionMeta, description),
      new MetaTag(this.imageMeta, image),
      new MetaTag(this.secureImageMeta, image)
    ];
    this.setTags(tags);
  }

  private setTags(tags: MetaTag[]): void {
    tags.forEach(siteTag => {
      this.metaService.updateTag({ property: siteTag.name, content: siteTag.value });
    });
  }

  getTags(){
    // this.tags.forEach(tag => {
    //   console.log(tag.name + ': ' + tag.value);
    // });
    const title = this.metaService.getTag('title');
    console.log('tag-title: ' + title);
  }
}
