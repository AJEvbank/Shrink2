import {Http, RequestOptions, Headers} from '@angular/http'
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';

import { Accessor } from '../../../Accessor';

import { ItemRecord } from '../assets/models/item-record.model';


@Injectable()
export class AWSCommService {

  access = new Accessor();

  constructor(private http: Http) {

  }

  // createRequestOptions() : RequestOptions {
  //   var options = new RequestOptions();
  //   options.headers = new Headers();
  //   options.headers.append('Content-Type', 'application/json');
  //   options.headers.append('Content-Type', 'application/json');
  //   return options;
  // }

  put(url: string, body: any) : Observable<any> {
    let options = new RequestOptions();
    return this.http.put(url, body, options).map(res=>res.json());
  }

  get(parameter: string) : Observable<any> {
    let options = new RequestOptions();
    return this.http.get(this.access.base + parameter, options);//.map(res=>res.json());
  }

  AWSgetupc(upc: string) : Observable<any> {
    return this.get(this.access.upcFunction + upc).map((response) => {
      let resJSON = response.json();
      return new ItemRecord(resJSON.Items[0].upcid,resJSON.Items[0].name,0,resJSON.Items[0].highRisk);
    });
  }

  // put(args).subscribe(
  //   function(response)/onsuccess,
  //   function(error)/onerror
  // );


}
