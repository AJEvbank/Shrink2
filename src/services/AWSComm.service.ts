import { HTTP, HTTPResponse } from '@ionic-native/http';
import { Injectable } from '@angular/core';

import { Accessor } from '../../../Accessor';
import { ItemRecord } from '../assets/models/item-record.model';


@Injectable()
export class AWSCommService {

  access = new Accessor();

  constructor(private http: HTTP) {

  }

  // Generic http request functions return Promise<HTTPResponse>.

  public put(functionURL: string, body: any) : Promise<HTTPResponse> {

    this.http.setDataSerializer("json");

    return this.http.put(this.access.base + functionURL, body, {});
  }

  private get(functionURL: string) : Promise<HTTPResponse> {
    return this.http.get(this.access.base + functionURL, {}, {});
  }


  // Specific requests return a Promise<(desired data type here)>.

  AWSgetupc(upc: string) : Promise<ItemRecord> {
    return this.get(this.access.upcFunction + upc)
    .then((response) => {
      let resJSON = JSON.parse(response.data);
      console.log("resJSON: " + JSON.stringify(resJSON));
      // if (resJSON.upcnumber != undefined) {
      //   console.log("Got valid record back from upcdatabase.org! ");
      //   return new ItemRecord(upc, resJSON.title, false);
      // }
      // else
      if(resJSON.Items.length > 0){
        console.log("Got valid record back!");
        return new ItemRecord(upc, resJSON.Items[0].name, resJSON.Items[0].highRisk);
      }else{
        console.log("Got empty record back!");
        return new ItemRecord(upc, "(Add New Item Name Here)");
      }
    })
    .catch((err) => {
      console.log("Caught error from get: " + JSON.stringify(err));
      return new ItemRecord(upc, " ");
    });
  }

  AWSupdateItemRecord(item: ItemRecord) : Promise<ItemRecord> {
    return this.put(this.access.updateItemRecordFunction + item.upc, {"name": item.name, "highRisk": item.isHighRisk})
    .then(
      (response) => {
        let resJSON = JSON.parse(response.data);
        console.log("Got the updated record back! " + JSON.stringify(response));
        console.log("resJSON.upc.upcId = " + JSON.stringify(resJSON.upc.upcId));
        if (resJSON.upc.upcId == undefined) {
          console.log("Backend shenanigans happened!");
          return new ItemRecord(item.upc, "EMPTY");
        }
        let updateItem = resJSON;
        if (item.upc != updateItem.upc.upcId) {
          console.log(item.upc + " != " + updateItem.upc.upcId + ": Something went horribly wrong!");
          return new ItemRecord(item.upc, "WRONG_UPC");
        } else {
          return new ItemRecord(updateItem.upc.upcId, updateItem.upc.name, updateItem.upc.highRisk);
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
