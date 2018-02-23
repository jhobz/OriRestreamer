import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { DashboardCMP } from './dashboard/dashboard.cmp';
import { StreamCMP } from './stream/stream.cmp';
import { ControlsCMP } from './controls/controls.cmp';
import { GroupsCMP } from './groups/groups.cmp';
import { SplashCMP } from './splash/splash.cmp';
import { BracketCMP } from './bracket/bracket.cmp';
import { StatsCMP } from './stats/stats.cmp';
import { CreditsCMP } from './credits/credits.cmp';
import { IntermissionCMP } from './intermission/intermission.cmp';

import { WebSocketService } from './services/websocket.service';
import { TwitchService } from './services/twitch.service';

const appRoutes: Routes = [
  { path: 'dashboard', component: DashboardCMP },
  { path: 'stream', component: StreamCMP },
  { path: 'controls', component: ControlsCMP, },
  { path: 'groups', component: GroupsCMP },
  { path: 'splash', component: SplashCMP },
  { path: 'bracket', component: BracketCMP },
  { path: 'stats', component: StatsCMP },
  { path: 'credits', component: CreditsCMP },
  { path: 'intermission', component: IntermissionCMP },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent,
    ControlsCMP,
    DashboardCMP,
    StreamCMP,
    GroupsCMP,
    SplashCMP,
    BracketCMP,
    StatsCMP,
    CreditsCMP,
    IntermissionCMP
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(appRoutes, { useHash: true })
  ],
  providers: [
	  WebSocketService,
	  TwitchService
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
  constructor(){}
 }
