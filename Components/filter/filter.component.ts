import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {

  @Output() event = new EventEmitter<any>;

  constructor() { }

  selectObjectType: boolean = false;
  selectCountryofOrigin: boolean = false;
  datePicker: boolean = false;
  minMax: boolean = true;
  filterValue: boolean = false;

  filterMin: string = '';
  filterMax: string = '';
  filterSelectValue: string = 'Perigee';
  filterSelectIndex: number = 0;
  CountrySelectValue: string = '';
  objectSelectValue: string = '';
  startDate: string = '';
  endDate: string = '';
  isIdExist: boolean = false;
  list: any[] = [];

  /* Select filter option change start */
  filterSelectedValue(event: any) {
    this.minMax = true;
    this.selectCountryofOrigin = false;
    this.selectObjectType = false;
    this.datePicker = false;
    // input value set to default
    this.filterMin = '';
    this.filterMax = '';
    this.filterSelectValue = 'Perigee';
    this.CountrySelectValue = '';
    this.objectSelectValue = '';
    this.startDate = '';
    this.endDate = '';

    if (event.target.selectedIndex === 3) {
      this.minMax = false;
      this.selectCountryofOrigin = true;
    } else if (event.target.selectedIndex === 4) {
      this.minMax = false;
      this.selectObjectType = true;
    }
    else if (event.target.selectedIndex === 5) {
      this.minMax = false;
      this.datePicker = true;
    }
  }
  /* Select filter option change end */

  onFilterSelected(value: string, index: number): void {
    this.filterSelectValue = value;
    this.filterSelectIndex = index;
  }

  onCountrySelected(value: string): void {
    this.CountrySelectValue = value;
  }

  onObTySelected(value: string): void {
    this.objectSelectValue = value;
  }

  onStartDateSelect(value: string): void {
    this.startDate = value;
  }

  onEndDateSelect(value: string): void {
    this.endDate = value;
  }

  onMin(value: string = '0'): void {
    this.filterMin = value;
  }

  onMax(value: string = '0'): void {
    this.filterMax = value;
  }


  addFilterValue() {

    this.filterValue = true;
    let st;
    let min = +this.filterMin;
    let max = +this.filterMax;

    if (this.filterSelectIndex === 0) {
      st = this.concatString(this.filterSelectValue, min, max)
    }
    else if (this.filterSelectIndex === 1) {
      st = this.concatString(this.filterSelectValue, min, max)
    }
    else if (this.filterSelectIndex === 2) {
      st = this.concatString(this.filterSelectValue, min, max)
    }
    else if (this.filterSelectIndex === 3) {
      st = this.concatString2(this.filterSelectValue, this.CountrySelectValue)
    }
    else if (this.filterSelectIndex === 4) {
      st = this.concatString2(this.filterSelectValue, this.objectSelectValue)
    }
    else if (this.filterSelectIndex === 5) {
      st = this.concatDate(this.filterSelectValue, this.startDate, this.endDate)
    }

    this.isIdExist = this.checkIdExistence(this.filterSelectIndex);
    if (this.isIdExist === true) {
      let indexOfObject = this.checkIndexExistence(this.filterSelectIndex)
      if (indexOfObject !== -1) {
        this.list.splice(indexOfObject, 1);
      }
      this.list.push({ option: st, id: this.filterSelectIndex });
    } else {
      this.list.push({ option: st, id: this.filterSelectIndex });
    }

    // sending array to parent component
    this.event.emit(this.list);
  }

  concatString(value: string, min: number, max: number) {
    let st;
    if (min == 0 && max == 0) {
      st = value + " is anything";
    }
    else if (min != 0 && max != 0) {
      st = value + " is [" + min + ", " + max + "]";
    }
    else if (min != 0 || max != 0) {
      if (min != 0) {
        st = value + " ≥ " + min;
      }
      else {
        st = value + " ≤ " + max;
      }
    }
    return st;
  }

  concatString2(value: string, val: string) {
    let str;
    if (val == '') {
      str = value + ' is anything'
    } else {
      str = value + " is " + val;
    }
    return str;
  }

  concatDate(value: string, start: string, end: string) {
    let str;
    if (start == '' && end == '') {
      str = value + ' is anything'
    }
    else if (start != '' && end != '') {
      str = value + ": " + start + " to " + end;
    }
    else if (start != '' || end != '') {
      if (start != '') {
        str = value + ": " + start + " to anything";
      }
      else {
        str = value + ": anything to " + end;
      }
    }
    return str;
  }

  checkIndexExistence(id: number): number {
    let indexOfObject = this.list.findIndex((object) => {
      return object.id === id;
    });
    return indexOfObject;
  }

  checkIdExistence(id: number): boolean {
    return this.list.some(r => r.id === id);
  }

  removeList(event: any) {
    let id = event.target.parentNode.id;
    id = Number.parseInt(id)
    // remove li element from html
    event.target.parentNode.remove();

    // remove value from array
    let indexOfObject = this.checkIndexExistence(id);
    if (indexOfObject !== -1) {
      this.list.splice(indexOfObject, 1);
    }
    this.event.emit(this.list);
  }
  ngOnInit(): void {

  }

}
