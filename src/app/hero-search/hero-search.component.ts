import { Component, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.scss']
})
export class HeroSearchComponent implements OnInit {
  private searchTerms = new Subject<string>();

  heroes$: Observable<Hero[]>;

  constructor(private heroService: HeroService) { }

  ngOnInit(): void {
    this.heroes$ = this.searchTerms
      .pipe(
        // Wait 300ms after each keystroke before considering the term
        debounceTime(300),
        // Ignore new term if same as previous term
        distinctUntilChanged(),
        // Switch to new search observable each time the term changes
        switchMap(term => this.heroService.searchHeroes(term))
      );
  }

  /**
   * Adds the search term to the
   *
   * @param term
   *   The term used for searching.
   */
  search(term: string): void {
    this.searchTerms.next(term);
  }
}