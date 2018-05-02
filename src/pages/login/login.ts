import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { MainPage } from '..//main/main';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  mainPage = MainPage;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }
  
}
