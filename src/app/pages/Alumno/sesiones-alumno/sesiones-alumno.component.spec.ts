import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SesionesAlumnoComponent } from './sesiones-alumno.component';

describe('SesionesAlumnoComponent', () => {
  let component: SesionesAlumnoComponent;
  let fixture: ComponentFixture<SesionesAlumnoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SesionesAlumnoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SesionesAlumnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
