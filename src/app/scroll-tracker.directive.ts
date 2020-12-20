import {Directive, EventEmitter, HostListener, Output} from '@angular/core';

@Directive({
  selector: '[scrollTracker]'
})
export class ScrollTrackerDirective {
  @Output() scrollingFinished = new EventEmitter<void>();
  emitted = false;

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    console.log("Directive Scrolling...");
    if(window.innerHeight + window.scrollY >= document.body.offsetHeight && !this.emitted){
      console.log("Directive Scrolling...");
      this.emitted = true;
      this.scrollingFinished.emit();
    } else if(window.innerHeight + window.scrollY < document.body.offsetHeight) {
      console.log("Directive Scrolling...");
      this.emitted = false;
    }
  }
}
