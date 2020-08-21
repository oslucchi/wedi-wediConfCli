import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrainComponent } from './drain.component';

describe('DrainComponent', () => {
  let component: DrainComponent;
  let fixture: ComponentFixture<DrainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
