import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaRevisonComponent } from './consulta-revision.component';

describe('ConsultaRevisonComponent', () => {
  let component: ConsultaRevisonComponent;
  let fixture: ComponentFixture<ConsultaRevisonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultaRevisonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConsultaRevisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
