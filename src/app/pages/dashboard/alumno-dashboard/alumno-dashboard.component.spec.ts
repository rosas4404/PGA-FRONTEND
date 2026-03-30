import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlumnoDashboardComponent } from './alumno-dashboard.component';

describe('AlumnoDashboardComponent', () => {
  let component: AlumnoDashboardComponent;
  let fixture: ComponentFixture<AlumnoDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlumnoDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AlumnoDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
