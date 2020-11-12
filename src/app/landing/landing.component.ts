import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ApiService } from "../api.service";
import { HttpResponse } from "@angular/common/http";
import { MatRadioChange, MatRadioButton } from "@angular/material/radio";
import { MatTableDataSource } from "@angular/material/table";
import { MatTooltipModule } from '@angular/material';
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { StorageService } from "../storage.service";
import { CookieService } from 'ngx-cookie-service';
import { User } from '../dataModel/User';
import { Tray } from '../dataModel/Tray';
import { SearchCriteria } from '../dataModel/SearchCriteria';

@Component({
  selector: "app-landing",
  templateUrl: "./landing.component.html",
  styleUrls: ["./landing.component.css"],
})

export class LandingComponent implements OnInit {
  @ViewChild("matWidthField", { static: false }) matWidthField: ElementRef;
  @ViewChild("matLengthField", { static: false }) matLengthField: ElementRef;
  @ViewChild("tileHeightField", { static: false }) tileHeightField: ElementRef;

  inputWidth: number;
  inputLength: number;
  trayWidth: number;
  trayLength: number;
  scaleFactor: number;

  showDrain = false;
  profiles = new Map([
    ["North", "wall"],
    ["West", "wall"],
    ["Est", "floor"],
    ["South", "floor"],
  ]);

  disableProfilesChoice: boolean;
  trayType: string;
  thickness: number;
  displayedColumns: any[] = [
    { def: "articleNumber", hide: false },
    { def: "description", hide: false },
    { def: "trayType", hide: true },
    { def: "drainType", hide: true },
    { def: "size", hide: false },
    { def: "width", hide: true },
    { def: "length", hide: true },
    { def: "thickness", hide: true },
    { def: "price", hide: false },
  ];
  matWidth = new FormControl();
  matLength = new FormControl();
  tileHeight = new FormControl();

  public tray: Tray;

  private trays: Tray[];
  radioTipoPiattoStatus: string;
  dataSource: MatTableDataSource<Tray>;

  public profilesNorth: string;
  public profilesEst: string;
  public profilesWest: string;
  public profilesSouth: string;
  public trayTypeRadioButton: String;
  public trayTypeOptions = [
    { name: "drain", label: "Canalina" },
    { name: "point", label: "Puntuale" },
  ];
  public screedHeightRadioButton: String;
  public searchCaption: String;
  public searchPerformed: boolean;

  public screedHeightOptions = [
    { name: "lessThan10", label: "Meno di 10cm" },
    { name: "greaterEqual10", label: "10 cm o più" },
  ];

  public searchCriteria = {
    trayType: " ",
    thickness: 0,
    WMin: 0,
    LMin: 0
  };

  public userToken: string;

  constructor(private service: ApiService,
              private router: Router,
              private storage: StorageService,
              private cookieServ: CookieService) 
  {
    this.inputWidth = 90;
    this.inputLength = 140;
    this.matWidth.setValue(90);
    this.matLength.setValue(140);
    this.scaleFactor = 1.0;

    this.trayType = "P";
    this.thickness = 200;
    this.disableProfilesChoice = true;

    this.searchPerformed = false;
    this.trayTypeRadioButton = "point";
    this.screedHeightRadioButton = "greaterEqual10";
    this.searchCaption = "Ricerca";
  }

  ngOnInit() {
    // Check if user connected before
    this.userToken = this.cookieServ.get('token');
    if ((this.userToken == null) || (this.userToken == ""))
    {
      this.userToken = "dummy";
    }
    this.storage.user.token = this.userToken;
    this.service
      .post("user/search",
            {
              user: this.storage.user,
              session: this.storage.session
            }
      )
      .subscribe((res: HttpResponse<any>) => {
        this.storage.user = res.body.user;
        this.storage.session = res.body.session;
        this.cookieServ.set("token", this.storage.user.token);
      });
    this.trayWidth = this.inputWidth * 2;
    this.trayLength = this.inputLength * 2;
    this.profilesNorth = "wall";
    this.profilesWest = "wall";
    this.profilesEst = "floor";
    this.storage.searchCriteria = new SearchCriteria();
  }

  ngAfterViewInit() {
    if (this.storage.landingComponentData != null)
    {
      this.searchCaption = "Ripeti";
      this.searchPerformed = true;
      this.inputWidth = this.storage.landingComponentData.inputWidth;
      this.inputLength = this.storage.landingComponentData.inputLength;
      this.matLength.setValue(this.inputLength);
      this.matWidth.setValue(this.inputWidth);
      this.trayWidth = this.storage.landingComponentData.trayWidth;
      this.trayLength = this.storage.landingComponentData.trayLength;
      this.trayType = this.storage.landingComponentData.trayType;
      this.scaleFactor = this.storage.landingComponentData.scaleFactor;
      this.tileHeight = this.storage.landingComponentData.tileHeight;
      this.disableProfilesChoice = this.storage.landingComponentData.disableProfilesChoice;
      this.trayTypeRadioButton = this.storage.landingComponentData.trayTypeRadioButton;
      this.screedHeightRadioButton = this.storage.landingComponentData.screedHeightRadioButton;
      this.thickness = this.storage.landingComponentData.thickness;

      this.profilesNorth = this.storage.landingComponentData.profilesNorth;
      this.profilesWest = this.storage.landingComponentData.profilesWest;
      this.profilesEst = this.storage.landingComponentData.profilesEst;

      this.trays = this.storage.landingComponentData.trays;
      this.dataSource = new MatTableDataSource<Tray>(this.trays);
    }
  }

  getDisplayedColumns(): string[] {
    return this.displayedColumns.filter((cd) => !cd.hide).map((cd) => cd.def);
  }

  setShowdrain(showDrain: boolean) {
    this.showDrain = showDrain;
  }

  onChange(mrChange: MatRadioChange) {
    let mrButton: MatRadioButton = mrChange.source;
    switch (mrButton.name) {
      case "trayType":
        if (mrChange.value == "point") 
        {
          this.showDrain = false;
          this.trayType = "P";
          this.disableProfilesChoice = true;
        } 
        else 
        {
          this.showDrain = true;
          this.trayType = "L";
          this.disableProfilesChoice = false;
        }
        break;

      case "screedHeigth":
        if (mrChange.value == "lessThan10")
        {      
          this.thickness = 99;
        }
        else
        {
          this.thickness = 200;
        }
        break;
    }
    console.log(this.trayType + " " + this.thickness);
  }

  evaluateScaleFactor()
  {
    var scaleFactorW: number;
    var scaleFactorL: number;
    if ((this.inputWidth = this.matWidth.value) > 90)
    {
      scaleFactorW = this.matWidth.value / 90;
    }
    else
    {
      scaleFactorW = 1.0;
    }

    if ((this.inputLength = this.matLength.value) > 140)
    {
      scaleFactorL = this.matLength.value / 140;
    }
    else 
    {
      scaleFactorL = 1.0;
    }

    this.scaleFactor = (scaleFactorL > scaleFactorW ? scaleFactorL : scaleFactorW);
    this.trayWidth = (this.matWidth.value * 2) / this.scaleFactor;
    this.trayLength = (this.matLength.value * 2) / this.scaleFactor;
  }

  onWidthChange() {
    if (this.matWidth.value < 60 || this.matWidth.value > 180) {
      alert(
        "Il lato del piatto dove sta la canalina deve essere tra 60 e 180 cm\n" +
          "Per misure superiori chiamare ufficio tecnico wedi Italia"
      );
      this.matWidth.setValue(90);
      setTimeout(() => {
        this.matWidthField.nativeElement.select();
        this.matWidthField.nativeElement.focus();
      });
      return;
    }
    this.evaluateScaleFactor();
  }

  onLengthChange() {
    if (this.matLength.value < 60 || this.matLength.value > 200) {
      alert(
        "Il lato del piatto dove sta la canalina deve essere tra 70 e 200 cm\n" +
          "Per misure superiori chiamare ufficio tecnico wedi Italia"
      );
      this.matLength.setValue(140);
      setTimeout(() => {
        this.matLengthField.nativeElement.select();
        this.matLengthField.nativeElement.focus();
      });
      return;
    }
    this.evaluateScaleFactor();
  }

  onTileThickChange() {
    var tileHeight: number;
    tileHeight = Number(this.tileHeight.value);
    if (tileHeight < 5.5 || tileHeight > 10)
    {
      alert("Lo spessore del rivestimento deve essere tra 5.5 e 10mm. Non considerare la colla");
      this.tileHeight.setValue(10);
      setTimeout(() => {
        this.tileHeightField.nativeElement.select();
        this.tileHeightField.nativeElement.focus();
      });
      return;
    }
  }

  openArticle(tray: Tray) {
    this.tray = tray;
    this.storage.tray = tray;

    console.log("calling router to navigate on " + this.tray.articleNumber);
    this.router.navigate(["details"]);
  }

  doSearch() {
    var temp: FormControl;

    this.searchCaption = "Ripeti";

    if ((this.trayType == "P") && 
        (Number(this.matLength.value) < Number(this.matWidth.value)))
    {
      temp = this.matLength;
      this.matLength = this.matWidth;
      this.matWidth = temp;
      this.onLengthChange();
      this.onWidthChange();
    }
    this.storage.searchCriteria.trayType = this.trayType;
    this.storage.searchCriteria.screedThickness = this.thickness;
    this.storage.searchCriteria.lMin = this.inputLength * 10;
    this.storage.searchCriteria.wMin = this.inputWidth * 10;
    this.storage.searchCriteria.profiles.tileHeight = this.tileHeight.value;
    this.storage.searchCriteria.profiles.est = this.profilesEst;
    this.storage.searchCriteria.profiles.west = this.profilesWest;
    this.storage.searchCriteria.profiles.north = this.profilesNorth;

    this.service
      .post("trays/search", {
        searchCriteria: this.storage.searchCriteria,
        user: this.storage.user,
        session: this.storage.session
      })
      .subscribe((res: HttpResponse<any>) => {
        if (res.body.trays.length == 0)
        {
          alert("Nessun piatto soddisfa i requisiti richiesti. Cambiarli se possibile o chiamare\n" +
                "il supporto tecnico di wedi per eventuali altre soluzioni");
        }
        this.storage.user = res.body.user;
        this.cookieServ.set("token", this.storage.user.token);
        this.trays = res.body.trays;
        this.dataSource = new MatTableDataSource<Tray>(this.trays);
        this.storage.landingComponentData = this;
        this.searchPerformed = true;
        this.storage.useExtension = res.body.useExtension;
        this.storage.useDoubleExtension = res.body.useDoubleExtension;
        console.log(this.trays);
      });
  }

  doNew() {
    this.searchCaption = "Ricerca";
    this.searchPerformed = false;
    this.inputWidth = 90;
    this.inputLength = 140;
    this.matWidth.setValue(90);
    this.matLength.setValue(140);
    this.trayType = "P";
    this.thickness = 200;
    this.disableProfilesChoice = true;
    this.storage.landingComponentData = null;
    this.dataSource = null;
    this.trayTypeRadioButton = "point";
    this.screedHeightRadioButton = "greaterEqual10";
  }
}
