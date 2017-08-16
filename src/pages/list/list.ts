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
	kaoListWidth: number = 0;
	kaoListHeight: number = 0;

	loadedKaos: Kao[];

	currentlyEditingFlag: boolean = false;

	// "~~~" is the placeholder for the foreground color
	backgroundDefs: string[] = ["url(\"data:image/svg+xml,%3Csvg width='12' height='16' viewBox='0 0 12 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4 .99C4 .445 4.444 0 5 0c.552 0 1 .45 1 .99v4.02C6 5.555 5.556 6 5 6c-.552 0-1-.45-1-.99V.99zm6 8c0-.546.444-.99 1-.99.552 0 1 .45 1 .99v4.02c0 .546-.444.99-1 .99-.552 0-1-.45-1-.99V8.99z' fill='~~~' fill-rule='evenodd'/%3E%3C/svg%3E\")"]

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, public plt: Platform) {
  	this.screenWidth = plt.width()
  	this.screenHeight = plt.height()
  	this.screenAspect = this.screenWidth/this.screenHeight;
  	this.kaoListWidth = (this.screenWidth - 96) / 2;
  	this.kaoListHeight = (this.screenWidth - 96) / 2 / this.screenAspect;
  	let arrayOfKaos: Kao[] = [];
  	this.storage.forEach(function(val, key, i) {
  		// check backgroundColor to make sure it's not an empty kao somehow
  		if (key.match(/savedKao[1234567890]/) && val.backgroundColor) {
	  		arrayOfKaos.push(val)
	  		// reverse-sort kaos by id to make sure newest is first. unfortunately outside the loop was too late to update DOM order
	  		arrayOfKaos.sort(function(a, b) {
		  		return b.id - a.id;
		  	})
	  	}
  	})
  	this.loadedKaos = arrayOfKaos;
  }

  ionViewDidEnter() {
    for (let kao of this.loadedKaos) {
    	this.updateKaoListDOM(kao.id)
    }
  }

  updateKaoListDOM(kaoId) {
  	let kao = this.loadedKaos.find(x => x.id === kaoId);
  	let kaoBackgroundDOM = document.getElementById("kao-" + kaoId).querySelector("div");
  	let kaoDOM = kaoBackgroundDOM.querySelector("span");
  	let textShadow = "";
  	kaoBackgroundDOM.style.height = this.kaoListHeight + "px";
  	for (let i = 1; i <= kao.shadowLength / 2; i++) { // shadow / 2 because it's half as big
  		textShadow += i + "px " + i + "px 0 " + kao.shadowColor + ", ";
  	}
  	// remove trailing comma and set textShadow
  	kaoDOM.style.textShadow = textShadow.substring(0, textShadow.length - 2);
  	kaoDOM.style.color = kao.color;
		kaoBackgroundDOM.style.backgroundColor = kao.backgroundColor;
  	if (kao.patternId >= 0 && kao.patternId < this.backgroundDefs.length) {
  		// format background SVG and then set it
  		kaoBackgroundDOM.style.backgroundImage = this.backgroundDefs[kao.patternId].replace(/~~~/, kao.foregroundColor);
  	} else {
  		kaoBackgroundDOM.style.backgroundImage = "none";
  	}
  	this.autoResizeKao(kao, kaoDOM);
  }

  autoResizeKao(kao, kaoDOM) {
  	let currentFontSize = parseInt(window.getComputedStyle(kaoDOM, null).getPropertyValue('font-size'));
  	let fontSizeTesterDOM = document.createElement("span");
  	// replace spaces with nbsp so they're not condensed
  	fontSizeTesterDOM.textContent = kao.face.replace(/ /g, "\xa0");
  	fontSizeTesterDOM.style.display = "inline-block";
  	document.body.appendChild(fontSizeTesterDOM);
  	let inputIsTooBig = () => {
  		let inputHeight = fontSizeTesterDOM.offsetHeight
  		let inputWidth = fontSizeTesterDOM.offsetWidth
  		// go back to try to optimize this since it runs so much
  		if (inputHeight / this.kaoListHeight > .5 || inputWidth / this.kaoListWidth > .7) {
  			return true;
  		} else {
  			return false;
  		}
  	}
  	if (kao.face.length == 0) {

  	} else if (inputIsTooBig()) {
  		while (inputIsTooBig()) {
  			fontSizeTesterDOM.style.fontSize = kaoDOM.style.fontSize = (currentFontSize - 1) + "px";
  			currentFontSize = parseInt(window.getComputedStyle(kaoDOM, null).getPropertyValue('font-size'));
  		}
  	} else {
  		while (!inputIsTooBig()) {
  			fontSizeTesterDOM.style.fontSize = kaoDOM.style.fontSize = (currentFontSize + 1) + "px";
  			currentFontSize = parseInt(window.getComputedStyle(kaoDOM, null).getPropertyValue('font-size'));
  		}
  		fontSizeTesterDOM.style.fontSize = kaoDOM.style.fontSize = (currentFontSize - 1) + "px"
  		currentFontSize = parseInt(window.getComputedStyle(kaoDOM, null).getPropertyValue('font-size'));
  	}
  	document.body.removeChild(fontSizeTesterDOM);
  }

  passKaoAndReturn(kao) {
  	this.storage.set("currentKao", kao);
  	this.navCtrl.pop();
  }

  toggleEditState() {
  	this.currentlyEditingFlag = !this.currentlyEditingFlag;
  }

  deleteKao(kao) {
  	let kaoLiDOM = document.getElementById("kao-" + kao.id);
  	let kaoUlDOM = document.getElementById("kao-ul");
  	this.storage.remove("savedKao" + kao.id);
  	kaoUlDOM.removeChild(kaoLiDOM);
  }

}
