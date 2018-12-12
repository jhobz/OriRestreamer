import { Component, OnInit } from '@angular/core';
import { Information } from '../services/information';
import { environment } from '../../environments/environment';
import io from 'socket.io-client';
import * as $ from 'jquery';
import * as moment from 'moment';

@Component({
	templateUrl: './credits.html',
	styleUrls: ['./credits.css']
})

export class CreditsComponent implements OnInit {
	constructor() { }

	ngOnInit() {
		this.getNextMatch();
		this.socket.on('data', function(data: Information) {
			this.getNextMatch();
		}.bind(this));
	}

	getNextMatch() {
		$.ajax({
			url: 'https://sheets.googleapis.com/v4/spreadsheets/1getUmipiBxUTIyPdyW-9JkMPBnfeKHGAxgogWYjfg8k/values/Schedule Responses!'
				+ 'A2:M306?key=AIzaSyDoT4WSyHDf4a1D0qc6lhdySl92d0tXVG0',
			dataType: 'json',
			error: function(response) { },
			success: function( response: any ) {
				let matchFound = false;

				response.values.forEach(function(match) {
					if (matchFound === true) {
						return;
					}
					if (match[12] === undefined) {
						this.p1 = match[1];
						this.p2 = match[3];

						this.date = moment(match[5]).format('ddd MMM Do - h:mm A');
						matchFound = true;
					}
				}.bind(this));
			}.bind(this)
		});
	}

	socket: any = io.connect(environment.socketPath);
	seed: string = window.location.href.split('=')[1];

	p1: string;
	p2: string;
	date: string;
}
