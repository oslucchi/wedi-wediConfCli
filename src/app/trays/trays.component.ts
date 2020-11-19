import { Component, Input, SimpleChange } from "@angular/core";

@Component({
  selector: "app-trays",
  templateUrl: "./trays.component.html",
  styleUrls: ["./trays.component.css"]
})
export class TraysComponent {
  @Input()
  showDrain: boolean;
  @Input()
  trayWidth: number;
  @Input()
  trayLength: number;

  private scaleFactor: number;
  public width: number;
  public length: number;

  constructor()
  {
  }

  evaluateScaleFactor()
  {
    var scaleFactorW: number = 1;
    var scaleFactorL: number = 1;


    if (this.trayWidth > 900)
    {
      scaleFactorW = this.trayWidth / 900;
    }
    else if (this.trayLength > 1400)
    {
      scaleFactorL = this.trayLength / 1400;
    }
    this.scaleFactor = (scaleFactorL > scaleFactorW ? scaleFactorL : scaleFactorW);
    this.width = this.trayWidth / 5 / this.scaleFactor;
    this.length = this.trayLength / 5 / this.scaleFactor;
  }

  ngOnChanges(changes: { [propName: string]: SimpleChange }) 
  {
    if (changes["trayWidth"] && (changes["trayWidth"].currentValue != changes["trayWidth"].previousValue))
      console.log("trayWidth changed");
    if (changes["trayLength"] && (changes["trayLength"].currentValue != changes["trayLength"].previousValue))
      console.log("trayLength changed");
    this.evaluateScaleFactor();
  }
}
