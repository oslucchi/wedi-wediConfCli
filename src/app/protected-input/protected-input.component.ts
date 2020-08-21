import { Component, OnInit, Output, Input, EventEmitter } from "@angular/core";

const messages = {
  valueTooHigh: "Il valore supera il limite massimo",
  valueTooLow: "Il valore e' sotto al limite minimo"
};

@Component({
  selector: "app-protected-input",
  templateUrl: "./protected-input.component.html",
  styleUrls: ["./protected-input.component.css"],
  providers: []
})
export class ProtectedInputComponent {
  @Input() protectedInput: number;
  @Input() inputLabel: string;
  @Input() maxLength: number;
  @Input() minVal: number;
  @Input() maxVal: number;

  @Output() protectedOutput: EventEmitter<number> = new EventEmitter<number>();

  onBlur() {
    if (this.protectedInput > this.maxVal) {
      this.protectedOutput.emit(this.maxVal);
      this.protectedInput = this.maxVal;
      alert(messages.valueTooHigh);
    } else if (this.protectedInput < this.minVal) {
      this.protectedOutput.emit(this.minVal);
      this.protectedInput = this.minVal;
      alert(messages.valueTooLow);
    } else {
      this.protectedOutput.emit(this.protectedInput);
    }
  }
}
