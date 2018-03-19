import { HTTP, HTTPResponse } from '@ionic-native/http';



import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';

import { Accessor } from '../../../Accessor';

import { ItemRecord } from '../assets/models/item-record.model';


@Injectable()
export class AWSCommService {

  access = new Accessor();

  constructor(private http: HTTP) {

  }

  // Generic http request functions return Promise<HTTPResponse>.

  private put(url: string, body: any) : Promise<HTTPResponse> {
    return this.http.put(url, body, {});
  }

  private get(parameter: string) : Promise<HTTPResponse> {
    return this.http.get(this.access.base + parameter, {}, {});
  }


  // Specific requests return a Promise<(desired data type here)>.

  AWSgetupc(upc: string) : Promise<ItemRecord> {
    return this.get(this.access.upcFunction + upc)
    .then((response) => {
      let resJSON = JSON.parse(response.data);
      console.log(resJSON);
      if(resJSON.Items.length > 0){
        console.log("Got valid record back!");
        return new ItemRecord(upc, resJSON.Items[0].name, 0, resJSON.Items[0].highRisk);
      }else{
        console.log("Got empty record back!");
        return new ItemRecord(upc, "EMPTY");
      }
    })
    .catch((err) => {
      console.log("JSON error: " + JSON.stringify(err));
      return new ItemRecord(upc, " ");
    });
  }

  AWSupdateItemRecord(item: ItemRecord) : Promise<ItemRecord> {
    return this.put(this.access.updateItemRecordFunction + item.upc, {name: item.name, highRisk: item.isHighRisk})
    .then(
      (response) => {
        let resJSON = JSON.parse(response.data);
        console.log("Got the updated record back! " + JSON.stringify(response));
        if (resJSON.upc == undefined) {
          console.log("Backend shenanigans happened!");
          return new ItemRecord(item.upc, "EMPTY");
        }
        let updateItem = resJSON.upc;
        if (item.upc != updateItem.upcid) {
          console.log(item.upc + " != " + updateItem.upcid + ": Something went horribly wrong!");
          return new ItemRecord(item.upc, "WRONG_UPC");
        } else {
          return new ItemRecord(updateItem.upc, updateItem.name, 0, updateItem.highRisk);
        }
      }
    )
    .catch(
      (err) => {
        console.log("Error on http request: " + JSON.stringify(err));
        return new ItemRecord(item.upc, " ");
      }
    )
  }


}
