import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroundViewComponent } from './ground-view.component';

describe('GroundViewComponent', () => {
  let component: GroundViewComponent;
  let fixture: ComponentFixture<GroundViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroundViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroundViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
