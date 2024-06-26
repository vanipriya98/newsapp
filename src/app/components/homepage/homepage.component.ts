import { Component, OnInit, OnDestroy } from '@angular/core';
import { NewsService } from 'src/app/services/news.service';
import { Article } from 'src/app/models/news.model';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
})
export class HomepageComponent implements OnInit, OnDestroy {
  articles: Article[] = [];
  filteredArticles: Article[] = [];
  searchTerm: string = '';
  selectedCategory: string = '';
  fromDate: Date | null = null;
  toDate: Date | null = null;
  savedArticles: Article[] = [];
  maxDate: Date = new Date();
  page: number = 1;
  pageSize: number = 20;
  totalPages: number = 1000;
  private refreshSubscription: Subscription | undefined;

  constructor(private newsService: NewsService) {}

  ngOnInit(): void {
    this.loadSavedArticles();

    this.fetchNews('all');

    this.refreshSubscription = interval(300000).subscribe(() => {
      this.fetchNews(this.selectedCategory);
      console.log('Page Refresh after 5 mins ');
    });
  }

  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  fetchNews(category: string): void {
    const fromDateStr = this.fromDate
      ? this.fromDate.toISOString().split('T')[0]
      : undefined;
    const toDateStr = this.toDate
      ? this.toDate.toISOString().split('T')[0]
      : undefined;
    const categoryToFetch = category !== '' ? category : 'all';

    this.newsService
      .getNews(
        categoryToFetch,
        this.pageSize,
        this.page,
        fromDateStr,
        toDateStr
      )
      .subscribe(
        (response) => {
          if (this.page === 1) {
            this.articles = [];
          }
          this.articles.push(
            ...response.articles
              .filter((article) => article.source.name !== '[Removed]')
              .filter((article) => article.urlToImage !== null)
          );
          this.searchArticles();
          this.totalPages = Math.ceil(response.totalResults / this.pageSize);
        },
        (error) => {
          console.error('Error fetching news:', error);
        }
      );
  }

  onCategoryChange(event: Event): void {
    this.selectedCategory = (event.target as HTMLSelectElement).value;
    this.page = 1;
    this.fetchNews(this.selectedCategory);
  }

  searchArticles(): void {
    if (!this.searchTerm.trim()) {
      this.filteredArticles = this.articles.slice();
    } else {
      this.filteredArticles = this.articles.filter(
        (article) =>
          article.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          (article.author &&
            article.author
              .toLowerCase()
              .includes(this.searchTerm.toLowerCase())) ||
          (article.description &&
            article.description
              .toLowerCase()
              .includes(this.searchTerm.toLowerCase()))
      );
    }
  }

  shareArticle(article: Article): void {
    const url = article.url;
    const title = article.title;
    const text = article.description || '';

    if (navigator.share) {
      navigator
        .share({
          title: title,
          text: text,
          url: url,
        })
        .then(() => {
          console.log('Thanks for sharing!');
        })
        .catch((err) => {
          console.log('Error while sharing: ', err);
        });
    } else {
      this.openSocialMediaShare(article);
    }
  }

  openSocialMediaShare(article: Article): void {
    const url = encodeURIComponent(article.url);
    const text = encodeURIComponent(article.title);

    const twitterUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    const linkedinUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${text}`;

    console.log('Sharing article:', article);
    window.open(twitterUrl, '_blank');
    window.open(facebookUrl, '_blank');
    window.open(linkedinUrl, '_blank');
  }

  toggleBookmark(article: Article): void {
    if (this.isBookmarked(article)) {
      this.removeBookmark(article);
    } else {
      this.saveBookmark(article);
    }
  }

  saveBookmark(article: Article): void {
    this.savedArticles.push(article);
    localStorage.setItem('savedArticles', JSON.stringify(this.savedArticles));
  }

  removeBookmark(article: Article): void {
    this.savedArticles = this.savedArticles.filter(
      (a) => a.title !== article.title
    );
    localStorage.setItem('savedArticles', JSON.stringify(this.savedArticles));
  }

  loadSavedArticles(): void {
    const savedArticlesString = localStorage.getItem('savedArticles');
    if (savedArticlesString) {
      this.savedArticles = JSON.parse(savedArticlesString);
    }
  }

  isBookmarked(article: Article): boolean {
    return this.savedArticles.some((a) => a.title === article.title);
  }

  checkDates(): void {
    if (this.fromDate && this.toDate) {
      if (this.fromDate > this.maxDate) {
        this.fromDate = null;
        alert(`The start date cannot be greater than Today's Date.`);
        return;
      }
      if (this.toDate > this.maxDate) {
        this.toDate = null;
        alert(`The end date cannot be greater than Today's Date.`);
        return;
      }
      this.page = 1;
      this.fetchNews(this.selectedCategory);
    }
  }

  navigateToPage(url: string) {
    window.open(url, '_blank');
  }

  onScroll() {
    if (this.page <= this.totalPages) {
      this.page = this.page + 1;
      this.fetchNews(this.selectedCategory);
    }
  }
}
