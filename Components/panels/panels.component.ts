import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-panel',
  templateUrl: './panels.component.html',
  styleUrls: ['./panels.component.css']
})
export class PanelsComponent implements OnInit {

  isObPanel: boolean = false;
  isPerigeePanel: boolean = false;
  isPeriodPanel: boolean = false;
  isIncPanel: boolean = false;
  isCountryPanel: boolean = false;

  constructor() { }

  ngOnInit(): void {

  }

  @Input() set event(event: Event) {
    if (event) {
      this.obPaneltoggle();
    }
  }

  @Input() set event1(event: Event) {
    if (event) {
      this.perigeePaneltoggle();
    }
  }

  @Input() set event2(event: Event) {
    if (event) {
      this.periodPaneltoggle();
    }
  }
  @Input() set event3(event: Event) {
    if (event) {
      this.incPaneltoggle();
    }
  }
  @Input() set event4(event: Event) {
    if (event) {
      this.countryPaneltoggle();
    }
  }

  obPaneltoggle() {
    this.isPerigeePanel = false;
    this.isPeriodPanel = false;
    this.isIncPanel = false;
    this.isCountryPanel = false;
    this.isObPanel = !this.isObPanel;
  }
  perigeePaneltoggle() {
    this.isObPanel = false;
    this.isPeriodPanel = false;
    this.isIncPanel = false;
    this.isCountryPanel = false;
    this.isPerigeePanel = !this.isPerigeePanel;
  }
  periodPaneltoggle() {
    this.isObPanel = false;
    this.isPerigeePanel = false;
    this.isIncPanel = false;
    this.isCountryPanel = false;
    this.isPeriodPanel = !this.isPeriodPanel;
  }
  incPaneltoggle() {
    this.isObPanel = false;
    this.isPerigeePanel = false;
    this.isPeriodPanel = false;
    this.isCountryPanel = false;
    this.isIncPanel = !this.isIncPanel;
  }
  countryPaneltoggle() {
    this.isObPanel = false;
    this.isPerigeePanel = false;
    this.isPeriodPanel = false;
    this.isIncPanel = false;
    this.isCountryPanel = !this.isCountryPanel;
  }

}
