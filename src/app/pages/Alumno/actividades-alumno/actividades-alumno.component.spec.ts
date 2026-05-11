import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActividadesAlumnoComponent } from './actividades-alumno.component';

describe('ActividadesAlumnoComponent', () => {
  let component: ActividadesAlumnoComponent;
  let fixture: ComponentFixture<ActividadesAlumnoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActividadesAlumnoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActividadesAlumnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
