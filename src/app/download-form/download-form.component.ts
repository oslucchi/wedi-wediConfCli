
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { ApiService } from '../api.service';
import { SearchCriteria } from '../dataModel/SearchCriteria';
import { Order } from '../dataModel/Order';
import { User } from '../dataModel/User';
import { CookieService } from 'ngx-cookie-service';
import { StorageService } from '../storage.service';
import { LocalStorageService } from '../localstorage.service';

interface DialogData {
  order: Order[];
  searchCriteria : SearchCriteria;
}

@Component({
  selector: 'app-download-form',
  templateUrl: './download-form.component.html',
  styleUrls: ['./download-form.component.css']
})
export class DownloadFormComponent implements OnInit {
  @ViewChild("emailField", { static: false }) emailField: ElementRef;

  public user: User;
  public orderRef: string;
  public formIncomplete: boolean;

  constructor(public dialogRef: MatDialogRef<DownloadFormComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              private apiService: ApiService,
              private cookieServ: CookieService,
              public storage: StorageService,
              private localStorageService: LocalStorageService)
  {
  }

  ngOnInit() {
    this.user = this.storage.user;
    this.formIncomplete = true;
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onSendClick()
  {
    this.apiService
      .post("user/register", {
            user: this.user,
            session: this.storage.session
          })
      .subscribe((res: HttpResponse<any>) => {
        alert(res.body.message);
        this.dialogRef.close();
      });
  }

  formDataCheck(fieldName: string)
  {
    switch(fieldName)
    {
      case 'email':
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(String(this.user.email).toLowerCase()))
        {
          alert("La mail inserita non e' corretta.");
          setTimeout(() => {
            this.emailField.nativeElement.select();
            this.emailField.nativeElement.focus();
          });
          return;
        }
        this.apiService
        .get("user/email/" + this.user.email)
        .subscribe((res: HttpResponse<any>) => {
          if (res.body.user != null)
          {
            console.log("Mail '" + this.user.email + "' exists");
            if (this.user.idUser != res.body.user.idUser)
            {
              this.apiService
              .post("user/revamp/", {
                userNew: this.user,
                userOld: res.body.user,
                currentSession: this.storage.session
              })
              .subscribe((res: HttpResponse<any>) => {
                if (res.body.user != null)
                {
                  this.user = res.body.user;
                  this.storage.user.token = res.body.user.token;
                  this.localStorageService.set("token", res.body.user.token);
  
                  if (res.body.user.active)
                  {
                    alert("Account gia' esistente e autorizzato. Puoi scaricare i documenti");
                    this.dialogRef.close();
                  }
                  else
                  {
                    alert("Account esistente gia' ma non e' stato attivato.\n" + 
                          "Clicca su spedisci per ricevere nuovamente il link di attivazione");
                  }
                }
              })
            }
          }
        });
        break;
      default:
        if ((this.user.email != "") && 
            (this.user.firstName != "") &&
            (this.user.lastName != ""))
        {
          this.formIncomplete = false;
        }
    }
  }
}