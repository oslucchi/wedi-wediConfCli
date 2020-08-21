import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PunctComponent } from './punct.component';

describe('PunctComponent', () => {
  let component: PunctComponent;
  let fixture: ComponentFixture<PunctComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PunctComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PunctComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
