import { Component, OnInit } from '@angular/core';
import { Information } from '../services/information';
import { environment } from '../../environments/environment';
import io from 'socket.io-client';

@Component({
	templateUrl: './commentators.html',
	styleUrls: ['./commentators.css']
})

export class CommentatorsComponent implements OnInit {
	constructor() { }

	ngOnInit() {
		this.socket.on('data', function(data: Information){
			if (data.seed !== this.seed) {
				return;
			}

			this.vm = data;
		}.bind(this));
	}

	public vm: Information = new Information();

	socket: any = io.connect(environment.socketPath);
	seed: string = window.location.href.split('=')[1];
}
