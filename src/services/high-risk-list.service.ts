import { Storage } from '@ionic/storage';
import { File } from '@ionic-native/file';

import { HighRiskItem } from '../assets/models/high-risk-item.model';



export class HighRiskListService {

  highRiskList: HighRiskItem [];

  constructor(private storage: Storage,
              private file: File) {}

  

}
