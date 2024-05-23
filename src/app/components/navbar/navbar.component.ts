import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  @Input() searchTerm: string = '';
  @Input() selectedCategory: string = '';
  @Output() searchTermChange = new EventEmitter<string>();
  @Output() selectedCategoryChange = new EventEmitter<string>();

  constructor(private router: Router) {}

  categories = [
    { value: 'business', viewValue: 'Business' },
    { value: 'health', viewValue: 'Health' },
    { value: 'technology', viewValue: 'Technology' },
    { value: 'sports', viewValue: 'Sports' },
    { value: 'entertainment', viewValue: 'Entertainment' },
    { value: 'general', viewValue: 'general' },
    { value: 'science', viewValue: 'science' },
    
  ];

  searchArticles(): void {
    this.searchTermChange.emit(this.searchTerm);
  }

  onCategoryChange(category: string) {
    console.log('Selected category:', category);
    this.selectedCategoryChange.emit(this.selectedCategory);
  }

  isHomePage(): boolean {
    return this.router.url === '/home';
  }

  isSavedArticlesPage(): boolean {
    return this.router.url === '/saved-articles';
  }
}
