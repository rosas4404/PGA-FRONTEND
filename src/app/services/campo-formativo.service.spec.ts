import { TestBed } from '@angular/core/testing';

import { CampoFormativoService } from './campo-formativo.service';

describe('CampoFormativoService', () => {
  let service: CampoFormativoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CampoFormativoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
