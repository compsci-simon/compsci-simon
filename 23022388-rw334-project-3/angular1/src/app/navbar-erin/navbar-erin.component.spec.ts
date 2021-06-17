import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarErinComponent } from './navbar-erin.component';

describe('NavbarErinComponent', () => {
  let component: NavbarErinComponent;
  let fixture: ComponentFixture<NavbarErinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavbarErinComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarErinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
