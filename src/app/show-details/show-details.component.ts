import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { StorageService } from '../storage.service';
import { ApiService } from '../api.service';
import { HttpResponse } from '@angular/common/http';
import { Grids } from '../Grids';
import { MatTableDataSource } from '@angular/material/table';
import { Drains } from '../Drains';
import { OtherParts } from '../OtherParts';
import { Order } from '../Order';
import { saveAs } from 'file-saver';
import { Profiles } from '../Profiles';
import { Location } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-show-details',
  templateUrl: './show-details.component.html',
  styleUrls: ['./show-details.component.css']
})

export class ShowDetailsComponent implements OnInit {
  public size: string;
  public totalThickness: string[];
  public pdfPath: string;
  public imgPath: string;
  private service: ApiService;
  public grids: Grids[];
  public drains: Drains[];
  public otherParts: OtherParts[];
  public profiles: Profiles[];

  public showGrids: boolean;
  public showDrains: boolean;
  public showOtherParts: boolean;
  public showProfiles: boolean;
  public noGrids: boolean;
  public noDrains: boolean;
  public noOther: boolean;
  public gridsMandatory: boolean;

  dataSourceGrids: MatTableDataSource<Grids>;
  dataSourceDrains: MatTableDataSource<Drains>;
  dataSourceOtherParts: MatTableDataSource<OtherParts>;
  datasourceOrder: MatTableDataSource<Order>;
  dataSourceProfiles: MatTableDataSource<Profiles>;


  public tray: Trays;
  public grid: Grids;
  public drain: Drains;
  public other: OtherParts;
  public profile: Profiles;

  public order: Order[];

  private FILE_TYPE_EXCEL = 1;
  private FILE_TYPE_CSV = 2;
  private FILE_TYPE_TXT = 3;
  private FILE_TYPE_DOCS = 4;

  public fileTypes: any = [
    { id: this.FILE_TYPE_EXCEL, des: "Excel", selected: true, disabled: false},
    { id: this.FILE_TYPE_CSV, des: "CSV", selected: false, disabled: false},
    { id: this.FILE_TYPE_TXT, des: "Testo", selected: false, disabled: false},
    { id: this.FILE_TYPE_DOCS, des: "Documentazione", selected: false, disabled: false}
  ];
  public fileType: number;

  public gridDisplayedColumns: any[] = [
    { def: 'gridSelected', hide: false },
    { def: 'gridArticleNumber', hide: false }, 
    { def: 'gridDescription',  hide: false }, 
    { def: 'gridTrayType', hide: true }, 
    { def: 'gridSize',  hide: false }, 
    { def: 'gridPrice', hide: false },
    { def: 'gridWidth', hide: true },
    { def: 'gridLength', hide: true },
    { def: 'gridThickness', hide: true}
  ];

  public drainDisplayedColumns: any[] = [
    { def: 'drainSelected', hide: false },
    { def: 'drainArticleNumber', hide: false }, 
    { def: 'drainDescription',  hide: false }, 
    { def: 'drainDrainDiameter', hide: false }, 
    { def: 'drainPrice', hide: false }
  ];

  public otherPartsDisplayedColumns: any[] = [
    { def: 'otherSelected', hide: false },
    { def: 'otherArticleNumber', hide: false }, 
    { def: 'otherDescription',  hide: false }, 
    { def: 'otherPrice', hide: false }
   ];

   public orderDisplayedColumns: any[] = [
    { def: 'orderArticleNumber', hide: false }, 
    { def: 'orderDescription',  hide: false }, 
    { def: 'orderSize', hide: false },
    { def: 'orderPrice', hide: false }
   ];

   public profilesDisplayedColumns: any[] = [
    { def: 'profileSelected', hide: false }, 
    { def: 'profileArticleNumber', hide: false }, 
    { def: 'profileDescription',  hide: false }, 
    { def: 'profileType', hide: true },
    { def: 'profileSide', hide: true },
    { def: 'profileLength', hide: false },
    { def: 'profileTileHeight', hide: true },
    { def: 'profilePrice', hide: false }
   ];

   public storageLocal: StorageService;

   constructor(private routeParams: ActivatedRoute, 
              public storage: StorageService,
              private apiService: ApiService,
              private _location: Location,
              private cookieService: CookieService ) {
    
    this.storageLocal = storage;
    this.tray = storage.tray;
    var item = new Order();
    item.articleNumber = this.tray.articleNumber;
    item.description = this.tray.description;
    item.size = this.tray.width + "x" + this.tray.length + "x" + this.tray.thickness;
    item.price = this.tray.price;
    
    this.order = new Array<Order>();
    this.order.push(item);
  
    console.log("show details called. Article " + storage.tray.articleNumber);

    this.size = "" + this.tray.width + " x " +
                this.tray.length + " x " + this.tray.thickness;
    this.totalThickness = [
      "Spessore totale con piletta MiniMax DN40: " + (this.tray.thickness + (this.tray.trayType == "L" ? 49 : 47)),
      "Spessore totale con piletta DN50: " + (this.tray.thickness + + (this.tray.trayType == "L" ? 80 : 90))
    ];
    this.service = apiService;
    this.noGrids = true;
    this.noDrains = true;
    this.noOther = true;
  }
  
  ngOnInit() {
    this.showGrids = false;
    this.showDrains = false;
    this.showOtherParts = false;
    this.showProfiles = false;
    this.noGrids = true;
    this.noDrains = true;
    this.noOther = true;
    this.routeParams.params.subscribe((params: Params) => {
      this.pdfPath = this.storage.baseHref + "assets/productDetails/" + this.tray.articleNumber + ".pdf";
      this.imgPath = this.storage.baseHref + "assets/productDetails/" + this.tray.articleNumber + ".png";
      console.log("image path '" + this.imgPath + "'");
      this.service.post(
                    'trays/parts', 
                    {
                      "requestedSize" : this.storage.requestedSize,
                      "trayArticleNumber" : this.tray.articleNumber,
                      "useExtension" : this.storage.useExtension.toString(),
                      "useDoubleExtension" : this.storage.useDoubleExtension.toString(),
                      "tray" : this.tray,
                      "profiles" : this.storage.profiles
                    }
                  )
                  .subscribe(
                      (res: HttpResponse<any>)=> {
                        this.grids = res.body.grids; 
                        this.drains = res.body.drains; 
                        this.otherParts = res.body.otherParts;
                        this.profiles = res.body.profiles;
                        var i: number;
                        for( i = 0; i < this.otherParts.length; i++)
                        {
                          if (this.otherParts[i].selected)
                          {
                            var item = new Order();
                            item.articleNumber = this.otherParts[i].articleNumber;
                            item.description = this.otherParts[i].description;
                            item.size = "";
                            item.price = this.otherParts[i].price;
                            this.order.push(item);
                            this.otherParts.splice(i, 1);
                          }                          
                        }
                        this.dataSourceGrids = new MatTableDataSource<Grids>(this.grids);
                        this.dataSourceDrains = new MatTableDataSource<Drains>(this.drains);
                        this.dataSourceOtherParts = new MatTableDataSource<OtherParts>(this.otherParts);
                        this.dataSourceProfiles = new MatTableDataSource<Profiles>(this.profiles);
                        this.datasourceOrder = new MatTableDataSource<Order>(this.order);
                        console.log("Drain type '" + this.tray.drainType + "'")
                        if (this.tray.drainType == 'I')
                        {
                          this.noDrains = false;
                          this.gridsMandatory = false;
                        }
                        else
                        {
                          this.noDrains = true;
                          if (this.tray.trayType != 'P')
                          {
                            this.gridsMandatory = true;
                          }
                        }
                      }
                  )
    });
  } 

  getGridDisplayedColumns():string[] 
  {
    return this.gridDisplayedColumns.filter(cd=>!cd.hide).map(cd=>cd.def);
  }

  getDrainDisplayedColumns():string[] 
  {
    return this.drainDisplayedColumns.filter(cd=>!cd.hide).map(cd=>cd.def);
  }

  getOtherPartsDisplayedColumns():string[] 
  {
    return this.otherPartsDisplayedColumns.filter(cd=>!cd.hide).map(cd=>cd.def);
  }

  getOrderDisplayedColumns():string[] 
  {
    return this.orderDisplayedColumns.filter(cd=>!cd.hide).map(cd=>cd.def);
  }

  getProfilesDisplayedColumns():string[]
  {
    return this.profilesDisplayedColumns.filter(cd=>!cd.hide).map(cd=>cd.def);
  }

  toggleGrids()
  {
    this.showGrids = !this.showGrids;
    if (this.showGrids)
    {
      this.showOtherParts = false;
      this.showDrains = false;
      this.showProfiles = false;
    }
  }

  toggleDrains()
  {
    this.showDrains = !this.showDrains;
    if (this.showDrains)
    {
      this.showOtherParts = false;
      this.showGrids = false;
      this.showProfiles = false;
    }
  }

  toggleOtherParts()
  {
    this.showOtherParts = !this.showOtherParts;
    if (this.showOtherParts)
    {
      this.showDrains = false;
      this.showGrids = false;
      this.showProfiles = false;
    }
  }

  toggleProfiles()
  {
    this.showProfiles = !this.showProfiles;
    if (this.showProfiles)
    {
      this.showOtherParts = false;
      this.showDrains = false;
      this.showGrids = false;
    }
  }

  removeFromOrderArray(articleNumber: string)
  {
    var i: number;
    for(i = 0; i < this.order.length; i++)
    {
      if (this.order[i].articleNumber == articleNumber)
      {
        this.order.splice(i, 1);
        break;
      }
    }
  }
  
  isAFrame(articleNumber: string)
  {
    var i: number;
    var framesArray: string[];
    framesArray = ['676800060',
                   '676800061',
                   '676800062',
                   '676800063', 
                   '676800064'];

    for(i = 0; i < framesArray.length; i++)
    {
      if (articleNumber.localeCompare(framesArray[i]) == 0)
      {
        return true;
      }
    }
    return false;
  }

  isACombo(articleNumber: string)
  {
    var i: number;
    var framesArray: string[];
    framesArray = ['676900025',
                   '676900026',
                   '676900027',
                   '676900028',
                   '676900029'];
                   
    for(i = 0; i < framesArray.length; i++)
    {
      if (articleNumber.localeCompare(framesArray[i]) == 0)
      {
        return true;
      }
    }
    return false;
  }

  selectGrid(articleNumber: string)
  {
    this.noGrids = true;

    var i: number;
    for(i = 0; i < this.grids.length; i++)
    {
      console.log(this.grids[i].articleNumber + " - checked: " + this.grids[i].selected);      
      if (this.grids[i].articleNumber != articleNumber)
      {
        if (this.isAFrame(articleNumber) && this.isACombo(this.grids[i].articleNumber))
        {
          this.grids[i].selected = false;
          this.removeFromOrderArray(this.grids[i].articleNumber);
        }
        else if (!(this.isAFrame(articleNumber) || this.isAFrame(this.grids[i].articleNumber)))
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
        item.size = this.grid.width + "x" + this.grid.length + "x" + this.grid.thickness;
        item.price = this.grid.price;
        this.order.push(item);  
      }
      else
      {
        this.removeFromOrderArray(articleNumber);
      }
    }
    this.datasourceOrder = new MatTableDataSource<Order>(this.order);
  }

  selectDrain(articleNumber: string)
  {
    this.noDrains = true;

    var i: number;
    for(i = 0; i < this.drains.length; i++)
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
  }

  selectOtherParts(articleNumber: string)
  {
    var i: number;
    for(i = 0; i < this.otherParts.length; i++)
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
    for(i = 0; i < this.profiles.length; i++)
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

  saveOrder()
  {
    var userId = this.cookieService.get('userId');

    switch(this.fileType)
    {
      case this.FILE_TYPE_EXCEL:
        this.service.downloadFromURL("trays/order/exc", this.order, 'blob')
        .subscribe((res: HttpResponse<any>)=> {
          console.log(res.headers.get("content-disposition"));
          var blob = new Blob([res.body], {type: 'application/vnd.ms-excel'});
          saveAs(blob, "ordine.xlsx");
        });
        break;
      
      case this.FILE_TYPE_CSV:
        this.service.downloadFromURL("trays/order/csv", this.order, 'text')
        .subscribe((res: HttpResponse<any>)=> {
          console.log(res.headers.get("content-disposition"));
          var blob = new Blob([res.body], {type: 'text/csv'});
          saveAs(blob, "ordine.csv");
        });
        break;

      case this.FILE_TYPE_TXT:
        this.service.downloadFromURL("trays/order/txt", this.order, 'text')
        .subscribe((res: HttpResponse<any>)=> {
          console.log(res.headers.get("content-disposition"));
          var blob = new Blob([res.body], {type: 'text/plain'});
          saveAs(blob, "ordine.txt");
        });
        break;

      case this.FILE_TYPE_DOCS:
        var traysArr = new Array(this.tray);
        this.service.downloadFromURL("trays/order/doc", traysArr, 'blob')
        .subscribe((res: HttpResponse<any>)=> {
          console.log(res.headers.get("content-disposition"));
          var blob = new Blob([res.body], {type: 'application/zip'});
          saveAs(blob, "documentazione.zip");
        });
        break;
    }
    this.fileType = 0;
  }

  downloadDocs()
  {
    this.fileType = this.FILE_TYPE_DOCS;
    this.saveOrder();
  }

  backClicked() {
    this._location.back();
  }
}

