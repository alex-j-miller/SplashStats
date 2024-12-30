import { Routes } from '@angular/router';
import { TeamSelectComponent } from './pages/team-select/team-select.component';
import { TimesComponent } from './pages/times/times.component';

export const routes: Routes = [
  { path: '', component: TeamSelectComponent },
  { path: 'team/:teamId', component: TimesComponent },
  { path: '**', redirectTo: '' },
];
