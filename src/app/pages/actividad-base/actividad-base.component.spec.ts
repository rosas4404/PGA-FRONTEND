import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActividadBaseComponent } from './actividad-base.component';

describe('ActividadBaseComponent', () => {
  let component: ActividadBaseComponent;
  let fixture: ComponentFixture<ActividadBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActividadBaseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActividadBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
