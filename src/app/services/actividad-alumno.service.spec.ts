import { TestBed } from '@angular/core/testing';

import { ActividadAlumnoService } from './actividad-alumno.service';

describe('ActividadAlumnoService', () => {
  let service: ActividadAlumnoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActividadAlumnoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
