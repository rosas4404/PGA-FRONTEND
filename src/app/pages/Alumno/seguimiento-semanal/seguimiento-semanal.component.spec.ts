import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguimientoSemanalComponent } from './seguimiento-semanal.component';

describe('SeguimientoSemanalComponent', () => {
  let component: SeguimientoSemanalComponent;
  let fixture: ComponentFixture<SeguimientoSemanalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeguimientoSemanalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SeguimientoSemanalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
