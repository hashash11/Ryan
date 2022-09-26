import { Component } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [NgxSpinnerService]
})
export class AppComponent {

  title = 'living-globes';

  saveFilterValues: any[] = [];
  saveSearchValues: any[] = [];
 

  constructor(private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.spinner.show();

    setTimeout(() => {
      this.spinner.hide()
    }, 10000);
  }

  panelHide: boolean = true;
  panel: boolean = true;  // panel
  panels: boolean = true;
  switchingMood: boolean = false;

  // switch button
  switchMoods() {
    if (this.panelHide == false) {
      this.panelHide = true;

      this.panel = true;
      this.panels = true;
      this.switchingMood = false
    } else {
      this.panelHide = false;
      this.panel = false;
      this.panels = false;
      this.switchingMood = true
    }
  }

  // hide menu button
  openClosePanel(event: any) {
    if (event.target.style.top == '10px') {
      event.target.style.top = '575px';
      this.panel = true;
    } else {
      event.target.style.top = '10px';
      this.panel = false;
    }
  }

  // recieve message from search
  searchMessage: any = null;
  recieveSearchMessage($event: any) {
    this.searchMessage = $event;
    // empty array before adding data
    this.saveSearchValues.splice(0);
    for (let li of this.searchMessage) {
      this.saveSearchValues.push(li.name + ":" + li.value);
    }
  }

  // recieve message from location
  locationMessage: any = "Location:null";
  recieveLocationMessage($event: any) {
    this.locationMessage = $event;
  }

  // recieve message from filter
  filterMessage: any
  recieveFilterMessage($event: any) {
    this.filterMessage = $event;
    // empty array before adding data
    this.saveFilterValues.splice(0);

    for (let li of this.filterMessage) {
      let str = li.option;
      if (str.includes('Country')) {
        str = str.replace(" of Origin is ", "=");
        if (str.includes('anything')) {
          str = str.replace("anything", "null");
        }
      }
      else if (str.includes('Object')) {
        str = str.replace(" is ", ":");
        if (str.includes('anything')) {
          str = str.replace("anything", "null");
        }
      }
      else if (str.includes('Date')) {
        if (str.includes('is anything')) {
          str = str.replace(" is anything", ":null");
        } else {
          let [date, start, to, end] = str.split(' ');
          start = "Start Date:" + start;
          end = "End Date:" + end;
          str = start + ", " + end;
          if (str.includes('anything')) {
            str = str.replace("anything", "null");
          }
        }
      }
      else if (str.includes(' is anything')) {
        str = str.replace(" is anything", ":null");
        // let [name, is, value] = str.split(' ')
        // str = name + ":null"
      }
      else if (str.includes('≥') || str.includes('≤')) {
      }
      else if (str.includes('[')) {
        str = str.replace(" is ", ":");
      }

      this.saveFilterValues.push(str);
    }
  }

  
  finalArray: any[] = [];
  finalObj: any[] = [];

  // save button
  SaveValue() {
    this.finalArray.splice(0);

    for (let val of this.saveFilterValues) {
      this.finalArray.push(val);
    }

    this.finalArray.push(this.locationMessage);

    for (let val of this.saveSearchValues) {
      this.finalArray.push(val);
    }
    
    this.finalObj.push(this.finalArray)
    console.log(this.finalObj)
    this.finalArray = []
    alert("Record Saved Successfully")
    let DataStore:any;
    DataStore = this.finalObj
    localStorage.setItem('Store',DataStore)
    

  }

  event!: Event;
  event1!: Event;
  event2!: Event;
  event3!: Event;
  event4!: Event;

  onChange(event: Event) {
    this.event = event;
    console.log(event)
  }

  onChange1(event: Event) {
    this.event1 = event;
    console.log(event)
  }

  onChange2(event: Event) {
    this.event2 = event;
    console.log(event)
  }

  onChange3(event: Event) {
    this.event3 = event;
    console.log(event)
  }

  onChange4(event: Event) {
    this.event4 = event;
    console.log(event)
  }

}


