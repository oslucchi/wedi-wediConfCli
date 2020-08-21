import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProtectedInputComponent } from './protected-input.component';

describe('ProtectedInputComponent', () => {
  let component: ProtectedInputComponent;
  let fixture: ComponentFixture<ProtectedInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProtectedInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProtectedInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
