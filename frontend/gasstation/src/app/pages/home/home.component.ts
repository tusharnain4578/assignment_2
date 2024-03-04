import { Component, OnInit } from '@angular/core';
import { StationsService } from '../../service/gasstations.service';
import { IStation, ResponseModel } from '../../models/Station';
import { error } from 'console';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  stationList: IStation[] = [];
  constructor(private stationsrv: StationsService) {}

  ngOnInit(): void {}

  loadStations() {
    this.stationsrv.getAllStations().subscribe(
      (res: ResponseModel) => {
        this.stationList = res.stations;
      },
      (error) => {
        alert('Error loading stations' + JSON.stringify(error));
      }
    );
  }
}
