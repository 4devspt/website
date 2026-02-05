import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { LinkCardComponent, LinkCard } from '../../shared/components/link-card/link-card.component';
import { Subscription } from 'rxjs';

interface HomePageData {
  cards: LinkCard[];
  gridSize: number;
}

@Component({
  selector: 'app-your-homepage',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, LinkCardComponent],
  templateUrl: './your-homepage.component.html',
  styleUrls: ['./your-homepage.component.scss'],
})
export class YourHomepageComponent implements OnInit, OnDestroy {
  // Signals for reactive state
  cards = signal<LinkCard[]>([]);
  gridSize = signal<number>(4);
  showAddModal = signal<boolean>(false);

  // Form inputs
  newCardName = '';
  newCardImageUrl = '';
  newCardLink = '';

  // Grid size options
  gridOptions = [
    { label: '2 por linha', value: 2 },
    { label: '3 por linha', value: 3 },
    { label: '4 por linha', value: 4 },
    { label: '5 por linha', value: 5 },
    { label: '6 por linha', value: 6 },
  ];

  private storageSubscription: Subscription | null = null;
  private draggedCard: LinkCard | null = null;
  private dragOverIndex: number | null = null;

  ngOnInit(): void {
    this.loadFromStorage();
  }

  ngOnDestroy(): void {
    if (this.storageSubscription) {
      this.storageSubscription.unsubscribe();
    }
  }

  // Default links to show when localStorage is empty
  private readonly defaultLinks: LinkCard[] = [
    {
      id: '1',
      name: 'TeamLyzer',
      imageUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsxjXJspe2J7xNInijdQ7mFE6NFafByfJkgA&s',
      link: 'https://teamlyzer.com',
    },
    {
      id: '2',
      name: 'Reddit',
      imageUrl: 'https://www.reddit.com/favicon.ico',
      link: 'https://www.reddit.com',
    },
    {
      id: '3',
      name: 'ChatGPT',
      imageUrl: 'https://chatgpt.com/favicon.ico',
      link: 'https://chatgpt.com',
    },
    {
      id: '4',
      name: 'Claude',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b0/Claude_AI_symbol.svg',
      link: 'https://claude.com',
    },
    {
      id: '5',
      name: 'KiloCode',
      imageUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMLlNkfiVjeIdE8Sw7_GmVbxfOaqo-GnRX3w&s',
      link: 'https://kilocode.io',
    },
    {
      id: '6',
      name: 'Daily.dev',
      imageUrl:
        'https://images.seeklogo.com/logo-png/48/2/daily-dev-icon-logo-png_seeklogo-483914.png',
      link: 'https://daily.dev',
    },
    {
      id: '7',
      name: 'Gemini',
      imageUrl:
        'https://images.seeklogo.com/logo-png/62/2/google-gemini-icon-logo-png_seeklogo-623016.png',
      link: 'https://gemini.google.com',
    },
  ];

  private loadFromStorage(): void {
    const storedData = localStorage.getItem('homePageData');
    if (storedData) {
      try {
        const data: HomePageData = JSON.parse(storedData);
        this.cards.set(data.cards || []);
        this.gridSize.set(data.gridSize || 4);
      } catch (e) {
        console.error('Error parsing stored data:', e);
        this.loadDefaultData();
      }
    } else {
      this.loadDefaultData();
    }
  }

  private loadDefaultData(): void {
    this.cards.set(this.defaultLinks);
    this.gridSize.set(4);
    this.saveToStorage();
  }

  private saveToStorage(): void {
    const data: HomePageData = {
      cards: this.cards(),
      gridSize: this.gridSize(),
    };
    localStorage.setItem('homePageData', JSON.stringify(data));
  }

  onGridSizeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const value = parseInt(select.value, 10);
    this.gridSize.set(value);
    this.saveToStorage();
  }

  openAddModal(): void {
    this.newCardName = '';
    this.newCardImageUrl = '';
    this.newCardLink = '';
    this.showAddModal.set(true);
  }

  closeAddModal(): void {
    this.showAddModal.set(false);
  }

  addCard(): void {
    if (!this.newCardName.trim() || !this.newCardImageUrl.trim()) {
      return;
    }

    const newCard: LinkCard = {
      id: crypto.randomUUID(),
      name: this.newCardName.trim(),
      imageUrl: this.newCardImageUrl.trim(),
      link: this.newCardLink.trim() || '#',
    };

    this.cards.update((cards) => [...cards, newCard]);
    this.saveToStorage();
    this.closeAddModal();
  }

  deleteCard(cardId: string): void {
    this.cards.update((cards) => cards.filter((c) => c.id !== cardId));
    this.saveToStorage();
  }

  // Drag and drop methods
  onDragStart(event: DragEvent, card: LinkCard): void {
    this.draggedCard = card;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', card.id);
    }
  }

  onDragOver(event: DragEvent, index: number): void {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
    this.dragOverIndex = index;
  }

  onDragLeave(): void {
    this.dragOverIndex = null;
  }

  onDrop(event: DragEvent, targetIndex: number): void {
    event.preventDefault();
    this.dragOverIndex = null;

    if (!this.draggedCard) {
      return;
    }

    const currentCards = this.cards();
    const draggedIndex = currentCards.findIndex((c) => c.id === this.draggedCard!.id);

    if (draggedIndex === -1 || draggedIndex === targetIndex) {
      this.draggedCard = null;
      return;
    }

    // Remove dragged card and insert at target position
    const updatedCards = [...currentCards];
    const [removed] = updatedCards.splice(draggedIndex, 1);
    updatedCards.splice(targetIndex, 0, removed);

    this.cards.set(updatedCards);
    this.saveToStorage();
    this.draggedCard = null;
  }

  onDragEnd(): void {
    this.draggedCard = null;
    this.dragOverIndex = null;
  }

  isDraggingOver(index: number): boolean {
    return this.dragOverIndex === index;
  }
}
