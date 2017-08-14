import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Platform } from 'ionic-angular';
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
	shadowLength: number;
	patternId: number; // to use background color instead of pattern, set patternId = -1
	foregroundColor: string; // only used in patterns
	backgroundColor: string;
}

@IonicPage()
@Component({
  selector: 'page-list',
  templateUrl: 'list.html',
})
export class ListPage {

	screenWidth: number = 0;
	screenHeight: number = 0;
	screenAspect: number = 0;
	kaoListHeight: number = 0;

	loadedKaos: Kao[];

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, public plt: Platform) {
  	this.screenWidth = plt.width()
  	this.screenHeight = plt.height()
  	this.screenAspect = this.screenWidth/this.screenHeight;
  	this.kaoListHeight = (this.screenWidth - 96) / 2 / this.screenAspect;
  	let arrayOfKaos: Kao[] = [];
  	this.storage.forEach(function(val, key, i) {
  		if (key.match(/savedKao[1234567890]/)) {
	  		arrayOfKaos.push(val)
	  	}
  	})
  	this.loadedKaos = arrayOfKaos;
  }

  ionViewDidLoad() {
    // set list heights using the screen aspect. I would have liked to loop through each li and use li.style.height but they had trouble rendering in time for the query call. the height is dynamic based on a variable here, so I couldn't write it directly into the scss.
    let styleTag = document.createElement("style");
    styleTag.textContent = "li.kao-li {height: " + this.kaoListHeight + "px;}";
    document.body.appendChild(styleTag);
  }

  passKaoAndReturn(kao) {
  	this.storage.set("currentKao", kao);
  	this.navCtrl.pop();
  }

}
