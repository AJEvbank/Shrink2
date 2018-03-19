import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';

import { Accessor } from '../../../Accessor';

import { ItemRecord } from '../assets/models/item-record.model';


@Injectable()
export class AWSCommBrowserService {

  access = new Accessor();

  constructor(private http: Http) {

  }

  // Generic http request functions return Promise<HTTPResponse>.

  private put(url: string, body: any) : Observable<Response> {
    return this.http.put(url, body);
  }

  private get(parameter: string) : Observable<Response> {
    return this.http.get(this.access.base + parameter);
  }


  // Specific requests return a Promise<(desired data type here)>.

  AWSgetupc(upc: string) : Promise<ItemRecord> {
    return this.get(this.access.upcFunction + upc).map((response) => {
      let resJSON = response.json();
      //console.log(resJSON);
      if(resJSON.Items.length > 0){
        //console.log("Got valid record back!");
        return new ItemRecord(upc, resJSON.Items[0].name, 0, resJSON.Items[0].highRisk);
      }else{
        //console.log("Got empty record back!");
        return new ItemRecord(upc, " ");
      }
    }).toPromise<ItemRecord>();
  }

  AWSupdateItemRecord(item: ItemRecord) : Promise<ItemRecord> {
    return this.put(this.access.updateItemRecordFunction, {name: item.name, highRisk: item.isHighRisk})
    .map((response) => {
      let resJSON = response.json();
      if(resJSON.upc == undefined){
        console.log("Something is REALLY wrong!\n" + resJSON);
        return new ItemRecord(item.upc, "ERROR");
      }
      else{
        let updateItem = resJSON.upc;
        return new ItemRecord(updateItem.upcid, updateItem.name, 0, updateItem.highRisk);
      }
    }).toPromise<ItemRecord>();
  }


}
