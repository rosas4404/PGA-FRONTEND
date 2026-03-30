import { TestBed } from '@angular/core/testing';

import { ActividadGrupoService } from './actividad-grupo.service';

describe('ActividadGrupoService', () => {
  let service: ActividadGrupoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActividadGrupoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
