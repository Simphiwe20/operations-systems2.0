import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuesthouseFormComponent } from './guesthouse-form.component';

describe('GuesthouseFormComponent', () => {
  let component: GuesthouseFormComponent;
  let fixture: ComponentFixture<GuesthouseFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuesthouseFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuesthouseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
