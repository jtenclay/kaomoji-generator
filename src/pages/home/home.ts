import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LibraryPage } from '../library/library';
import { Platform } from 'ionic-angular';

class Kao {
	face: string;
	color: string;
	shadowColor: string;
}

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

	screenWidth: number = 0;
	screenHeight: number = 0;
	fontSizeTesterDOM;
	fontSizeTester: string = "";

	currentKao: Kao = {
		face: ":)",
		color: "red",
		shadowColor: "yellow"
	}

	currentKaoDOM;

	libraryPage = LibraryPage;

  constructor(public navCtrl: NavController, public plt: Platform) {
  	this.screenWidth = plt.width()
  	this.screenHeight = plt.height()
  }

  ionViewDidLoad() {
    this.currentKaoDOM = document.getElementById('current-kao');
    this.fontSizeTesterDOM = document.getElementById('font-size-tester');
  	this.updateKaoDOM();
  }

  updateKao(attr, val) {
  	this.currentKao[attr] = val;
  	this.updateKaoDOM();
  }

  updateKaoDOM() {
  	this.currentKaoDOM.style.color = this.currentKao.color;
  }

  autoResizeKao() {
  	let currentFontSize = parseInt(window.getComputedStyle(this.currentKaoDOM, null).getPropertyValue('font-size'));
  	this.fontSizeTesterDOM.innerHTML = this.currentKao.face;
  	this.fontSizeTesterDOM.style.display = "inline-block";
  	let inputIsTooBig = () => {
  		let inputHeight = this.fontSizeTesterDOM.offsetHeight
  		let inputWidth = this.fontSizeTesterDOM.offsetWidth
  		if (inputHeight / this.screenHeight > .8 || inputWidth / this.screenWidth > .8) {
  			console.log("true")
  			return true;
  		} else {
  			console.log("false")
  			return false;
  		}
  	}
  	if (inputIsTooBig()) {
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

}
