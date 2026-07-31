import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadNewsletter } from './read-newsletter';

describe('ReadNewsletter', () => {
  let component: ReadNewsletter;
  let fixture: ComponentFixture<ReadNewsletter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReadNewsletter],
    }).compileComponents();

    fixture = TestBed.createComponent(ReadNewsletter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
