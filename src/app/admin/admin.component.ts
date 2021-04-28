import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatTab, MatTable, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { SearchCriteria } from '../dataModel/SearchCriteria';
import { User } from '../dataModel/User';
import { Session } from '../dataModel/Session';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  private queries: SearchCriteria[];
  public usersDS: MatTableDataSource<User>;
  public sessionDS: MatTableDataSource<Session>;
  public queriesDS: MatTableDataSource<SearchCriteria>;
  private displayedColumnsUsers: any[] = [
    { def: "lastName", hide: false },
    { def: "firstName", hide: false },
    { def: "organization", hide: false },
    { def: "email", hide: false },
    { def: "active", hide: false }
  ];
  private displayedColumnsSessions: any[] = [
    { def: "timestamp", hide: false },
    { def: "empty", hide: false },
    { def: "ipAddress", hide: false }
  ];
  private displayedColumnsQueries: any[] = [
    { def: "trayType", hide: false },
    { def: "screedThickness", hide: false },
    { def: "size", hide: false },
    { def: "tileHeight", hide: false },
    { def: "profiles", hide: false }
  ];

  constructor(private storage: StorageService,
              private router: Router, 
              private service: ApiService)
  {
    this.usersDS = new MatTableDataSource<User>([]);
    this.sessionDS = new MatTableDataSource<Session>([]);
    this.queriesDS = new MatTableDataSource<SearchCriteria>([]);
  }

  ngOnInit() 
  {
    if (this.storage.user.role != 10)
    {
      alert("L'utente non e' abilitato alle funzioni di amministrazione");
      this.router.navigate(["landing"]);
      return;
    }

    this.service
      .post("admin/users",
            {
              user: this.storage.user
            }
      )
      .subscribe((res: HttpResponse<any>) => {
        this.usersDS = new MatTableDataSource<User>(res.body.users);
        this.sessionDS = new MatTableDataSource<Session>([]);
        this.queriesDS = new MatTableDataSource<SearchCriteria>([]);    
      });
  }

  userSession(user: User)
  {
    this.service
      .post("admin/sessions",
            {
              currentUser: this.storage.user,
              sessionsOf: user
            }
      )
      .subscribe((res: HttpResponse<any>) => {
        this.sessionDS = new MatTableDataSource<Session>(res.body.sessions);
        this.queriesDS = new MatTableDataSource<SearchCriteria>([]);    
      });
  }

  sessionQueries(session: Session)
  {
    var criteria: SearchCriteria;
    this.service
      .post("admin/queries",
            {
              currentUser: this.storage.user,
              session: session
            }
      )
      .subscribe((res: HttpResponse<any>) => {
        this.queries = [];
        res.body.queries.forEach(element => {
          criteria = JSON.parse(element.searchCriteria);
          console.log("Tray type " + criteria.trayType + " - screadThick " + criteria.screedThickness);
          this.queries.push(
            {
              trayType: criteria.trayType,
              screedThickness: criteria.screedThickness,
              wMin: criteria.wMin,
              lMin: criteria.lMin,
              profiles: 
              {
                est: criteria.profiles.est,
                west: criteria.profiles.west,
                north: criteria.profiles.north,
                tileHeight: criteria.profiles.tileHeight
              }
            });
        });
        console.log("Items in the data set: " + this.queries.length);
        this.queriesDS = new MatTableDataSource<SearchCriteria>(this.queries);
      }
    );
  }

  getDisplayedColumns(entry: string): string[]
  {
    switch(entry)
    {
      case "users":
        return this.displayedColumnsUsers.filter((cd) => !cd.hide).map((cd) => cd.def);
        break;
      case "sessions":
        return this.displayedColumnsSessions.filter((cd) => !cd.hide).map((cd) => cd.def);
       break;
      case "queries":
        return this.displayedColumnsQueries.filter((cd) => !cd.hide).map((cd) => cd.def);
        break;
    }
  }

  lookupStatus(status: boolean): string
  {
    if (status)
    {
      return "A";
    }
    else
    {
      return "D";
    }
  }

}
