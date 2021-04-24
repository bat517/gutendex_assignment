import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoViewsComponent } from './no-views.component';

describe('NoViewsComponent', () => {
  let component: NoViewsComponent;
  let fixture: ComponentFixture<NoViewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoViewsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoViewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
