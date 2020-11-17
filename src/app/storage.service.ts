import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { SearchCriteria } from './dataModel/SearchCriteria';
import { Tray } from './dataModel/Tray';
import { User } from './dataModel/User';
import { Session } from './dataModel/Session';
import { LandingComponent } from "./landing/landing.component";

@Injectable({
  providedIn: "root",
})
export class StorageService {
  // Backend address
  public host: String;
  public baseURL: String;
  public baseHref: String;

  // search criteria used
  public searchCriteria = new SearchCriteria();

  // user and session data
  public user: User;
  public session: Session;

  public tray: Tray;
  public useExtension: boolean;
  public useDoubleExtension: boolean;

  public landingComponentData: LandingComponent;

  // public profiles: {
  //   est: "floor", 
  //   west: "wall", 
  //   north:"wall", 
  //   tileHeight: 0
  // };
  // public requestedSize: {
  //   requestedWidth: number;
  //   requestedLen: number;
  // };
  // public screedHeight: number;


  public constructor() {
    this.host = environment.host;
    this.baseURL = environment.baseURL;
    this.baseHref = environment.baseHref;
    this.session = new Session();
    this.user = new User();
    this.landingComponentData = null;

  }
}
