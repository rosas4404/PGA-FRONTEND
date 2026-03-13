import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampoFormativoComponent } from './campo-formativo.component';

describe('CampoFormativoComponent', () => {
  let component: CampoFormativoComponent;
  let fixture: ComponentFixture<CampoFormativoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CampoFormativoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CampoFormativoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
