import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InicioGrupoHabilitadoComponent } from './inicio-grupo-habilitado.component';

describe('InicioGrupoHabilitadoComponent', () => {
  let component: InicioGrupoHabilitadoComponent;
  let fixture: ComponentFixture<InicioGrupoHabilitadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InicioGrupoHabilitadoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InicioGrupoHabilitadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
