import { TestBed } from '@angular/core/testing';

import { DetalleSemanalService } from './detalle-semanal.service';

describe('DetalleSemanalService', () => {
  let service: DetalleSemanalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetalleSemanalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
