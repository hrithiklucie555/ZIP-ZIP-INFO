import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageNewsletters } from './manage-newsletters';

describe('ManageNewsletters', () => {
  let component: ManageNewsletters;
  let fixture: ComponentFixture<ManageNewsletters>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageNewsletters],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageNewsletters);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
