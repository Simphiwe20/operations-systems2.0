import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestCardsComponent } from './request-cards.component';

describe('RequestCardsComponent', () => {
  let component: RequestCardsComponent;
  let fixture: ComponentFixture<RequestCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestCardsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
