import { Component, OnInit } from '@angular/core';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.scss']
})
export class HeroesComponent implements OnInit {
  heroes: Hero[];

  constructor(private heroService: HeroService) { }

  ngOnInit(): void {
    this.getHeroes();
  }

  getHeroes(): void {
    this.heroService
      .getHeroes()
      .subscribe(heroes => this.heroes = heroes);
  }

  add(name: string): void {
    const normalizedName = name.trim();
    if (!normalizedName) {
      return;
    }

    this.heroService.addHero({ name } as Hero)
      .subscribe(hero => this.heroes.push(hero));
  }

  delete(heroToDelete: Hero): void {
    this.heroes = this.heroes.filter(hero => hero !== heroToDelete);
    this.heroService
      .deleteHero(heroToDelete)
      .subscribe();
  }
}