import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CesiumDirective } from './cesium.directive';
import { DBConfig, NgxIndexedDBModule } from 'ngx-indexed-db';
import { SearchComponent } from './Components/search/search.component';
import { ViewsComponent } from './Components/views/views.component';
import { FilterComponent } from './Components/filter/filter.component';
import { PanelsComponent } from './Components/panels/panels.component';
import { GroundViewComponent } from './Components/ground-view/ground-view.component';
import { SwitchPanelComponent } from './switch-panel/switch-panel.component';

const dbConfig: DBConfig  = {
  name: 'ImageCacheDB',
  version: 1,
  objectStoresMeta: [{
    store: 'imagery',
    storeConfig: { keyPath: 'id', autoIncrement: true },
    storeSchema: [
      { name: 'tileKey', keypath: 'tileKey', options: { unique: true } }
    ]
  }]
};

@NgModule({
  declarations: [
    AppComponent,
    CesiumDirective,
    SearchComponent,
    ViewsComponent,
    FilterComponent,
    PanelsComponent,
    GroundViewComponent,
    SwitchPanelComponent,
  
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    NgxIndexedDBModule.forRoot(dbConfig)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
