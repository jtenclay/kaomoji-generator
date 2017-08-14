import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the ListPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

class Kao {
	id: number;
	face: string;
	color: string;
	shadowColor: string;
	backgroundColor: string;
}

@IonicPage()
@Component({
  selector: 'page-list',
  templateUrl: 'list.html',
})
export class ListPage {

	loadedKaos: Kao[] = [{id: 0, face: "", shadowColor: "", backgroundColor: "", color: ""}];

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage) {
  	let arrayOfKaos: Kao[] = [];
  	this.storage.forEach(function(val, key, i) {
  		arrayOfKaos.push(val)
  	})
  	this.loadedKaos = arrayOfKaos;
  }

  ionViewDidLoad() {
    
  }

}
