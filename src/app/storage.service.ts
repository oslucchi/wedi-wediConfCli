import { Injectable } from '@angular/core';
import { environment } from "../environments/environment"
import { LandingComponent } from './landing/landing.component';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  public host: String;
  public baseURL: String;
  public baseHref: String;
  public tray: Trays;
  public useExtension: boolean;
  public useDoubleExtension: boolean;
  public profiles: {
      est: string;
      west: string;
      north: string;
      tileHeight: number;
  };
  public requestedSize: {
    requestedWidth : number,
    requestedLen : number
  };
  public landingComponentData: LandingComponent;

  public constructor() {
    this.host = environment.host;
    this.baseURL = environment.baseURL;
    this.baseHref = environment.baseHref;
  }
}
