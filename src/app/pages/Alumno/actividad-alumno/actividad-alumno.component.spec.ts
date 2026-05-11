import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActividadAlumnoComponent } from './actividad-alumno.component';

describe('ActividadAlumnoComponent', () => {
  let component: ActividadAlumnoComponent;
  let fixture: ComponentFixture<ActividadAlumnoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActividadAlumnoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActividadAlumnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
