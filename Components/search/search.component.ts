import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  @Output() event = new EventEmitter<any>;

  constructor() { }

  ngOnInit(): void {
    this.event.emit(this.list);
  }

  /* change speed value */
  speedValue = 25;
  debris: boolean = true;
  beam: boolean = true;
  instrument: boolean = true;
  followEarth: boolean = true;
  autoRefresh: boolean = true;
  list: any[] = [
    { name: 'Speed', value: 25 },
    { name: 'Debris', value: true },
    { name: 'Beam', value: true },
    { name: 'Instrument', value: true },
    { name: 'followEarth', value: true },
    { name: 'autoRefresh', value: true },
  ];

  changeValue(event: any) {
    this.speedValue = event.target.value;
    for (let data of this.list) {
      if (data.name == 'Speed') {
        data.value = this.speedValue;
      }
    }
    this.event.emit(this.list);
  }

  debrisSelected(val: boolean): void {
    this.debris = val;
    for (let data of this.list) {
      if (data.name == 'Debris') {
        data.value = val;
      }
    }
    this.event.emit(this.list);
  }

  beamSelected(val: boolean): void {
    this.beam = val;
    for (let data of this.list) {
      if (data.name == 'Beam') {
        data.value = val;
      }
    }
    this.event.emit(this.list);
  }

  instrumentsSelected(val: boolean): void {
    this.instrument = val;
    for (let data of this.list) {
      if (data.name == 'Instrument') {
        data.value = val;
      }
    }
    this.event.emit(this.list);
  }

  followEarthSelected(val: boolean): void {
    this.followEarth = val;
    for (let data of this.list) {
      if (data.name == 'followEarth') {
        data.value = val;
      }
    }
    this.event.emit(this.list);
  }

  autoRefreshSelected(val: boolean): void {
    this.autoRefresh = val;
    for (let data of this.list) {
      if (data.name == 'autoRefresh') {
        data.value = val;
      }
    }
    this.event.emit(this.list);
  }
}
