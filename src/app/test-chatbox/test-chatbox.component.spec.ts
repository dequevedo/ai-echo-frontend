import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestChatboxComponent } from './test-chatbox.component';

describe('TestChatboxComponent', () => {
  let component: TestChatboxComponent;
  let fixture: ComponentFixture<TestChatboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestChatboxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestChatboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
