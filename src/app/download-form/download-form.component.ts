
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { ApiService } from '../api.service';
import { SearchCriteria } from '../dataModel/SearchCriteria';
import { Order } from '../dataModel/Order';
import { User } from '../dataModel/User';
import { CookieService } from 'ngx-cookie-service';
import { StorageService } from '../storage.service';

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
  public user: User;
  public orderRef: string;

  constructor(public dialogRef: MatDialogRef<DownloadFormComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              private apiService: ApiService,
              private cookieServ: CookieService,
              public storage: StorageService)
  {

  }

  ngOnInit() {
    this.user = this.storage.user;
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onSendClick()
  {
    this.apiService
      .post("user/register", {
            user: this.user
      })
      .subscribe((res: HttpResponse<any>) => {
        alert(res.body.message);
        this.dialogRef.close();
      });
  }
}