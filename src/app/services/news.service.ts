import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Article } from '../models/news.model';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private apiKey = 'e442d816c2284f19a4eea4c36bbb7e4f';
  private apiUrl = 'https://newsapi.org/v2/everything';
  private sortBy: string = 'publishedAt';

  constructor(private http: HttpClient) {}

  getNews(category: string = 'all',pageSize:number,page:number,from?: string,to?: string,): Observable<{ status: string; totalResults: number; articles: Article[] }> {
    let url = `${this.apiUrl}?q=${category}&apiKey=${this.apiKey}&sortBy=${this.sortBy}&page=${page}&pageSize=${pageSize}`;
    if (from ) {
      url += `&from=${from}`;
    }
    if (to) {
      url += `&to=${to}`;
    }
    return this.http.get<{ status: string; totalResults: number; articles: Article[] }>(url);
  }
}
