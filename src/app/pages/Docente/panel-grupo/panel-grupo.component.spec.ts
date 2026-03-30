import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelGrupoComponent } from './panel-grupo.component';

describe('PanelGrupoComponent', () => {
  let component: PanelGrupoComponent;
  let fixture: ComponentFixture<PanelGrupoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelGrupoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PanelGrupoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
