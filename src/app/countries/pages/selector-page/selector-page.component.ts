import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountriesService } from '../../services/countries.service';
import { Region, SmallCountry } from '../../interfaces/country.interface';
import { filter, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [],
})
export class SelectorPageComponent implements OnInit {
  public countriesRegion: SmallCountry[] = [];
  public borders: SmallCountry[]=[];
  // ESTRUCTURA DEL FORM CON VALIDACIONES
  public myForm: FormGroup = this.fb.group({
    region: ['', Validators.required],
    country: ['', Validators.required],
    border: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private countriesService: CountriesService
  ) {}
  // OBTENER LOS VALORES DE LAS REGIONES DEL SERVICIO
  get regions(): Region[] {
    return this.countriesService.regions;
  }

  ngOnInit(): void {
    this.regionChanged();
    this.countryChanged();
  }

  regionChanged(): void {
    this.myForm
      .get('region')!
      .valueChanges.pipe(
        tap(() => this.myForm.get('country')!.setValue('')),
        tap(() => this.borders =[]),
        switchMap((region) => this.countriesService.countByRegion(region))
        // switchMap(this.countriesService.countByRegion)  TAMBIEN SIRVE IGUAL
      )
      .subscribe((countries) => {
        this.countriesRegion = countries;
      });
  }
  countryChanged(): void {
    this.myForm
      .get('country')!
      .valueChanges.pipe(
        tap(() => this.myForm.get('border')!.setValue('')),
        filter( (value: string) => value.length>0 ),
        switchMap((alphaCode) => this.countriesService.coutnByAlpha(alphaCode)),
        switchMap(country => this.countriesService.countBordersByCodes(country.borders))
        // switchMap(this.countriesService.countByRegion)  TAMBIEN SIRVE IGUAL
      )
      .subscribe(countries => {
        this.borders = countries
      });
  }
}
