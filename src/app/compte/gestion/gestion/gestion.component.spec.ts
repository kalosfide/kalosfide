import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GestionComponent } from './gestion.component';

describe('GestionComponent', () => {
  let component: GestionComponent;
  let fixture: ComponentFixture<GestionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
