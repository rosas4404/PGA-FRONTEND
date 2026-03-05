import { TestBed } from '@angular/core/testing';

import { ActividadBaseService } from './actividad-base.service';

describe('ActividadBaseService', () => {
  let service: ActividadBaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActividadBaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
