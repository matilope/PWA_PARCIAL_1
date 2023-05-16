import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { WeatherService } from 'src/app/services/weather.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  public formSearch: FormGroup = new FormGroup({});
  public alertNotification: boolean = false;
  public local: any = this.localStorageService.getItem("history");
  public startIndex: number = 0;
  public endIndex: number = 3;
  public animation: boolean = false;
  @ViewChild('inputValue') inputValue!: ElementRef;

  constructor(
    private weatherService: WeatherService,
    private localStorageService: LocalStorageService,
    private dataService: DataService
  ) { }

  @HostListener('window:resize')
  onResize(): void {
    this.setIndexes();
    this.adjustIndexes();
  }

  ngOnInit(): void {
    console.log(process.env['APIKEYWEATHER']);
    this.setIndexes();
    this.formSearch = new FormGroup({
      search: new FormControl('', [
        Validators.required
      ])
    });
  }

  search(): void {
    const { search } = this.formSearch.value;
    this.weatherService.getWeather(search.trim()).subscribe({
      next: (response: any) => {
        this.inputValue.nativeElement.value = "";
        this.formSearch.get('search')?.setValue('');
        this.startIndex = 0;
        this.setIndexes();
        this.alertNotification = false;
        const local = this.localStorageService.getItem("history");
        this.dataService.setWeatherData(response);
        if (!local) {
          this.localStorageService.setItem("history", JSON.stringify([response]));
        } else {
          local.unshift(response);
          this.localStorageService.setItem("history", JSON.stringify(local));
          if (local.length > 6) {
            local.splice(6);
            this.localStorageService.setItem("history", JSON.stringify(local));
          }
        }
        this.local = this.localStorageService.getItem("history");
      },
      error: (error: any) => {
        this.alertNotification = true;
        console.log(error);
      },
      complete: () => {
        console.log("Se ha terminado la subscripción");
      }
    });
  }

  previous(): void {
    this.animation = true;
    if (this.startIndex > 0) {
      this.startIndex--;
      this.endIndex--;
    }
  }

  next(): void {
    this.animation = true;
    if (this.endIndex < 6) {
      this.startIndex++;
      this.endIndex++;
    }
  }

  setIndexes(): void {
    if (window.innerWidth >= 768) {
      this.endIndex = this.startIndex + 3;
    }
    if (window.innerWidth <= 767) {
      this.endIndex = this.startIndex + 2;
    }
    if (window.innerWidth <= 520) {
      this.endIndex = this.startIndex + 1;
    }
  }

  adjustIndexes(): void {
    const totalItems = this.local?.length;
    if (totalItems && this.endIndex > totalItems) {
      this.startIndex = totalItems - (this.endIndex - this.startIndex);
    }
    if (this.endIndex < 0 || this.startIndex < 0) {
      this.startIndex = 0;
      this.endIndex = 3;
    }
  }
}
