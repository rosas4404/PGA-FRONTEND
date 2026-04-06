import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SesionGrupoComponent } from './sesion-grupo.component';

describe('SesionGrupoComponent', () => {
  let component: SesionGrupoComponent;
  let fixture: ComponentFixture<SesionGrupoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SesionGrupoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SesionGrupoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
