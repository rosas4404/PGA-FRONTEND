import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InicioGruposDeshaComponent } from './inicio-grupos-desha.component';

describe('InicioGruposDeshaComponent', () => {
  let component: InicioGruposDeshaComponent;
  let fixture: ComponentFixture<InicioGruposDeshaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InicioGruposDeshaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InicioGruposDeshaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
