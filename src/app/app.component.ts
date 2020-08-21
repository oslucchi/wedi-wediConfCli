import { Component, Inject } from '@angular/core';
import { StorageService } from './storage.service';
import { DOCUMENT } from '@angular/common';
import { environment } from "../environments/environment";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public title: String;
  public imgPath: String;

  constructor(private storage: StorageService, 
              @Inject(DOCUMENT) private document)
  {
    this.imgPath = storage.baseHref + 'assets/img/logoWedi.png';
    this.title = 'wediConf';
  }

  ngOnInit(): void {
    let bases = this.document.getElementsByTagName('base');

    if (bases.length > 0) {
      bases[0].setAttribute('href', this.storage.baseHref);
    }
  }
}
