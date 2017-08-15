import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { ListPage } from '../list/list';
import { Storage } from '@ionic/storage';
import { Keyboard } from '@ionic-native/keyboard';

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

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [Keyboard]
})
export class HomePage {

	screenWidth: number = 0;
	screenHeight: number = 0;
	fontSizeTesterDOM;
	fontSizeTester: string = "";

	currentKao: Kao = {
		id: 0,
		face: "(✿◕‿◕)",
		color: "orange",
		shadowColor: "yellow",
		shadowLength: 0,
		patternId: -1,
		foregroundColor: "white",
		backgroundColor: "#c0ffee"
	}

	stockKaos: Kao[] = [{
		id: 1000001,
		face: "U・ᴥ・U",
		color: "brown",
		shadowColor: "red",
		shadowLength: 5,
		patternId: -1,
		foregroundColor: "white",
		backgroundColor: "beige"
	}, {
		id: 1000002,
		face: "/ᐠ.ꞈ.ᐟ\\",
		color: "cyan",
		shadowColor: "white",
		shadowLength: 15,
		patternId: 0,
		foregroundColor: "white",
		backgroundColor: "blue"
	}];

	// "~~~" is the placeholder for the foreground color
	backgroundDefs: string[] = ["url(\"data:image/svg+xml,%3Csvg width='12' height='16' viewBox='0 0 12 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4 .99C4 .445 4.444 0 5 0c.552 0 1 .45 1 .99v4.02C6 5.555 5.556 6 5 6c-.552 0-1-.45-1-.99V.99zm6 8c0-.546.444-.99 1-.99.552 0 1 .45 1 .99v4.02c0 .546-.444.99-1 .99-.552 0-1-.45-1-.99V8.99z' fill='~~~' fill-rule='evenodd'/%3E%3C/svg%3E\")"]

	currentKaoDOM;
	backgroundDOM;
	kaoIndexToSave: number = 0;

	showHiddenMenuFlag: boolean = false;
	showMainMenuFlag: boolean = true;
	showEditMenuFlag: boolean = false;

	listPage = ListPage;

  constructor(public navCtrl: NavController, public plt: Platform, private storage: Storage, public keyboard: Keyboard) {
  	this.screenWidth = plt.width()
  	this.screenHeight = plt.height()
	  this.storage.forEach((val, key, i) => {
	  	if (key.match(/savedKao[1234567890]/)) {
	  		this.kaoIndexToSave++;
	  	}
  	});
  }

  ionViewDidLoad() {
  	// after optimizing first launch to wait until this is loaded, take it out and only leave the one in ionViewWillEnter since it's redundant
  	this.storage.get("currentKao").then((result) => {
  		if (result.face) {
  			this.currentKao = result;
  			this.updateKaoDOM();
  			this.autoResizeKao();
  		}
  	})
    this.currentKaoDOM = document.getElementById('current-kao');
    this.fontSizeTesterDOM = document.getElementById('font-size-tester');
    this.backgroundDOM = document.getElementById('kao-page');
  }

  ionViewWillEnter() {
  	this.storage.get("currentKao").then((result) => {
  		if (result.face) {
  			this.currentKao = result
  			this.updateKaoDOM();
  			this.autoResizeKao();
  		}
  	})
  }

  navigateToList() {
  	this.storage.set("currentKao", this.currentKao)
  	this.navCtrl.push(this.listPage);
  }

  updateKao(attr, val) {
  	this.currentKao[attr] = val;
  	this.updateKaoDOM();
  }

  updateKaoDOM() {
  	let textShadow = "";
  	for (let i = 1; i <= this.currentKao.shadowLength; i++) {
  		// add a shadow for each pixel to create a longshadow; animate later
  		textShadow += i + "px " + i + "px 0 " + this.currentKao.shadowColor + ", ";
  	}
  	// remove trailing comma and set textShadow
  	this.currentKaoDOM.style.textShadow = textShadow.substring(0, textShadow.length - 2);
  	this.currentKaoDOM.style.color = this.currentKao.color;
		this.backgroundDOM.style.backgroundColor = this.currentKao.backgroundColor;
  	if (this.currentKao.patternId !== -1) {
  		// format background SVG and then set it
  		this.backgroundDOM.style.backgroundImage = this.backgroundDefs[this.currentKao.patternId].replace(/~~~/, this.currentKao.foregroundColor);
  	}
  	this.autoResizeKao();
  }

  autoResizeKao() {
  	let currentFontSize = parseInt(window.getComputedStyle(this.currentKaoDOM, null).getPropertyValue('font-size'));
  	this.fontSizeTesterDOM.innerHTML = this.currentKao.face;
  	this.fontSizeTesterDOM.style.display = "inline-block";
  	let inputIsTooBig = () => {
  		let inputHeight = this.fontSizeTesterDOM.offsetHeight
  		let inputWidth = this.fontSizeTesterDOM.offsetWidth
  		// go back to try to optimize this since it runs so much
  		if (inputHeight / this.screenHeight > .5 || inputWidth / this.screenWidth > .7) {
  			return true;
  		} else {
  			return false;
  		}
  	}
  	if (this.currentKao.face.length == 0) {

  	} else if (inputIsTooBig()) {
  		while (inputIsTooBig()) {
  			this.fontSizeTesterDOM.style.fontSize = this.currentKaoDOM.style.fontSize = (currentFontSize - 1) + "px";
  			currentFontSize = parseInt(window.getComputedStyle(this.currentKaoDOM, null).getPropertyValue('font-size'));
  		}
  	} else {
  		while (!inputIsTooBig()) {
  			this.fontSizeTesterDOM.style.fontSize = this.currentKaoDOM.style.fontSize = (currentFontSize + 1) + "px";
  			currentFontSize = parseInt(window.getComputedStyle(this.currentKaoDOM, null).getPropertyValue('font-size'));
  		}
  		this.fontSizeTesterDOM.style.fontSize = this.currentKaoDOM.style.fontSize = (currentFontSize - 1) + "px"
  		currentFontSize = parseInt(window.getComputedStyle(this.currentKaoDOM, null).getPropertyValue('font-size'));
  	}
  	this.fontSizeTesterDOM.style.display = "none";
  }

  saveCurrentKao() {
  	this.currentKao.id = this.kaoIndexToSave;
  	this.storage.set('savedKao' + this.kaoIndexToSave, this.currentKao);
  	this.kaoIndexToSave++
  }

  randomKao() {
  	let rand = Math.floor(Math.random() * this.stockKaos.length);
  	this.currentKao = this.stockKaos[rand];
  	this.updateKaoDOM();
  }

  toggleMainMenu() {
  	this.showHiddenMenuFlag = !this.showHiddenMenuFlag;
  	this.showMainMenuFlag = !this.showMainMenuFlag;
  }

  toggleEditMenu() {
  	this.showMainMenuFlag = !this.showMainMenuFlag;
  	this.showEditMenuFlag = !this.showEditMenuFlag;
  }

}
