import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Article } from '../models/news.model';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private apiKey = 'd8fbfd70505d41d2a91eea908a10ced2';
  private apiUrl = 'https://newsapi.org/v2/everything';
  private sortBy: string = 'publishedAt';

  constructor(private http: HttpClient) {}

  getNews(category: string = 'all',from?: string,to?: string): Observable<{ status: string; totalResults: number; articles: Article[] }> {
    let url = `${this.apiUrl}?q=${category}&apiKey=${this.apiKey}&sortBy=${this.sortBy}`;
    if (from ) {
      url += `&from=${from}`;
    }
    if (to) {
      url += `&to=${to}`;
    }
    return this.http.get<{ status: string; totalResults: number; articles: Article[] }>(url);
  }
}
