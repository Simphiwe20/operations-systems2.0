import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ApiServicesService {
 
  baseUrl: any = environment.nodeUrl

  constructor(private http: HttpClient) { 
  }

  genericGetAPI(endpoint: string) {
    return this.http.get(`${this.baseUrl}${endpoint}`)
  }

  genericPostAPI(endpoint:string, payload: any) {
    return this.http.post(`${this.baseUrl}${endpoint}`, payload)
  }

  genericUpdateAPI(endpoint: string, payload: any) {
    console.log('URL: ', `${this.baseUrl}${endpoint}`)
    return this.http.put(`${this.baseUrl}${endpoint}`, payload)
  }
}