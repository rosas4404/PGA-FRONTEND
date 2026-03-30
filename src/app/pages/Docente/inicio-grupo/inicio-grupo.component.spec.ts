import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InicioGrupoComponent } from './inicio-grupo.component';

describe('InicioGrupoComponent', () => {
  let component: InicioGrupoComponent;
  let fixture: ComponentFixture<InicioGrupoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InicioGrupoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InicioGrupoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
