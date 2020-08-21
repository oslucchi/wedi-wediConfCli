import { Component, Input } from "@angular/core";

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

}
