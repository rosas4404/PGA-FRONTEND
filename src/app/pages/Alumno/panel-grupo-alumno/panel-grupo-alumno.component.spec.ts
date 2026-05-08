import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelGrupoAlumnoComponent } from './panel-grupo-alumno.component';

describe('PanelGrupoAlumnoComponent', () => {
  let component: PanelGrupoAlumnoComponent;
  let fixture: ComponentFixture<PanelGrupoAlumnoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelGrupoAlumnoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PanelGrupoAlumnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
