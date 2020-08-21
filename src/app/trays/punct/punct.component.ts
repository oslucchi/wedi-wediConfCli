import { Component, OnInit, Input, OnChanges } from "@angular/core";
import { SvgPolygonModule } from "angular-svg";

@Component({
  selector: "app-punct",
  templateUrl: "./punct.component.html",
  styleUrls: ["./punct.component.css"]
})
export class PunctComponent implements OnChanges {
  @Input() width: number;
  @Input() length: number;
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
    this.drainX = this.trayX + (this.width - 25) / 2;
    this.drainY = this.trayY + (this.length - 25) / 2;
    this.gridX = this.drainX + 1;
    this.gridY = this.drainY + 1;
    this.viewBox =
      "" + this.trayX + " " + this.trayY + " " + this.width + " " + this.length;
  }
}
