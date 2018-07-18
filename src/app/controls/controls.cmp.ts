import { Component, Input, transition } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Information } from '../services/information';
import { environment } from '../../environments/environment';
import * as moment from 'moment';
import * as $ from 'jquery';
import io from 'socket.io-client';
import { retry } from 'rxjs/operators/retry';

@Component({
	templateUrl: './controls.html',
	styleUrls: ['./controls.css']
})
export class ControlsCMP {
	constructor() { }

	ngOnInit() {
		this.seed = this.urlSeed;
		this.socket.on('data', function(data: Information) {
			if (data.seed !== this.seed)
				return;

			if (this.updating)
				return;

			this.vm = data;
		}.bind(this));

		this.socket.on('timer', function(start: boolean, data: Information) {
			if (data.seed !== this.seed)
				return;

			if (!start) {
				clearInterval(this.player1Interval);
				clearInterval(this.player2Interval);
				this.ticks1 = '0:00:00';
				this.ticks2 = '0:00:00';
			}
			else {
				if (this.timerStarted)
					return;

				this.timerStarted = true;
				let seconds = new Date().getTime(), last = seconds;
				this.player1Interval = setInterval(function() {
					if (this.timer1Paused)
						return;

					const now = new Date().getTime();
					last = now;
					this.ticks1 = moment().startOf('day').seconds((now - seconds) / 1000).format('H:mm:ss');
				}.bind(this), 100);

				this.player2Interval = setInterval(function() {
					if (this.timer2Paused)
						return;

					const now = new Date().getTime();
					last = now;
					this.ticks2 = moment().startOf('day').seconds((now - seconds) / 1000).format('H:mm:ss');
				}.bind(this), 100);
			}
		}.bind(this));

		this.socket.on('timer1', function(finished: boolean, data: Information) {
			if (data.seed !== this.seed)
				return;

			if (!finished) {
			}
			else {
				this._vm.player1_finishTime = this.ticks1;
				this.socket.emit('data', this.vm);
				clearInterval(this.player1Interval);
			}
		}.bind(this));

		this.socket.on('timer2', function(finished: boolean, data: Information) {
			if (data.seed !== this.seed)
				return;

			if (!finished) {
			}
			else {
				this._vm.player2_finishTime = this.ticks2;
				this.socket.emit('data', this.vm);
				clearInterval(this.player2Interval);
			}
		}.bind(this));

		console.log(this.players);
	}

	playersList: any;
	urlSeed: string = window.location.href.split('=')[1];
	timerStarted = false;
	timer1Paused = false;
	timer2Paused = false;
	hasPlayer1Finished = false;
	hasPlayer2Finished = false;

	canStartTimer: boolean = !this.timer1Paused && !this.timer2Paused && !this.timerStarted;

	ticks1 = '0:00:00';
	ticks2 = '0:00:00';
	player1Interval: any;
	player2Interval: any;
	public nameTimer: Observable<number> = Observable.timer(0, 1000);
	public timer2: Observable<number> = Observable.timer(0, 1000);
	private $timer2: Subscription;
	socket: any = io.connect(environment.socketPath);
	isLinked = false;
	linkedInterval: any;

	setBackground(background: string) {
		switch (background) {
			case 'celeste':
				this._vm.groupName = 'Celeste';
				break;
			case 'odyssey':
				this._vm.groupName = 'Super Mario Odyssey';
				break;
			case 'ori':
				this._vm.groupName = 'Ori DE Randomizer';
				break;
			case 'plague':
				this._vm.groupName = 'Shovel Knight: Plague of Shadows';
				break;
			case 'trop':
				this._vm.groupName = 'Donkey Kong Country: Tropical Freeze';
				break;
			case 'kh1':
				this._vm.groupName = 'Kingdom Hearts Final Mix HD';
				break;
			case 'kh2':
				this._vm.groupName = 'Kingdom Hearts II Final Mix HD';
				break;
			case 'crashnst':
				this._vm.groupName = 'Crash Bandicoot: N. Sane Trilogy';
				break;
			case 'alttp':
				this._vm.groupName = 'A Link to the Past Randomizer';
				break;
			case 'sonicg':
				this._vm.groupName = 'Sonic Generations';
				break;
			case 'smg':
				this._vm.groupName = 'Super Mario Galaxy';
				break;
		}

		this._vm.background = background;
		this._vm.matchType = this._vm.groupName + ' - Standard Shards';
	}

	updateInfo() {
		this.socket.emit('data', this.vm);
	}

	linkTracker() {
		if (this.isLinked)
			return;

		this.isLinked = true;

		this.linkedInterval = setInterval(function() {
			$.ajax({
				url: 'https://www.meldontaragon.org/ori/tracker/allskills/server.php?match=' + this._vm.seed,
				dataType: 'json',
				error: function(response) {
					console.log(response);
				},
				success: function(response: any) {
					this._vm.tracker = JSON.parse(JSON.stringify(response));
					this.socket.emit('tracker', this.vm);
				}.bind(this)
			});
		}.bind(this), 1000);
	}

	unlink() {
		this.isLinked = false;
		clearInterval(this.linkedInterval);
	}

	start() {
		let changedTimer = false;
		let p1seconds, p2seconds;
		if (this.timer1Paused) {
			changedTimer = true;
			clearInterval(this.player1Interval);
			this.timer1Paused = false;

			const ticks1Array = this.ticks1.split(':');

			const newTicksSecondsHours = (parseInt(ticks1Array[0]) * 3600);
			const newTicksSecondsMinutes = (parseInt(ticks1Array[1]) * 60);
			const newTicksSeconds = parseInt(ticks1Array[2]) + newTicksSecondsHours + newTicksSecondsMinutes;
			const newP1TimerTicks = moment().startOf('day').seconds(newTicksSeconds).format('H:mm:ss');

			p1seconds = new Date().getTime() - (newTicksSeconds * 1000);

			this.player1Interval = setInterval(function() {
				if (this.timer1Paused)
					return;

				const now = new Date().getTime();

				this.ticks1 = moment().startOf('day').seconds((now - p1seconds) / 1000).format('H:mm:ss');
			}.bind(this), 100);
		}

		if (this.timer2Paused) {
			changedTimer = true;
			clearInterval(this.player2Interval);
			this.timer2Paused = false;

			const ticks2Array = this.ticks2.split(':');

			const newTicks2SecondsHours = (parseInt(ticks2Array[0]) * 3600);
			const newTicks2SecondsMinutes = (parseInt(ticks2Array[1]) * 60);
			const newTicks2Seconds = parseInt(ticks2Array[2]) + newTicks2SecondsHours + newTicks2SecondsMinutes;
			const newP2TimerTicks = moment().startOf('day').seconds(newTicks2Seconds).format('H:mm:ss');

			p2seconds = new Date().getTime() - (newTicks2Seconds * 1000);

			this.player2Interval = setInterval(function() {
				if (this.timer2Paused)
					return;

				const now = new Date().getTime();

				this.ticks2 = moment().startOf('day').seconds((now - p2seconds) / 1000).format('H:mm:ss');
			}.bind(this), 100);

		}

		if (changedTimer) {
			console.log(p2seconds);
			console.log(p1seconds);
			if (p2seconds > p1seconds) {
				if (p1seconds !== undefined)
					this.socket.emit('timer-set', p1seconds, this.vm);
				else
					this.socket.emit('timer-set', p2seconds, this.vm);
			} else {
				if (p2seconds !== undefined)
					this.socket.emit('timer-set', p2seconds, this.vm);
				else
					this.socket.emit('timer-set', p1seconds, this.vm);
			}
			changedTimer = false;
		}

		if (this.timer2Paused) {
			return;
		}

		if (this.hasPlayer1Finished && this.hasPlayer2Finished) {
			return;
		}

		if (!this.timerStarted) {
			this.socket.emit('timer', true, this.vm);
		}

		this.timer1Paused = false;
		this.timer2Paused = false;
	}

	player1Paused() {
		if (this.timerStarted)
			this.timer1Paused = true;

	}

	player2Paused() {
		if (this.timerStarted)
			this.timer2Paused = true;
	}

	reset() {
		if (!confirm('Reset?'))
			return;

		this.timerStarted = false;
		this.timer1Paused = false;
		this.timer2Paused = false;
		this.hasPlayer1Finished = false;
		this.hasPlayer2Finished = false;
		this._vm.player1_finishTime = '0:00:00';
		this._vm.player2_finishTime = '0:00:00';
		this.socket.emit('data', this.vm);
		this.socket.emit('timer', false, this.vm);
	}

	player1Finished() {
		if (this.hasPlayer1Finished) {
			this._vm.player1_finishTime = this.ticks1;
			this.socket.emit('data', this.vm);
			return;
		}

		this.hasPlayer1Finished = true;
		this.socket.emit('timer1', true, this.vm);
	}

	player2Finished() {
		if (this.hasPlayer2Finished) {
			this._vm.player2_finishTime = this.ticks2;
			this.socket.emit('data', this.vm);
			return;
		}

		this.hasPlayer2Finished = true;
		this.socket.emit('timer2', true, this.vm);
	}

	setP1Name(event: any) {
		const runner = jQuery.grep(this.players, function(n: any, i) {
			return n.name == event;
		})[0];
		this.vm.player1 = runner.preferredName;
	}

	setP2Name(event: any) {
		const runner = jQuery.grep(this.players, function(n: any, i) {
			return n.name == event;
		})[0];
		this.vm.player2 = runner.preferredName;
	}

	private _vm: Information = new Information();
	public get vm(): Information {
		return this._vm;
	}

	public set vm(info: Information) {
		this._vm = info;
	}

	public get hidePlayer1Timer(): boolean {
		return this._vm.player1_timerVisible;
	}

	public set hidePlayer1Timer(timerSelected: boolean) {
		this._vm.player1_timerVisible = timerSelected;
	}

	public get hidePlayer2Timer(): boolean {
		return this._vm.player2_timerVisible;
	}

	public set hidePlayer2Timer(timerSelected: boolean) {
		this._vm.player2_timerVisible = timerSelected;
	}

	public set matchType(matchType: string) {
		this._vm.matchType = matchType;
	}

	public get matchType(): string {
		return this._vm.matchType;
	}

	public set commentators(commentators: string) {
		this._vm.commentators = commentators;
	}

	public get commentators(): string {
		return this._vm.commentators;
	}

	public get seed(): string {
		return this._vm.seed;
	}

	public set seed(seed: string) {
		this._vm.seed = seed;
	}

	public get p1_name(): string {
		return this._vm.player1;
	}

	public set p1_name(p1: string) {
		this._vm.player1 = p1;
	}

	public get p2_name(): string {
		return this._vm.player2;
	}

	public set p2_name(p2: string) {
		this._vm.player2 = p2;
	}

	public get p1_twitch(): string {
		return this._vm.player1_twitch;
	}

	public set p1_twitch(p1: string) {
		this._vm.player1_twitch = p1;
	}

	public get p2_twitch(): string {
		return this._vm.player2_twitch;
	}

	public set p2_twitch(p2: string) {
		this._vm.player2_twitch = p2;
	}

	public get p1_seed(): string {
		return this._vm.player1_seed;
	}

	public set p1_seed(p1: string) {
		this._vm.player1_seed = (p1 !== '' || undefined || null) ? p1 : null;
	}

	public get p2_seed(): string {
		return this._vm.player2_seed;
	}

	public set p2_seed(p2: string) {
		this._vm.player2_seed = (p2 !== '' || undefined || null) ? p2 : null;
	}


	public get p1_audio(): boolean {
		return this._vm.currentAudioOnPlayer == 1;
	}

	public set p1_audio(audioSelected: boolean) {
		this._vm.currentAudioOnPlayer = audioSelected ? 1 : this._vm.currentAudioOnPlayer;
	}

	public get p2_audio(): boolean {
		return this._vm.currentAudioOnPlayer == 2;
	}

	public set p2_audio(audioSelected: boolean) {
		this._vm.currentAudioOnPlayer = audioSelected ? 2 : this._vm.currentAudioOnPlayer;
	}

	players = [
		{
			'name': 'ivan',
			'preferredName': 'Ivan',
			'startColumn': 'B3',
			'endColumn': 'J3'
		},
		{
			'name': 'Midboss2',
			'preferredName': 'Midboss',
			'startColumn': 'B4',
			'endColumn': 'B4'
		},
		{
			'name': 'TonesBalones',
			'preferredName': 'Tones',
			'startColumn': 'B4',
			'endColumn': 'B4'
		},
		{
			'name': 'theJKB',
			'preferredName': 'JKB',
			'startColumn': 'B4',
			'endColumn': 'B4'
		},
		{
			'name': 'ogNdrahciR',
			'preferredName': 'Richard',
			'startColumn': 'B4',
			'endColumn': 'B4'
		},
		{
			'name': 'SmashyLe',
			'preferredName': 'Smashy',
			'startColumn': 'B4',
			'endColumn': 'B4'
		},
		{
			'name': 'MooMooAkai',
			'preferredName': 'MooMoo',
			'startColumn': 'B4',
			'endColumn': 'B4'
		},
		{
			'name': 'MunchaKoopas',
			'preferredName': 'Muncha',
			'startColumn': 'B4',
			'endColumn': 'B4'
		},
		{
			'name': 'michael_goldfish',
			'preferredName': 'Goldfish',
			'startColumn': 'B4',
			'endColumn': 'B4'
		},
		{
			'name': 'TehRizzle',
			'preferredName': 'Rizz',
			'startColumn': 'B4',
			'endColumn': 'B4'
		},
		{
			'name': 'Bl00dyBizkitz',
			'preferredName': 'Bl00dy / BB',
			'startColumn': 'B4',
			'endColumn': 'B4'
		},
		{
			'name': 'CameronVengenz',
			'preferredName': 'Cameron',
			'startColumn': 'B4',
			'endColumn': 'B4'
		},
		{
			'name': 'Roach788',
			'preferredName': 'Roach',
			'startColumn': 'B4',
			'endColumn': 'B4'
		},
		{
			'name': 'Sigmasin',
			'preferredName': 'Sigma',
			'startColumn': 'B4',
			'endColumn': 'B4'
		},
		{
			'name': 'Phant_TV',
			'preferredName': 'Phant',
			'startColumn': 'B4',
			'endColumn': 'B4'
		},
		{
			'name': 'Andy',
			'preferredName': 'Andy',
			'startColumn': 'B4',
			'endColumn': 'B4'
		},
		{
			'name': 'ChristosOwen',
			'preferredName': 'ChristosOwen',
			'startColumn': 'B4',
			'endColumn': 'B4'
		},
		{
			'name': 'NotSoNewby',
			'preferredName': 'Newby',
			'startColumn': 'B4',
			'endColumn': 'B4'
		},
		{
			'name': 'Ghoul02',
			'preferredName': 'Ghoul',
			'startColumn': 'B4',
			'endColumn': 'B4'
		},
		{
			'name': 'Zetris',
			'preferredName': 'Zetris',
			'startColumn': 'B4',
			'endColumn': 'B4'
		},
		{
			'name': 'RebelWatt',
			'preferredName': 'Rebel',
			'startColumn': 'B4',
			'endColumn': 'B4'
		},
		{
			'name': 'Frokenok',
			'preferredName': 'Frokenok',
			'startColumn': 'B4',
			'endColumn': 'B4'
		},
		{
			'name': 'TheBlueMania',
			'preferredName': 'BlueMania',
			'startColumn': 'B4',
			'endColumn': 'B4'
		},
		{
			'name': 'Terra21',
			'preferredName': 'Terra',
			'startColumn': 'B4',
			'endColumn': 'B4'
		},
		{
			'name': 'TheRooseIsLoose89',
			'preferredName': 'Roose',
			'startColumn': 'B4',
			'endColumn': 'B4'
		},
		{
			'name': 'TGH_sr',
			'preferredName': 'TGH',
			'startColumn': 'B4',
			'endColumn': 'B4'
		},
		{
			'name': 'yp__',
			'preferredName': 'yp',
			'startColumn': 'B4',
			'endColumn': 'B4'
		},
		{
			'name': 'Spikevegeta',
			'preferredName': 'Spike',
			'startColumn': 'B4',
			'endColumn': 'B4'
		},
		{
			'name': 'JHobz296',
			'preferredName': 'JHobz',
			'startColumn': 'B4',
			'endColumn': 'B4'
		},
		{
			'name': 'Grimelios',
			'preferredName': 'Grimelios',
			'startColumn': 'B4',
			'endColumn': 'B4'
		},
		{
			'name': 'MeldonTaragon',
			'preferredName': 'Meldon',
			'startColumn': 'B4',
			'endColumn': 'B4'
		}
	];
}
