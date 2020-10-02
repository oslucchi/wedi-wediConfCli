import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ApiService } from '../api.service';
import { HttpResponse } from '@angular/common/http';
import { MatRadioChange, MatRadioButton } from '@angular/material/radio';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StorageService } from '../storage.service';

@Component({
  selector: "app-landing",
  templateUrl: "./landing.component.html",
  styleUrls: ["./landing.component.css"]
})


export class LandingComponent implements OnInit {
  @ViewChild('matWidthField', { static: false }) matWidthField: ElementRef;
  @ViewChild('matLengthField', {static: false}) matLengthField: ElementRef;
  @ViewChild('tileHeightField', {static: false}) tileHeightField: ElementRef;

  inputWidth: number;
  inputLength: number;
  trayWidth: number;
  trayLength: number;
  scaleFactor: number;

  showDrain = false;
  profiles = new Map([
      ['North', 'wall'], 
      ['West', 'wall'], 
      ['Est', 'floor'], 
      ['South', 'floor']
  ]);
  disableProfilesChoice: boolean;
  trayType: string;
  thickness: number;
  displayedColumns: any[] = [
      { def: 'articleNumber', hide: false }, 
      { def: 'description',  hide: false }, 
      { def: 'trayType', hide: true }, 
      { def: 'drainType', hide: true }, 
      { def: 'size',  hide: false }, 
      { def: 'width', hide: true },
      { def: 'length', hide: true },
      { def: 'thickness', hide: true},
      { def: 'price', hide: false}
     ];
  matWidth = new FormControl();
  matLength = new FormControl();
  tileHeight = new FormControl();

  public tray: Trays;

  private service: ApiService;
  private trays: Trays[];
  radioTipoPiattoStatus: string;
  dataSource: MatTableDataSource<Trays>;

  private router: Router;

  public profilesNorth: string;
  public profilesEst: string;
  public profilesWest: string;
  public profilesSouth: string;
  public trayTypeRadioButton: String;
  public trayTypeOptions = [
    {"name": "drain", "label": "Canalina"},
    {"name": "point", "label": "4 Pendenze"}
  ];
  public screedHeightRadioButton: String;
  public searchCaption: String;
  public searchPerformed: boolean;

  public screedHeightOptions = [
    {"name": "lessThan7", "label": "Fino a 7cm"},
    {"name": "7to10", "label": "Tra 7 e 10 cm"},
    {"name": "moreThan10", "label": "Oltre 10 cm"}
  ];

  constructor(private apiService: ApiService, private routerInstance: Router,
              private storage: StorageService)
  {
    this.inputWidth = 90;
    this.inputLength = 120;
    this.matLength.setValue(120);
    this.matWidth.setValue(90);
    this.scaleFactor = 1.0;

    this.service = apiService;
    this.trayType = 'P';
    this.thickness = 139;
    this.disableProfilesChoice = true;

    this.router = routerInstance;
    this.searchPerformed = false;
    this.trayTypeRadioButton = "point";
    this.screedHeightRadioButton = "moreThan10";
    this.searchCaption = "Ricerca";
  }

  ngOnInit() {
    this.trayWidth = this.inputWidth * 2;
    this.trayLength = this.inputLength * 2;
    this.profilesNorth = "wall";
    this.profilesWest = "wall";
    this.profilesEst = "floor";
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
      this.trayType = this.storage.landingComponentData.trayType;
      this.tileHeight = this.storage.landingComponentData.tileHeight;
      this.disableProfilesChoice = this.storage.landingComponentData.disableProfilesChoice;
      this.trayTypeRadioButton = this.storage.landingComponentData.trayTypeRadioButton;
      this.screedHeightRadioButton = this.storage.landingComponentData.screedHeightRadioButton;

      this.profilesNorth = this.storage.landingComponentData.profilesNorth
      this.profilesWest = this.storage.landingComponentData.profilesWest
      this.profilesEst = this.storage.landingComponentData.profilesEst;

      this.trays = this.storage.landingComponentData.trays;
      this.dataSource = new MatTableDataSource<Trays>(this.trays);
      this.storage.landingComponentData = null;
    }
  }

    

  getDisplayedColumns():string[] 
  {
    return this.displayedColumns.filter(cd=>!cd.hide).map(cd=>cd.def);
  }
  
  // setTrayWidth(width: number) {
  //   this.trayWidth = width * 2 * this.scaleFactor;
  // }
  // setTrayLength(length: number) {
  //   this.trayLength = length * 2 *  this.scaleFactor;
  // }

  setShowdrain(showDrain: boolean) {
    this.showDrain = showDrain;
  }
  
  onChange(mrChange: MatRadioChange) {
    let mrButton: MatRadioButton = mrChange.source;
    switch(mrButton.name)
    {
    case "trayType":
      if (mrChange.value == "point")
      {
        this.showDrain = false;
        this.trayType = 'P';
        this.disableProfilesChoice = true;
      }
      else
      {
        this.showDrain = true;
        this.trayType = 'L';
        this.disableProfilesChoice = false;
      }
      break;

    case "screedHeigth":
      switch(mrChange.value)
      {
        case "lessThan7":
          this.thickness = 70;
          break;
        case "7to10":
          this.thickness = 100;
          break;
        case "moreThan10":
          this.thickness = 200;
          break;
      }
      break;
    }
    console.log(this.trayType + " " + this.thickness);
 } 

  onWidthChange()
  {
    if ((this.matWidth.value < 76) || (this.matWidth.value > 150))
    {
      alert("Il lato del piatto dove sta la canalina deve essere tra 76 e 150 cm\n" +
            "Per misure superiori chiamare ufficio tecnico wedi Italia");
      this.matWidth.setValue(90);
      setTimeout(()=>{
        this.matWidthField.nativeElement.select();
        this.matWidthField.nativeElement.focus();
      });
      return;
    }
    if (((this.inputWidth = this.matWidth.value) > 90) || (this.inputLength > 140))
    {
      this.scaleFactor = this.matWidth.value / 90;
      if (this.inputLength / 140 > this.scaleFactor)
      {
        this.scaleFactor = this.inputLength / 140;
      }
    }
    else
    {
      this.scaleFactor = 1.0;
    }
    this.trayWidth = this.matWidth.value * 2 / this.scaleFactor;
  }

  onLengthChange()
  {
    if ((this.matLength.value < 75) || (this.matLength.value > 260))
    {
      alert("Il lato del piatto dove sta la canalina deve essere tra 75 e 260 cm\n" +
            "Per misure superiori chiamare ufficio tecnico wedi Italia");
      this.matLength.setValue(140);
      setTimeout(()=>{
        this.matLengthField.nativeElement.select();
        this.matLengthField.nativeElement.focus();
      });
      return;
    }
    if (((this.inputLength = this.matLength.value) > 140) || (this.inputWidth > 90))
    {
      this.scaleFactor = length / 140;
      if (this.inputWidth / 90 > this.scaleFactor)
      {
        this.scaleFactor = this.inputWidth / 90;
      }
    }
    else
    {
      this.scaleFactor = 1.0;
    }
    this.trayLength = this.matLength.value * 2 / this.scaleFactor;
  }

  onTileThickChange()
  {
    if ((this.tileHeight.value < 8) || (this.tileHeight.value > 12.5))
    {
      alert("Lo spessore indicato per il rivestimento deve essere tra 8 e 12.5mm compreso il collante (circa 2mm)");
      this.tileHeight.setValue(10);
      setTimeout(()=>{
        this.tileHeightField.nativeElement.select();
        this.tileHeightField.nativeElement.focus();
      });
      return;
    }
  }

  openArticle(tray: Trays) {
    this.tray = tray;
    this.storage.requestedSize = {
      'requestedLen' : this.inputLength * 10,
      'requestedWidth' :  this.inputWidth * 10
    };
    this.storage.tray = tray;
    this.storage.profiles = {
      'est' : this.profilesEst,
      'west' : this.profilesWest,
      'north' : this.profilesNorth,
      'tileHeight' : this.tileHeight.value
    };

    console.log("calling router to navigate on " + this.tray.articleNumber);
    this.router.navigate(['details']);
  }

  doSearch() {
    this.searchCaption = "Ripeti";
    // this.dataSource = null;
    this.service.post(
                    'trays/search', 
                    {
                      "trayType" : this.trayType,
                      "thickness" : JSON.stringify(this.thickness),
                      "WMin" : JSON.stringify(this.inputWidth * 10),
                      "LMin" : JSON.stringify(this.inputLength * 10)
                    }
                )
                .subscribe(
                    (res: HttpResponse<any>)=>{  
                          this.trays = res.body.trays;
                          this.dataSource = new MatTableDataSource<Trays>(this.trays);
                          this.storage.landingComponentData = this;
                          this.searchPerformed = true;
                          this.storage.useExtension = res.body.useExtension;
                          this.storage.useDoubleExtension = res.body.useDoubleExtension;
                          console.log(this.trays);  
                        }
                )
  }

  doNew() {
    this.searchCaption = "Ricerca";
    this.searchPerformed = false;
    this.inputWidth = 90;
    this.inputLength = 120;
    this.matLength.setValue(120);
    this.matWidth.setValue(90);
    this.trayType = 'P';
    this.thickness = 139;
    this.disableProfilesChoice = true;
    this.storage.landingComponentData = null;
    this.dataSource = null;
    this.trayTypeRadioButton = "point";
    this.screedHeightRadioButton = "moreThan10";

  }
}