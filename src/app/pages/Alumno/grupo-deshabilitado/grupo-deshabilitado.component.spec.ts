import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrupoDeshabilitadoComponent } from './grupo-deshabilitado.component';

describe('GrupoDeshabilitadoComponent', () => {
  let component: GrupoDeshabilitadoComponent;
  let fixture: ComponentFixture<GrupoDeshabilitadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrupoDeshabilitadoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GrupoDeshabilitadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
