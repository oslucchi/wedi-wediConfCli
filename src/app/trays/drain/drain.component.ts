import { Component, Input, OnChanges } from "@angular/core";
import { SvgPolygonModule } from "angular-svg";

@Component({
  selector: "app-drain",
  templateUrl: "./drain.component.html",
  styleUrls: ["./drain.component.css"]
})
export class DrainComponent implements OnChanges {
  @Input()
  width: number;
  @Input()
  length: number;

  public trayX = 0;
  public trayY = 0;
  public gridLength: number;
  public drainLength: number;
  public drainX: number;
  public drainY: number;
  public gridX: number;
  public gridY: number;
  public viewBox: string;

  ngOnChanges() {
    this.drainLength = (this.width - 10) / 2;
    if (this.drainLength > 220) {
      this.drainLength = 220;
    } else if (this.drainLength > 180) {
      this.drainLength = 180;
    } else if (this.drainLength > 160) {
      this.drainLength = 160;
    } else {
      this.drainLength = 140;
    }

    this.gridLength = this.drainLength - 2;
    this.drainX = this.trayX + (this.width - this.drainLength) / 2;
    this.drainY = this.trayY + 10;
    this.gridX = this.drainX + 1;
    this.gridY = this.drainY + 1;
    this.viewBox =
      this.trayX + " " + this.trayY + " " + this.width + " " + this.length;
  }
}
