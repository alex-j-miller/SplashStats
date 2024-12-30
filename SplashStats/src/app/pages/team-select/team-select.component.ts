import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BackendService } from '../../services/backend.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-team-select',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './team-select.component.html',
  styleUrl: './team-select.component.css',
})
export class TeamSelectComponent {
  teamId: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  validTeamId: boolean | null = null;
  $backendService: BackendService;

  constructor(private backendService: BackendService, private router: Router) {
    this.$backendService = backendService;
  }

  onSelectTeam() {
    this.isLoading = true;
    console.log('Selected team:', this.teamId);

    this.validTeamId = this.$backendService.validateTeamId(this.teamId);
    if (this.validTeamId) {
      this.router.navigate(['/team', this.teamId]);
    } else {
      this.isLoading = false;
      this.errorMessage = 'Invalid Team ID';
    }
  }
}
