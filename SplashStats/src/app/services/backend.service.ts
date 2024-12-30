import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  constructor() {}

  validateTeamId(teamId: string): boolean {
    return teamId.length > 0;
  }
}
