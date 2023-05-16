import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit, OnDestroy {
  public data: any = this.localStorageService.getItem('history')?.[0];
  public url!: SafeUrl;
  public dataSubscription!: Subscription;

  constructor(private dataService: DataService, private localStorageService: LocalStorageService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.dataSubscription = this.dataService.getWeatherData().subscribe({
      next: (response: any) => {
        this.data = response;
        this.url = this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.google.com/maps/embed/v1/place?key=${process.env['APIKEYGOOGLE']}&q=${this.data.name}&center=${this.data.coord.lat}, ${this.data.coord.lon}`);
      }
    });
  }

  ngOnDestroy(): void {
    this.dataSubscription.unsubscribe();
  }

}
