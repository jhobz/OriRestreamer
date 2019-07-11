import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StreamComponent } from './stream/stream.component';
import { ControlsComponent } from './controls/controls.component';
import { GroupsComponent } from './groups/groups.component';
import { SplashComponent } from './splash/splash.component';
import { BracketComponent } from './bracket/bracket.component';
import { StatsComponent } from './stats/stats.component';
import { CreditsComponent } from './credits/credits.component';
import { IntermissionComponent } from './intermission/intermission.component';
import { CommentatorsComponent } from './commentators/commentators.component';

const appRoutes: Routes = [
	{ path: 'dashboard', component: DashboardComponent },
	{ path: 'stream', component: StreamComponent },
	{ path: 'controls', component: ControlsComponent, },
	{ path: 'groups', component: GroupsComponent },
	{ path: 'splash', component: SplashComponent },
	{ path: 'bracket', component: BracketComponent },
	{ path: 'stats', component: StatsComponent },
	{ path: 'credits', component: CreditsComponent },
	{ path: 'intermission', component: IntermissionComponent },
	{ path: 'commentators', component: CommentatorsComponent },
	{ path: '', redirectTo: '/dashboard', pathMatch: 'full' }
];

@NgModule({
	declarations: [
		AppComponent,
		ControlsComponent,
		DashboardComponent,
		StreamComponent,
		GroupsComponent,
		SplashComponent,
		BracketComponent,
		StatsComponent,
		CreditsComponent,
		IntermissionComponent,
		CommentatorsComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		RouterModule.forRoot(appRoutes, { useHash: true })
	],
	bootstrap: [AppComponent]
})

export class AppModule {
	constructor() {}
}
