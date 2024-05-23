import { Component, OnInit } from '@angular/core';
import { Article } from 'src/app/models/news.model';

@Component({
  selector: 'app-bookmarked-article',
  templateUrl: './bookmarked-article.component.html',
  styleUrls: ['./bookmarked-article.component.css']
})
export class BookmarkedArticleComponent implements OnInit {
  savedArticles: Article[] = [];

  constructor() { }

  ngOnInit(): void {
    this.loadSavedArticles();
  }

  loadSavedArticles(): void {
    const savedArticlesString = localStorage.getItem('savedArticles');
    if (savedArticlesString) {
      this.savedArticles = JSON.parse(savedArticlesString);
    }
  }

  removeSavedArticle(article: Article): void {
    const index = this.savedArticles.findIndex((a) => a.title === article.title);
    if (index !== -1) {
      this.savedArticles.splice(index, 1);
      localStorage.setItem('savedArticles', JSON.stringify(this.savedArticles));
    }
  }

  navigateToPage(url:string){
    window.open(url, '_blank');
  }
}
