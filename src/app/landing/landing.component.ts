import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ApiService } from "../api.service";
import { HttpResponse } from "@angular/common/http";
import { MatRadioChange, MatRadioButton } from "@angular/material/radio";
import { MatTableDataSource } from "@angular/material/table";
import { MatTooltipModule } from '@angular/material';
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { StorageService } from "../storage.service";
import { User } from '../dataModel/User';
import { Tray } from '../dataModel/Tray';
import { SearchCriteria } from '../dataModel/SearchCriteria';
import { LocalStorageService } from '../localstorage.service';

@Component({
  selector: "app-landing",
  templateUrl: "./landing.component.html",
  styleUrls: ["./landing.component.css"],
})

export class LandingComponent implements OnInit {
  @ViewChild("trayWidthField", { static: false }) trayWidthField: ElementRef;
  @ViewChild("trayLengthField", { static: false }) trayLengthField: ElementRef;
  @ViewChild("tileHeightField", { static: false }) tileHeightField: ElementRef;

  public showDrain = false;

  public disableProfilesChoice: boolean;
  private displayedColumns: any[] = [
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

  private sizeLabels = [
    {type: "P", width: "Lato corto", length: "Lato lungo" },
    {type: "L", width: "Lato canalina", length: "Altro lato" }
  ];
  public sizeLabel: any;

  public tray: Tray;
  private trays: Tray[];
  public dataSource: MatTableDataSource<Tray>;

  public trayTypeRadioButton: String;
  public trayTypeOptions = [
    { name: "drain", label: "Canalina" },
    { name: "point", label: "Puntuale" },
  ];
  public screedHeightRadioButton: String;
  public screedHeightOptions = [
    { name: "lessThan10", label: "Meno di 10cm" },
    { name: "greaterEqual10", label: "10 cm o più" },
  ];
  // private tileHeight = new FormControl();

  public searchCaption: String;
  public searchPerformed: boolean;
  public searchCriteria: SearchCriteria;

  public ipAddress: string;
  public userToken: string;

  constructor(private service: ApiService,
              private router: Router,
              private storage: StorageService,
              private localStorageService: LocalStorageService) 
  {
    if (this.storage.user.token == "")
    {
      this.storage.user.token = this.localStorageService.get("token");
      console.log("ngOnInit: token stored in memory is '" + this.storage.user.token + "'");
      this.service.getIpAddress()
                  .subscribe(
                    (res: any) => {
                      console.log("ngOnInit: got IP address '" + res.ip + ". Calling user search");
                      this.storage.session.ipAddress = res.ip;
                      this.startUserSession()
                    },
                    (error: any) => {
                      this.storage.session.ipAddress = "0.0.0.0";
                      this.startUserSession()
                  }); 
    }
  }

  ngOnInit() {
    if (this.storage.landingComponentData == null)
    {
      this.setDefaultValues();
    }
    else
    {
      this.searchCaption = "Ripeti";
      this.searchPerformed = true;
      this.searchCriteria = this.storage.landingComponentData.searchCriteria;

      // this.tileHeight.setValue(this.storage.landingComponentData.tileHeight.value);
  
      this.disableProfilesChoice = this.storage.landingComponentData.disableProfilesChoice;
      this.trayTypeRadioButton = this.storage.landingComponentData.trayTypeRadioButton;
      this.screedHeightRadioButton = this.storage.landingComponentData.screedHeightRadioButton;
      this.showDrain = this.storage.landingComponentData.showDrain;

      this.sizeLabel = this.storage.landingComponentData.sizeLabel;

      this.trays = this.storage.landingComponentData.trays;
      this.dataSource = new MatTableDataSource<Tray>(this.trays);
    }
  }

  setDefaultValues()
  {
    this.searchCaption = "Ricerca";
    this.searchPerformed = false;
    this.searchCriteria = new SearchCriteria();

    // this.tileHeight.setValue(0);
 
    this.disableProfilesChoice = true;
    this.showDrain = false;
    this.trayTypeRadioButton = "point";
    this.screedHeightRadioButton = "greaterEqual10";
    
    this.sizeLabel = this.sizeLabels.find(item => item.type == "P");

    this.dataSource = new MatTableDataSource<Tray>([]);
  }

  startUserSession()
  {
    // Check if user connected before
    if ((this.storage.user.token == null) || (this.storage.user.token == undefined))
    {
      this.storage.user.token = "";
    }
    console.log("startUserSession: token stored in memory '" + this.storage.user.token + "'");

    this.service
      .post("user/search",
            {
              user: this.storage.user,
              session: this.storage.session
            }
      )
      .subscribe((res: HttpResponse<any>) => {
        console.log("startUserSession: got user '" + res.body.user.idUser + "' from DB");
        this.storage.user = res.body.user;
        this.storage.session = res.body.session;
        this.localStorageService.set("token", this.storage.user.token);
        console.log("startUserSession: token set is '" + this.localStorageService.get("token") + "'");
      });
    }

  ngAfterViewInit() 
  {
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
          this.searchCriteria.trayType = "P";
          this.disableProfilesChoice = true;
          this.sizeLabel = this.sizeLabels.find(item => item.type == "P");
        } 
        else 
        {
          this.showDrain = true;
          this.searchCriteria.trayType = "L";
          this.disableProfilesChoice = false;
          this.sizeLabel = this.sizeLabels.find(item => item.type == "L");
        }
        break;

      case "screedHeigth":
        if (mrChange.value == "lessThan10")
        {      
          this.searchCriteria.screedThickness = 99;
        }
        else
        {
          this.searchCriteria.screedThickness = 200;
        }
        break;
    }
    console.log(this.searchCriteria.trayType + " " + this.searchCriteria.screedThickness);
  }

  onWidthChange() 
  {
    var wMinLowBound: number = 600;
    var wMinUpBound: number;

    if (this.searchCriteria.trayType == "P")
    {
       wMinUpBound = 2700;
    }
    else
    {
      wMinUpBound = 1800;
    }
    if (this.searchCriteria.wMin < wMinLowBound || this.searchCriteria.wMin > wMinUpBound) {
      alert(
        this.sizeLabel.width + " deve essere tra " + wMinLowBound + " e " + wMinUpBound + " cm\n" +
          "Per misure fuori limite chiamare ufficio tecnico wedi Italia"
      );
      this.searchCriteria.wMin  = 900;
      setTimeout(() => {
        this.trayWidthField.nativeElement.select();
        this.trayWidthField.nativeElement.focus();
      });
      return;
    }
  }

  onLengthChange() 
  {
    var lMinLowBound: number = 600;
    var lMinUpBound: number;
    if (this.searchCriteria.trayType == "P")
    {
      lMinUpBound = 2700;
    }
    else
    {
      lMinUpBound = 1800;
    }

    if (this.searchCriteria.lMin < lMinLowBound || this.searchCriteria.lMin > lMinUpBound) {
      alert(
        this.sizeLabel.length + " deve essere tra " + lMinLowBound + " e " + lMinUpBound + " cm\n" +
          "Per misure fuori limite chiamare ufficio tecnico wedi Italia"
      );
      this.searchCriteria.lMin  = 1400;
      setTimeout(() => {
        this.trayLengthField.nativeElement.select();
        this.trayLengthField.nativeElement.focus();
      });
      return;
    }
  }

  onTileThickChange() {
    var tileHeight: number;
    tileHeight = Number(this.searchCriteria.profiles.tileHeight);
    if (tileHeight < 5.5 || tileHeight > 10)
    {
      alert("Lo spessore del rivestimento deve essere tra 5.5 e 10mm. Non considerare la colla");
      this.searchCriteria.profiles.tileHeight = 10;
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
    var temp: number;

    this.searchCaption = "Ripeti";

    if ((this.searchCriteria.trayType == "P") && 
        (Number(this.searchCriteria.lMin) < Number(this.searchCriteria.wMin)))
    {
      temp = this.searchCriteria.lMin;
      this.searchCriteria.lMin = this.searchCriteria.wMin;
      this.searchCriteria.wMin = temp;
      this.onLengthChange();
      this.onWidthChange();
    }

    this.service
      .post("trays/search", {
        searchCriteria: this.searchCriteria,
        user: this.storage.user,
        session: this.storage.session
      })
      .subscribe((res: HttpResponse<any>) => {
        this.storage.user = res.body.user;
        this.trays = res.body.trays;
        this.dataSource = new MatTableDataSource<Tray>(this.trays);
        this.searchPerformed = true;
        this.storage.useExtension = res.body.useExtension;
        this.storage.useDoubleExtension = res.body.useDoubleExtension;
        console.log(this.trays);
        this.storage.searchCriteria = this.searchCriteria;
        this.storage.landingComponentData = this;
      });
  }

  doNew() 
  {
    this.storage.landingComponentData = null;
    this.setDefaultValues();
  }
}
