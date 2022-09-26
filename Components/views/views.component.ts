import { AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-views',
  templateUrl: './views.component.html',
  styleUrls: ['./views.component.css']
})
export class ViewsComponent implements OnInit, AfterViewInit {

  constructor() { }

  @Output() eventChange = new EventEmitter<Event>();
  @Output() eventChange1 = new EventEmitter<Event>();
  @Output() eventChange2 = new EventEmitter<Event>();
  @Output() eventChange3 = new EventEmitter<Event>();
  @Output() eventChange4 = new EventEmitter<Event>();


  ngOnInit(): void {
  }

  ngAfterViewInit() {
  }

  showObjectTypePanel(event: any) {
    this.eventChange.emit(event);
  }

  showPerigeePanel(event: any) {
    this.eventChange1.emit(event);
  }

  showPeriodPanel(event: any) {
    this.eventChange2.emit(event);
  }

  showInclinationPanel(event: any) {
    this.eventChange3.emit(event);
  }

  showCountryOriginPanel(event: any) {
    this.eventChange4.emit(event);
  }

  activeClass(event: any) {
    var elms: any = document.querySelectorAll('#activeClass .boxs');
    // reset all you menu items
    for (let ele of elms) {
      ele.classList.remove('active')
    }
    // add active class
    event.target.classList.add('active')
  }

}


