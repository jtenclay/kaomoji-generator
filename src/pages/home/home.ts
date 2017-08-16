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

	currentKao: Kao = new Kao();
	uneditedKao: Kao = new Kao();
	currentKaoUsesPattern = false;
	uneditedKaoUsesPattern = false;

	stockKaos: Kao[] = [
		{
			id: 0,
			face: "U・ᴥ・U",
			color: "maroon",
			shadowColor: "brown",
			shadowLength: 5,
			patternId: 0,
			foregroundColor: "white",
			backgroundColor: "beige"
		}, {
			id: 0,
			face: "  (=`ω´=)  ",
			color: "aquamarine",
			shadowColor: "white",
			shadowLength: 0,
			patternId: -1,
			foregroundColor: "white",
			backgroundColor: "steelblue"
		}, {
			id: 0,
			face: "(✿◕‿◕)",
			color: "coral",
			shadowColor: "white",
			shadowLength: 0,
			patternId: -1,
			foregroundColor: "white",
			backgroundColor: "moccasin"
		}, {
			id: 0,
			face: "(●´ω｀●)",
			color: "navy",
			shadowColor: "white",
			shadowLength: 5,
			patternId: 0,
			foregroundColor: "beige",
			backgroundColor: "moccasin"
		}, {
			id: 0,
			face: "✌︎('ω'✌︎ )",
			color: "white",
			shadowColor: "white",
			shadowLength: 0,
			patternId: 2,
			foregroundColor: "#6CA0FF",
			backgroundColor: "cornflowerblue"
		}, {
			id: 0,
			face: "(｀_´)ゞ",
			color: "orchid",
			shadowColor: "white",
			shadowLength: 0,
			patternId: 4,
			foregroundColor: "purple",
			backgroundColor: "blueviolet"
		}];

	// "~~~" is the placeholder for the foreground color
	backgroundDefs: string[] = ["url(\"data:image/svg+xml,%3Csvg width='12' height='16' viewBox='0 0 12 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4 .99C4 .445 4.444 0 5 0c.552 0 1 .45 1 .99v4.02C6 5.555 5.556 6 5 6c-.552 0-1-.45-1-.99V.99zm6 8c0-.546.444-.99 1-.99.552 0 1 .45 1 .99v4.02c0 .546-.444.99-1 .99-.5 52 0-1-.45-1-.99V8.99z' fill='~~~' fill-rule='evenodd'/%3E%3C/svg%3E\")", "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='~~~' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")", "url(\"data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='~~~' fill-opacity='1'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")", "url(\"data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='~~~' fill-opacity='1'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10zm10 8c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm40 40c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")", "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3E%3Cg fill='~~~' fill-opacity='1'%3E%3Cpath fill-rule='evenodd' d='M0 0h4v4H0V0zm4 4h4v4H4V4z'/%3E%3C/g%3E%3C/svg%3E\")", "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='34' height='44' viewBox='0 0 34 44'%3E%3Cg fill='~~~' fill-opacity='1'%3E%3Cpath fill-rule='evenodd' d='M1 6.2C.72 5.55.38 4.94 0 4.36v13.28c.38-.58.72-1.2 1-1.84A12.04 12.04 0 0 0 7.2 22 12.04 12.04 0 0 0 1 28.2c-.28-.65-.62-1.26-1-1.84v13.28c.38-.58.72-1.2 1-1.84A12.04 12.04 0 0 0 7.2 44h21.6a12.05 12.05 0 0 0 5.2-4.36V26.36A12.05 12.05 0 0 0 28.8 22a12.05 12.05 0 0 0 5.2-4.36V4.36A12.05 12.05 0 0 0 28.8 0H7.2A12.04 12.04 0 0 0 1 6.2zM17.36 23H12a10 10 0 1 0 0 20h5.36a11.99 11.99 0 0 1 0-20zm1.28-2H24a10 10 0 1 0 0-20h-5.36a11.99 11.99 0 0 1 0 20zM12 1a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-3.46-2a2 2 0 1 0-3.47 2 2 2 0 0 0 3.47-2zm0-4a2 2 0 1 0-3.47-2 2 2 0 0 0 3.47 2zM12 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm3.46 2a2 2 0 1 0 3.47-2 2 2 0 0 0-3.47 2zm0 4a2 2 0 1 0 3.47 2 2 2 0 0 0-3.47-2zM24 43a10 10 0 1 0 0-20 10 10 0 0 0 0 20zm0-14a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm3.46 2a2 2 0 1 0 3.47-2 2 2 0 0 0-3.47 2zm0 4a2 2 0 1 0 3.47 2 2 2 0 0 0-3.47-2zM24 37a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-3.46-2a2 2 0 1 0-3.47 2 2 2 0 0 0 3.47-2zm0-4a2 2 0 1 0-3.47-2 2 2 0 0 0 3.47 2z'/%3E%3C/g%3E%3C/svg%3E\")", "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='32' viewBox='0 0 16 32'%3E%3Cg fill='~~~' fill-opacity='1'%3E%3Cpath fill-rule='evenodd' d='M0 24h4v2H0v-2zm0 4h6v2H0v-2zm0-8h2v2H0v-2zM0 0h4v2H0V0zm0 4h2v2H0V4zm16 20h-6v2h6v-2zm0 4H8v2h8v-2zm0-8h-4v2h4v-2zm0-20h-6v2h6V0zm0 4h-4v2h4V4zm-2 12h2v2h-2v-2zm0-8h2v2h-2V8zM2 8h10v2H2V8zm0 8h10v2H2v-2zm-2-4h14v2H0v-2zm4-8h6v2H4V4zm0 16h6v2H4v-2zM6 0h2v2H6V0zm0 24h2v2H6v-2z'/%3E%3C/g%3E%3C/svg%3E\")"]

	currentKaoDOM;
	backgroundDOM;
	kaoIndexToSave: number = 0;

	showHiddenMenuFlag: boolean = false;
	showMainMenuFlag: boolean = true;
	showEditMenuFlag: boolean = false;
	showColorMenuFlag: boolean = false;
	showShadowMenuFlag: boolean = false;
	showBackgroundMenuFlag: boolean = false;
	showPatternMenuFlag: boolean = false;

	listPage = ListPage;

  constructor(public navCtrl: NavController, public plt: Platform, private storage: Storage, public keyboard: Keyboard) {
  	this.screenWidth = plt.width()
  	this.screenHeight = plt.height()
	  this.storage.forEach((val, key, i) => {
	  	if (key.match(/savedKao[1234567890]/)) {
	  		if (val.id >= this.kaoIndexToSave) {
	  			this.kaoIndexToSave = val.id + 1;
	  		}
	  	}
  	});
  }

  ionViewDidLoad() {
  	// after optimizing first launch to wait until this is loaded, take it out and only leave the one in ionViewWillEnter since it's redundant
  	this.storage.get("currentKao").then((result) => {
  		if (result.face) {
  			this.currentKao = result;
  			if (this.currentKao.patternId !== -1) {
  				this.currentKaoUsesPattern = true;
  			}
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

  // unused???
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
  	} else {
  		this.backgroundDOM.style.backgroundImage = "none";
  	}
  	this.autoResizeKao();
  }

  autoResizeKao() {
  	let currentFontSize = parseInt(window.getComputedStyle(this.currentKaoDOM, null).getPropertyValue('font-size'));
  	// replace spaces with nbsp so they're not condensed
  	this.fontSizeTesterDOM.innerHTML = this.currentKao.face.replace(/ /g, "\xa0");
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
  	let savedDOM = document.getElementById("saved-modal");
  	this.currentKao.id = this.kaoIndexToSave;
  	this.storage.set('savedKao' + this.kaoIndexToSave, this.currentKao);
  	this.kaoIndexToSave++
  	savedDOM.className = "active";
  	// reset after a little bit
  	setTimeout(function() {
		  savedDOM.className = "";
		}, 1000);
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

  toggleColorMenu() {
  	this.uneditedKao.color = this.currentKao.color;
  	this.updateKaoDOM();
  	this.showColorMenuFlag = !this.showColorMenuFlag;
  	this.showEditMenuFlag = !this.showEditMenuFlag;
  }

  cancelColorMenu() {
  	this.currentKao.color = this.uneditedKao.color;
  	this.updateKaoDOM();
  	this.showColorMenuFlag = !this.showColorMenuFlag;
  	this.showEditMenuFlag = !this.showEditMenuFlag;
  }

  toggleShadowMenu() {
  	this.uneditedKao.shadowColor = this.currentKao.shadowColor;
  	this.uneditedKao.shadowLength = this.currentKao.shadowLength;
  	this.updateKaoDOM();
  	this.showShadowMenuFlag = !this.showShadowMenuFlag;
  	this.showEditMenuFlag = !this.showEditMenuFlag;
  }

  cancelShadowMenu() {
  	this.currentKao.shadowColor = this.uneditedKao.shadowColor;
  	this.currentKao.shadowLength = this.uneditedKao.shadowLength;
  	this.updateKaoDOM();
  	this.showShadowMenuFlag = !this.showShadowMenuFlag;
  	this.showEditMenuFlag = !this.showEditMenuFlag;
  }

  toggleBackgroundMenu() {
  	this.uneditedKao.backgroundColor = this.currentKao.backgroundColor;
  	this.updateKaoDOM();
  	this.showBackgroundMenuFlag = !this.showBackgroundMenuFlag;
  	this.showEditMenuFlag = !this.showEditMenuFlag;
  }

  cancelBackgroundMenu() {
  	this.currentKao.backgroundColor = this.uneditedKao.backgroundColor;
  	this.updateKaoDOM();
  	this.showBackgroundMenuFlag = !this.showBackgroundMenuFlag;
  	this.showEditMenuFlag = !this.showEditMenuFlag;
  }

  togglePatternMenu() {
  	this.uneditedKao.foregroundColor = this.currentKao.foregroundColor;
  	this.uneditedKao.patternId = this.currentKao.patternId;
  	this.uneditedKaoUsesPattern = this.currentKaoUsesPattern;
  	this.updateUsesPattern();
  	this.updateKaoDOM();
  	this.showPatternMenuFlag = !this.showPatternMenuFlag;
  	this.showEditMenuFlag = !this.showEditMenuFlag;
  }

  cancelPatternMenu() {
  	this.currentKao.foregroundColor = this.uneditedKao.foregroundColor;
  	this.currentKao.patternId = this.uneditedKao.patternId;
  	this.currentKaoUsesPattern = this.uneditedKaoUsesPattern;
  	this.updateUsesPattern();
  	this.updateKaoDOM();
  	this.showPatternMenuFlag = !this.showPatternMenuFlag;
  	this.showEditMenuFlag = !this.showEditMenuFlag;
  }

  updateUsesPattern() {
  	if (this.currentKaoUsesPattern === false) {
  		this.currentKao.patternId = -1;
  	} else if (this.currentKao.patternId === -1) {
  		this.currentKao.patternId = 0;
  	};
  	this.updateKaoDOM();
  }

}
