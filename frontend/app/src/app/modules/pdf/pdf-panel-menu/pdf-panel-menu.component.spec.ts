import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfPanelMenuComponent } from './pdf-panel-menu.component';

describe('PdfPanelMenuComponent', () => {
  let component: PdfPanelMenuComponent;
  let fixture: ComponentFixture<PdfPanelMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PdfPanelMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfPanelMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
