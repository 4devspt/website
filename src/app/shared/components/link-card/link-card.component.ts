import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface LinkCard {
  id: string;
  name: string;
  imageUrl: string;
  link: string;
}

@Component({
  selector: 'app-link-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './link-card.component.html',
  styleUrls: ['./link-card.component.scss'],
})
export class LinkCardComponent {
  @Input() card!: LinkCard;
}
