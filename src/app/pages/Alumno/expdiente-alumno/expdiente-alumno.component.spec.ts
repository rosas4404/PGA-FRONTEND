import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpdienteAlumnoComponent } from './expdiente-alumno.component';

describe('ExpdienteAlumnoComponent', () => {
  let component: ExpdienteAlumnoComponent;
  let fixture: ComponentFixture<ExpdienteAlumnoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpdienteAlumnoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExpdienteAlumnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
