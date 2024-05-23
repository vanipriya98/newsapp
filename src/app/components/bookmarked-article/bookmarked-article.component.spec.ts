import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookmarkedArticleComponent } from './bookmarked-article.component';

describe('BookmarkedArticleComponent', () => {
  let component: BookmarkedArticleComponent;
  let fixture: ComponentFixture<BookmarkedArticleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookmarkedArticleComponent]
    });
    fixture = TestBed.createComponent(BookmarkedArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
