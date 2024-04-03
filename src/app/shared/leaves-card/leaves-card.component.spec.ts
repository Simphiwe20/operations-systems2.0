import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeavesCardComponent } from './leaves-card.component';

describe('LeavesCardComponent', () => {
  let component: LeavesCardComponent;
  let fixture: ComponentFixture<LeavesCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeavesCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeavesCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
