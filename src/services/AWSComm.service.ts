import {Http, RequestOptions, Headers, Response} from '@angular/http'
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

  put(url: string, body: any) : Observable<Response> {
    let options = new RequestOptions();
    return this.http.put(url, body, options).map(res=>res.json());
  }

  get(parameter: string) : Observable<Response> {
    let options = new RequestOptions();
    return this.http.get(this.access.base + parameter, options);
  }

  AWSgetupc(upc: string) : Promise<ItemRecord> {
    return this.get(this.access.upcFunction + upc).map((response) => {
      let resJSON = response.json();
      if(resJSON.Items.length > 0){
        return new ItemRecord(upc, resJSON.Items[0].name, 0, resJSON.Items[0].highRisk);
      }else{
        return new ItemRecord(upc, " ");
      }
    }).toPromise<ItemRecord>();
  }

  // put(args).subscribe(
  //   function(response)/onsuccess,
  //   function(error)/onerror
  // );


}
