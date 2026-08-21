import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewsletter } from './create-newsletter';

describe('CreateNewsletter', () => {
  let component: CreateNewsletter;
  let fixture: ComponentFixture<CreateNewsletter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateNewsletter],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateNewsletter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
