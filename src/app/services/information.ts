import { Tracker } from './tracker';

export class Information {
    seed: string = null;

    player1: string = 'TheRooseIsLoose89';
    player2: string = 'chicken_supreme';
    player1_twitch: string = 'TheRooseIsLoose89';
    player2_twitch: string = 'chicken_supreme';
    player1_seed: string = '';
    player2_seed: string = '';
    player1_timerVisible: boolean = false;
    player2_timerVisible: boolean = false;
    player1_finishTime: string = '0:00:00';
    player2_finishTime: string = '0:00:00';
	player1_matchNumber: string = '';
	player2_matchNumber: string = '';
    currentAudioOnPlayer: number = 1;
    commentators: string = 'Spikevegeta, JHobz296';
    background: string = 'celeste';
    groupName: string = '';
    matchType: string = '';
    tracker: Tracker = new Tracker();
}
