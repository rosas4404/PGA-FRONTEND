import { TestBed } from '@angular/core/testing';

import { DocumentoExpedienteService } from './documento-expediente.service';

describe('DocumentoExpedienteService', () => {
  let service: DocumentoExpedienteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentoExpedienteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
