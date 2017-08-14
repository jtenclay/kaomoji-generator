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
		patternId: -1,
		foregroundColor: "white",
		backgroundColor: "blue"
	}];

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
  		this.kaoIndexToSave++;
  	})
  }

  ionViewDidLoad() {
    this.currentKaoDOM = document.getElementById('current-kao');
    this.fontSizeTesterDOM = document.getElementById('font-size-tester');
    this.backgroundDOM = document.getElementById('kao-page');
  	this.updateKaoDOM();
  	this.autoResizeKao();
  }

  updateKao(attr, val) {
  	this.currentKao[attr] = val;
  	this.updateKaoDOM();
  }

  updateKaoDOM() {
  	this.currentKaoDOM.style.color = this.currentKao.color;
  	this.backgroundDOM.style.backgroundColor = this.currentKao.backgroundColor;
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
  	this.storage.set('currentKao' + this.kaoIndexToSave, this.currentKao);
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
