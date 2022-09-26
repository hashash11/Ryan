import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-ground-view',
  templateUrl: './ground-view.component.html',
  styleUrls: ['./ground-view.component.css']
})
export class GroundViewComponent implements OnInit {

  @Output() event = new EventEmitter<any>;

  constructor() { }

  ngOnInit(): void {
  }

  /* switch work start */

  isShown: boolean = false; // hidden by default

  /* Ground View switch */
  toggleShow() {
    this.isShown = !this.isShown;
  }

  locationSelected(value: any) {
    this.event.emit("Location:" + value);
  }
}
