import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StackItemComponent } from './stack-item.component';

describe('StackItemComponent', () => {
  let component: StackItemComponent;
  let fixture: ComponentFixture<StackItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StackItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StackItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
