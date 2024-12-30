import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-times',
  standalone: true,
  imports: [],
  templateUrl: './times.component.html',
  styleUrl: './times.component.css',
})
export class TimesComponent {
  teamId!: string;

  constructor(private route: ActivatedRoute) {
    this.route.paramMap.subscribe((params) => {
      this.teamId = params.get('teamId')!;
    });
  }
}
