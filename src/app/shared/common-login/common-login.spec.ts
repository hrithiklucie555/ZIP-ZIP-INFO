import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonLogin } from './common-login';

describe('CommonLogin', () => {
  let component: CommonLogin;
  let fixture: ComponentFixture<CommonLogin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonLogin],
    }).compileComponents();

    fixture = TestBed.createComponent(CommonLogin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
