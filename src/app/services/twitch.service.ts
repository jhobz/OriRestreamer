import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import { WebSocketService } from './websocket.service';
import { environment } from '../../environments/environment';
import { accessToken } from '../../keys/twitch';

export interface BitsMessage {
	amount: number,
	channel: string,
	message: string,
	time: Date,
	total: number,
	user: string
}

@Injectable()
export class TwitchService {
	public messages: Subject<Object>;

	constructor(wsService: WebSocketService) {
		this.messages = <Subject<any>>wsService
			.connect(environment.twitchPath)
			.map((response: MessageEvent): any => {
				let res = JSON.parse(response.data);
				console.log(res);
				if (res.type === 'RESPONSE' && res.error === '') {
					console.log('Began listening to server');
					return;
				}
				if (res.type === 'MESSAGE') {
					let message = JSON.parse(res.data.message);
					console.log(message);

					if (message.message_type === 'bits_event') {
						let msgdata = JSON.parse(message.data);

						return {
							amount: msgdata.bits_used,
							channel: msgdata.channel_name,
							message: msgdata.chat_message,
							time: msgdata.time,
							total: msgdata.total_bits_used,
							user: msgdata.user_name
						}
					}
				}
				else {
					console.error("Response from Twitch not recognized.", res);
					return;
				}
			});
	}
}
