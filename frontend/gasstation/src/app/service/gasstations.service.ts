import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { constants } from '../constant/constants';
import { Observable } from 'rxjs';
import { IStation, ResponseModel } from '../models/Station';

@Injectable({
  providedIn: 'root'
})
export class StationsService {
  // apiEndPoint:string='environment.ApiEndPoint'
  url:string= 'https://indianrailways.p.rapidapi.com/'
  header=new HttpHeaders({
    'X-RapidAPI-Key': '840ba101ecmsh4401bcdcdc8d00dp1dab5ajsn95257241f7bd',
    'X-RapidAPI-Host': 'indianrailways.p.rapidapi.com'
  })
  constructor(private http:HttpClient) { 
    // this.apiEndPoint=environment.ApiEndPoint
  }

  getAllStations(): Observable<ResponseModel>{
    return this.http.get<ResponseModel>(this.url + constants.ENDPOINTS.GET_ALL_STATION,{headers : this.header});
  }
}
