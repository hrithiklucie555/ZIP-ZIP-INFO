import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortalSelection } from './portal-selection';

describe('PortalSelection', () => {
  let component: PortalSelection;
  let fixture: ComponentFixture<PortalSelection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortalSelection],
    }).compileComponents();

    fixture = TestBed.createComponent(PortalSelection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
