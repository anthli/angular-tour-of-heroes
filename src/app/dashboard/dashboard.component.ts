import { Component, OnInit } from '@angular/core';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  heroes: Hero[] = [];

  constructor(private heroService: HeroService) { }

  ngOnInit(): void {
    this.getHeroes();
  }

  /**
   * Retrieves and sets the first 5 heroes.
   */
  getHeroes(): void {
    this.heroService
      .getHeroes()
      .subscribe(heroes => this.heroes = heroes.slice(0, 4));
  }
}