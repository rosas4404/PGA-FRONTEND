import { TestBed } from '@angular/core/testing';

import { SeguimientoSemanalService } from './seguimiento-semanal.service';

describe('SeguimientoSemanalService', () => {
  let service: SeguimientoSemanalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeguimientoSemanalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
