import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  private heroesUrl = 'api/heroes';
  private httpOptions = {
    headers: new HttpHeaders(
      {
        'Content-Type': 'application/json'
      }
    )
  };

  constructor(private http: HttpClient, private messageService: MessageService) { }

  /**
   * Returns of all heroes via an HTTP GET request.
   */
  getHeroes(): Observable<Hero[]> {
    this.log('HeroService: fetched heroes');
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        tap(_ => this.log('fetched heroes')),
        catchError(this.handleError<Hero[]>('getHeroes', []))
      );
  }

  /**
   * Gets a hero by ID via an HTTP GET request. Returns a 404 if the hero is not
   * found.
   *
   * @param id
   *   The ID to look up a hero by.
   */
  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url)
      .pipe(
        tap(_ => this.log(`fetched hero id = ${id}`)),
        catchError(this.handleError<Hero>(`getHero id = ${id}`))
      );
  }

  /**
   * Gets a hero by ID via an HTTP GET request. Returns undefined if the hero is
   * not found.
   *
   * @param id
   *   The ID to look up a hero by.
   */
  getHeroNo404<Data>(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/?id=${id}`;
    return this.http.get<Hero[]>(url)
      .pipe(
        // returns a {0|1} element array
        map(heroes => heroes[0]),
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} hero id=${id}`);
        }),
        catchError(this.handleError<Hero>(`getHero id=${id}`))
      );
  }

  /**
   * Adds a new hero via an HTTP POST request.
   *
   * @param hero
   *   The new hero to add.
   */
  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions)
      .pipe(
        tap(newHero => this.log(`added hero with id = ${newHero.id}`)),
        catchError(this.handleError<Hero>('addHero'))
      );
  }

  /**
   * Updates the hero via an HTTP PUT request.
   *
   * @param hero
   *   The hero to update.
   */
  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions)
      .pipe(
        tap(_ => this.log(`updated hero id = ${hero.id}`)),
        catchError(this.handleError<any>('updateHero'))
      );
  }

  /**
   * Deletes the hero via an HTTP DELETE request.
   *
   * @param hero
   *   The hero to delete. It may be either a hero or an ID.
   */
  deleteHero(hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;
    return this.http.delete<Hero>(url, this.httpOptions)
      .pipe(
        tap(_ => this.log(`deleted hero id = ${id}`)),
        catchError(this.handleError<Hero>('deleteHero'))
      );
  }

  /**
   * Retrieves the heroes matching the search term.
   *
   * @param term
   *   The term used for searching heroes.
   */
  searchHeroes(term: string): Observable<Hero[]> {
    // No search term defined; return an empty array.
    if (!term.trim()) {
      return of([]);
    }

    const url = `${this.heroesUrl}/?name=${term}`;
    return this.http.get<Hero[]>(url)
      .pipe(
        tap(heroes => {
          const message = heroes.length
            ? `found heroes matching "${term}"`
            : `no heroes found for "${term}"`;
          this.log(message);
        }),
        catchError(this.handleError<Hero[]>('searchHeroes', []))
      )
  }

  /**
   * Handles HTTP operations that failed and lets the app continue gracefully.
   *
   * @param operation
   *   The name of the operation that failed.
   * @param result
   *   The optional value to return as the observable result.
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  private log(message: string) {
    this.messageService.add(message);
  }
}