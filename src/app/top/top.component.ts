import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-top',
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.sass']
})
export class TopComponent implements OnInit {

  @Output() sendReportType = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  setReportType(type:string) {
    this.sendReportType.emit(type);
  }

}
