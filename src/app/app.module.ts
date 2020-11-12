import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LandingComponent } from './landing/landing.component';
import { ProtectedInputComponent } from './protected-input/protected-input.component';
import { TraysComponent } from './trays/trays.component';
import { DrainComponent } from './trays/drain/drain.component';
import { PunctComponent } from './trays/punct/punct.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatRadioModule } from "@angular/material/radio";
import { MatTableModule } from '@angular/material/table'; 
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ShowDetailsComponent } from './show-details/show-details.component';
import { AboutComponent } from './about/about.component';
import { CookieService} from 'ngx-cookie-service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DownloadFormComponent } from './download-form/download-form.component';
import { MatDialogModule } from '@angular/material';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    ProtectedInputComponent,
    TraysComponent,
    DrainComponent,
    PunctComponent,
    ShowDetailsComponent,
    AboutComponent,
    DownloadFormComponent
  ],

  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatRadioModule,
    MatTableModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    AppRoutingModule,
    MatDialogModule
  ],

  providers: [CookieService],
  bootstrap: [AppComponent],
  entryComponents: [
    DownloadFormComponent, 
  ]
})
export class AppModule { }
