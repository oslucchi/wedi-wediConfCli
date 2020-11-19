import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { StorageService } from "../storage.service";
import { ApiService } from "../api.service";
import { HttpResponse } from "@angular/common/http";
import { MatTableDataSource } from "@angular/material/table";
import { Location } from "@angular/common";
import { CookieService } from "ngx-cookie-service";
import { DownloadFormComponent } from '../download-form/download-form.component';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { Grid } from '../dataModel/Grid';
import { Drain } from '../dataModel/Drain';
import { OtherPart } from '../dataModel/OtherPart';
import { Profile } from '../dataModel/Profile';
import { Order } from '../dataModel/Order';
import { Tray } from '../dataModel/Tray';
import { saveAs } from 'file-saver';

@Component({
  selector: "app-show-details",
  templateUrl: "./show-details.component.html",
  styleUrls: ["./show-details.component.css"],
})
export class ShowDetailsComponent implements OnInit {

  public size: string;
  public totalThickness: string[];
  public pdfPath: string;
  public imgPath: string;
  public grids: Grid[];
  public drains: Drain[];
  public otherParts: OtherPart[];
  public profiles: Profile[];

  public showGrids: boolean;
  public showDrains: boolean;
  public showOtherParts: boolean;
  public showProfiles: boolean;
  public noGrids: boolean;
  public noDrains: boolean;
  public noOther: boolean;
  public gridsMandatory: boolean;
  public drainMandatory: boolean;
  public missingMandatories: boolean;

  public orderRef: string;
  public order: Order[];

  dataSourceGrids: MatTableDataSource<Grid>;
  dataSourceDrains: MatTableDataSource<Drain>;
  dataSourceOtherParts: MatTableDataSource<OtherPart>;
  datasourceOrder: MatTableDataSource<Order>;
  dataSourceProfiles: MatTableDataSource<Profile>;

  public grid: Grid;
  public drain: Drain;
  public other: OtherPart;
  public profile: Profile;

  private FILE_TYPE_EXCEL = 1;
  private FILE_TYPE_CSV = 2;
  private FILE_TYPE_TXT = 3;
  private FILE_TYPE_DOCS = 4;

  public fileTypes: any = [
    { id: this.FILE_TYPE_EXCEL, des: "Excel", selected: true, disabled: false },
    { id: this.FILE_TYPE_CSV, des: "CSV", selected: false, disabled: false },
    { id: this.FILE_TYPE_TXT, des: "Testo", selected: false, disabled: false },
    { id: this.FILE_TYPE_DOCS, des: "Documentazione", selected: false, disabled: false },
  ];
  public fileType: number;

  public gridDisplayedColumns: any[] = [
    { def: "gridSelected", hide: false },
    { def: "gridArticleNumber", hide: false },
    { def: "gridDescription", hide: false },
    { def: "gridTrayType", hide: true },
    { def: "gridSize", hide: false },
    { def: "gridPrice", hide: false },
    { def: "gridWidth", hide: true },
    { def: "gridLength", hide: true },
    { def: "gridThickness", hide: true },
  ];

  public drainDisplayedColumns: any[] = [
    { def: "drainSelected", hide: false },
    { def: "drainArticleNumber", hide: false },
    { def: "drainDescription", hide: false },
    { def: "drainDrainDiameter", hide: false },
    { def: "drainPrice", hide: false },
  ];

  public otherPartsDisplayedColumns: any[] = [
    { def: "otherSelected", hide: false },
    { def: "otherArticleNumber", hide: false },
    { def: "otherDescription", hide: false },
    { def: "otherPrice", hide: false },
  ];

  public orderDisplayedColumns: any[] = [
    { def: "orderArticleNumber", hide: false },
    { def: "orderDescription", hide: false },
    { def: "orderSize", hide: false },
    { def: "orderPrice", hide: false },
  ];

  public profilesDisplayedColumns: any[] = [
    { def: "profileSelected", hide: false },
    { def: "profileArticleNumber", hide: false },
    { def: "profileDescription", hide: false },
    { def: "profileType", hide: true },
    { def: "profileSide", hide: true },
    { def: "profileLength", hide: false },
    { def: "profileTileHeight", hide: true },
    { def: "profilePrice", hide: false },
  ];

  constructor(private routeParams: ActivatedRoute,
              public storage: StorageService,
              private service: ApiService,
              private _location: Location,
              private dialog: MatDialog)
  {
  }

  ngOnInit() 
  {
    var item = new Order();

    item.articleNumber = this.storage.tray.articleNumber;
    item.description = this.storage.tray.description;
    item.size = this.storage.tray.length + "x" + 
                this.storage.tray.width + "x" + 
                this.storage.tray.thickness;
    item.price = this.storage.tray.price;

    this.order = new Array<Order>();
    this.order.push(item);

    console.log("show details called. Article " + this.storage.tray.articleNumber);

    this.size = this.storage.tray.length + " x " + 
                this.storage.tray.width + " x " + 
                this.storage.tray.thickness;

                this.totalThickness = [
      "Spessore totale con piletta MiniMax DN40: " +
        (this.storage.tray.thickness + (this.storage.tray.trayType == "L" ? 49 : 47)),
      "Spessore totale con piletta DN50: " +
        (this.storage.tray.thickness + +(this.storage.tray.trayType == "L" ? 80 : 90)),
    ];

    this.showGrids = false;
    this.showDrains = false;
    this.showOtherParts = false;
    this.showProfiles = false;
    this.noGrids = true;
    this.noDrains = true;
    this.noOther = true;
    this.gridsMandatory = false;
    this.drainMandatory = false;
    this.missingMandatories = true;
    this.routeParams.params.subscribe((params: Params) => {
    this.pdfPath =this.storage.baseHref + "assets/productDetails/" + this.storage.tray.articleNumber + ".pdf";
    this.imgPath = this.storage.baseHref + "assets/productDetails/" + this.storage.tray.articleNumber + ".png";
    console.log("image path '" + this.imgPath + "'");
    this.service
      .post("trays/parts", {
        tray: this.storage.tray,
        searchCriteria: this.storage.searchCriteria,
        useExtension: this.storage.useExtension.toString(),
        useDoubleExtension: this.storage.useDoubleExtension.toString()
      })
      .subscribe((res: HttpResponse<any>) => {
        var i: number;
        this.grids = res.body.grids;
        this.drains = res.body.drains;
        this.otherParts = res.body.otherParts;
        this.profiles = res.body.profiles;
        if (this.storage.tray.drainType == "I") 
        {
          this.gridsMandatory = false;
          this.drainMandatory = false;
        }
        else
        {
          this.drainMandatory = true;
          if (this.storage.tray.trayType != "P") {
            this.gridsMandatory = true;
          }
        }
        for (i = 0; i < this.otherParts.length; i++) {
          if (this.otherParts[i].selected) {
            var item = new Order();
            item.articleNumber = this.otherParts[i].articleNumber;
            item.description = this.otherParts[i].description;
            item.size = "";
            item.price = this.otherParts[i].price;
            this.order.push(item);
            this.otherParts.splice(i, 1);
          }
        }
        for (i = 0; i < this.drains.length; i++) {
          if (this.drains[i].selected) 
          {
            var item = new Order();
            this.noDrains = false;
            item.articleNumber = this.drains[i].articleNumber;
            item.description = this.drains[i].description;
            item.size = "";
            item.price = this.drains[i].price;
            this.order.push(item);
          }
        }
        this.missingMandatories = (this.gridsMandatory && this.noGrids) ||
                                  (this.drainMandatory && this.noDrains);
  
        this.dataSourceGrids = new MatTableDataSource<Grid>(this.grids);
        this.dataSourceDrains = new MatTableDataSource<Drain>(this.drains);
        this.dataSourceOtherParts = new MatTableDataSource<OtherPart>(
          this.otherParts
        );
        this.dataSourceProfiles = new MatTableDataSource<Profile>(
          this.profiles
        );
        this.datasourceOrder = new MatTableDataSource<Order>(this.order);
        console.log("Drain type '" + this.storage.tray.drainType + "'");
      });
    });
  }

  getGridDisplayedColumns(): string[] {
    return this.gridDisplayedColumns
      .filter((cd) => !cd.hide)
      .map((cd) => cd.def);
  }

  getDrainDisplayedColumns(): string[] {
    return this.drainDisplayedColumns
      .filter((cd) => !cd.hide)
      .map((cd) => cd.def);
  }

  getOtherPartsDisplayedColumns(): string[] {
    return this.otherPartsDisplayedColumns
      .filter((cd) => !cd.hide)
      .map((cd) => cd.def);
  }

  getOrderDisplayedColumns(): string[] {
    return this.orderDisplayedColumns
      .filter((cd) => !cd.hide)
      .map((cd) => cd.def);
  }

  getProfilesDisplayedColumns(): string[] {
    return this.profilesDisplayedColumns
      .filter((cd) => !cd.hide)
      .map((cd) => cd.def);
  }

  toggleGrids() {
    this.showGrids = !this.showGrids;
    if (this.showGrids) {
      this.showOtherParts = false;
      this.showDrains = false;
      this.showProfiles = false;
    }
  }

  toggleDrains() {
    this.showDrains = !this.showDrains;
    if (this.showDrains) {
      this.showOtherParts = false;
      this.showGrids = false;
      this.showProfiles = false;
    }
  }

  toggleOtherParts() {
    this.showOtherParts = !this.showOtherParts;
    if (this.showOtherParts) {
      this.showDrains = false;
      this.showGrids = false;
      this.showProfiles = false;
    }
  }

  toggleProfiles() {
    this.showProfiles = !this.showProfiles;
    if (this.showProfiles) {
      this.showOtherParts = false;
      this.showDrains = false;
      this.showGrids = false;
    }
  }

  removeFromOrderArray(articleNumber: string) {
    var i: number;
    for (i = 0; i < this.order.length; i++) {
      if (this.order[i].articleNumber == articleNumber) {
        this.order.splice(i, 1);
        break;
      }
    }
  }

  isAFrame(articleNumber: string) {
    var i: number;
    var framesArray: string[];
    framesArray = [
      "676800060",
      "676800061",
      "676800062",
      "676800063",
      "676800064",
    ];

    for (i = 0; i < framesArray.length; i++) {
      if (articleNumber.localeCompare(framesArray[i]) == 0) {
        return true;
      }
    }
    return false;
  }

  isACombo(articleNumber: string) {
    var i: number;
    var framesArray: string[];
    framesArray = [
      "676900025",
      "676900026",
      "676900027",
      "676900028",
      "676900029",
    ];

    for (i = 0; i < framesArray.length; i++) {
      if (articleNumber.localeCompare(framesArray[i]) == 0) {
        return true;
      }
    }
    return false;
  }

  selectGrid(articleNumber: string)
  {
    this.noGrids = true;

    var i: number;
    for (i = 0; i < this.grids.length; i++) 
    {
      console.log(this.grids[i].articleNumber + " - checked: " + this.grids[i].selected);
      if (this.grids[i].articleNumber != articleNumber) 
      {
        if (this.isAFrame(articleNumber) &&
            this.isACombo(this.grids[i].articleNumber))
        {
          this.grids[i].selected = false;
          this.removeFromOrderArray(this.grids[i].articleNumber);
        }
        else if (!(this.isAFrame(articleNumber) ||
                   this.isAFrame(this.grids[i].articleNumber)))
        {
          this.grids[i].selected = false;
          this.removeFromOrderArray(this.grids[i].articleNumber);
        }
        else if (this.isACombo(articleNumber))
        {
          this.grids[i].selected = false;
          this.removeFromOrderArray(this.grids[i].articleNumber);
        }
      } 
      else if (this.grids[i].selected)
      {
        this.noGrids = false;
        this.grid = this.grids[i];
        var item = new Order();
        item.articleNumber = this.grid.articleNumber;
        item.description = this.grid.description;
        item.size = this.grid.length + "x" + this.grid.width + "x" + this.grid.thickness;
        item.price = this.grid.price;
        this.order.push(item);
      }
      else
      {
        this.removeFromOrderArray(articleNumber);
      }
    }
    this.datasourceOrder = new MatTableDataSource<Order>(this.order);
    console.log(
      "selectGrid: gridsMandatory=" + this.gridsMandatory +
        " | noGrids=" + this.noGrids +
        " | drainMandatory=" + this.drainMandatory +
        " | noDrains=" + this.noDrains
    );
    this.missingMandatories =
      (this.gridsMandatory && this.noGrids) ||
      (this.drainMandatory && this.noDrains);
    this.showGrids = this.showGrids && this.noGrids;
  }

  selectDrain(articleNumber: string)
  {
    this.noDrains = true;

    var i: number;
    for (i = 0; i < this.drains.length; i++)
    {
      console.log(this.drains[i].articleNumber + " - checked: " + this.drains[i].selected);
      if (this.drains[i].articleNumber != articleNumber) 
      {
        this.drains[i].selected = false;
        this.removeFromOrderArray(this.drains[i].articleNumber);
      }
      else if (this.drains[i].selected) 
      {
        this.noDrains = false;
        this.drain = this.drains[i];
        var item = new Order();
        item.articleNumber = this.drain.articleNumber;
        item.description = this.drain.description;
        item.size = this.drain.drainDiameter;
        item.price = this.drain.price;
        this.order.push(item);
      }
      else
      {
        this.removeFromOrderArray(this.drain.articleNumber);
      }
    }
    this.datasourceOrder = new MatTableDataSource<Order>(this.order);
    console.log(
      "selectDrain: gridsMandatory=" + this.gridsMandatory + 
      " | noGrids=" + this.noGrids + 
      " | drainMandatory=" + this.drainMandatory + 
      " | noDrains=" + this.noDrains
    );
    this.missingMandatories =
      (this.gridsMandatory && this.noGrids) ||
      (this.drainMandatory && this.noDrains);
    this.showDrains = this.showDrains && this.noDrains;
  }

  selectOtherParts(articleNumber: string)
  {
    var i: number;
    for (i = 0; i < this.otherParts.length; i++) 
    {
      console.log(this.otherParts[i].articleNumber + " - checked: " + this.otherParts[i].selected);
      if (this.otherParts[i].articleNumber == articleNumber) 
      {
        if (this.otherParts[i].selected)
        {
          this.other = this.otherParts[i];
          var item = new Order();
          item.articleNumber = this.other.articleNumber;
          item.description = this.other.description;
          item.size = "";
          item.price = this.other.price;
          this.order.push(item);
        } 
        else 
        {
          this.removeFromOrderArray(this.otherParts[i].articleNumber);
        }
      }
    }
    this.datasourceOrder = new MatTableDataSource<Order>(this.order);
  }

  selectProfiles(articleNumber: string)
  {
    var i: number;
    for (i = 0; i < this.profiles.length; i++) 
    {
      console.log(this.profiles[i].articleNumber + " - checked: " + this.profiles[i].selected);
      if (this.profiles[i].articleNumber == articleNumber) 
      {
        if (this.profiles[i].selected) 
        {
          this.profile = this.profiles[i];
          var item = new Order();
          item.articleNumber = this.profile.articleNumber;
          item.description = this.profile.description;
          item.size = "";
          item.price = this.profile.price;
          this.order.push(item);
        } 
        else 
        {
          this.removeFromOrderArray(this.profiles[i].articleNumber);
        }
      }
    }
    this.datasourceOrder = new MatTableDataSource<Order>(this.order);
  }
  
  registerUser()
  {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.hasBackdrop = true;

    dialogConfig.data = {
      orderList: this.order
    };

    dialogConfig.height = '600px';
    dialogConfig.width = '700px';

    this.dialog.open(DownloadFormComponent, dialogConfig);
  }

  saveOrder() 
  {
    this.service
    .post("user/search",
          {
            user: this.storage.user,
            session: this.storage.session
          }
    )
    .subscribe((res: HttpResponse<any>) => {
      this.storage.user = res.body.user;
      if (!this.storage.user.active)
      {
        this.registerUser();
      }
      else
      {
        this.downloadFromSite();
      }
    });
  }
  
  downloadFromSite()
  {
    if ((this.orderRef == null) || (this.orderRef == undefined))
    {
      this.orderRef = "proposta";
    }
    switch (this.fileType) 
    {
      case this.FILE_TYPE_EXCEL:
        this.service
          .downloadFromURL("trays/order/exc", 
                           {
                              order: this.order,
                              session: this.storage.session,
                              reference: this.orderRef
                           },
                           "blob")
          .subscribe((res: HttpResponse<any>) => {
            console.log(res.headers.get("content-disposition"));
            var blob = new Blob([res.body], {
              type: "application/vnd.ms-excel",
            });
            saveAs(blob, this.orderRef + ".xlsx");
          });
        break;

      case this.FILE_TYPE_CSV:
        this.service
          .downloadFromURL("trays/order/csv",
                           {
                              order: this.order,
                              session: this.storage.session,
                              reference: this.orderRef
                           },
                           "blob")
          .subscribe((res: HttpResponse<any>) => {
            console.log(res.headers.get("content-disposition"));
            var blob = new Blob([res.body], { type: "text/csv" });
            saveAs(blob, this.orderRef + ".csv");
          });
        break;

      case this.FILE_TYPE_TXT:
        this.service
          .downloadFromURL("trays/order/txt", 
                           {
                              order: this.order,
                              session: this.storage.session,
                              reference: this.orderRef
                           },
                           "blob")
          .subscribe((res: HttpResponse<any>) => {
            console.log(res.headers.get("content-disposition"));
            var blob = new Blob([res.body], { type: "text/plain" });
            saveAs(blob, this.orderRef + ".txt");
          });
        break;

      case this.FILE_TYPE_DOCS:
        var traysArr = new Array(this.storage.tray);
        this.service
          .downloadFromURL("trays/order/doc", 
                           {
                              order: traysArr,
                              session: this.storage.session,
                              reference: this.orderRef
                           },
                           "blob")
          .subscribe((res: HttpResponse<any>) => {
            console.log(res.headers.get("content-disposition"));
            var blob = new Blob([res.body], { type: "application/zip" });
            saveAs(blob, "documentazione-" + this.orderRef + ".zip");
          });
        break;

      default:
        alert("ATTENZIONE\nE' obbligatorio selezionare un tipo file");
    }
    this.fileType = 0;
  }

  downloadDocs() 
  {
    this.fileType = this.FILE_TYPE_DOCS;
    this.saveOrder();
  }

  backClicked() 
  {
    this._location.back();
  }
}
