import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';

export interface ValidatorGeneratorConfig {
  title: string;
  description: string;
  placeholder?: string;
  validationLabel?: string;
  generateLabel?: string;
}

@Component({
  selector: 'app-validator-generator',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    CardModule,
    TooltipModule,
    InputIconModule,
    IconFieldModule,
  ],
  templateUrl: './validator-generator.component.html',
  styleUrls: ['./validator-generator.component.scss'],
})
export class ValidatorGeneratorComponent {
  @Input() config: ValidatorGeneratorConfig = {
    title: '',
    description: '',
  };
  @Input() inputValue = '';
  @Output() valueChange = new EventEmitter<string>();
  @Output() onValidateClick = new EventEmitter<string>();
  @Output() onGenerateClick = new EventEmitter<void>();

  validationResult = signal<boolean | null>(null);
  copied = signal(false);

  onValidate(): void {
    if (this.inputValue) {
      this.onValidateClick.emit(this.inputValue);
    }
  }

  onGenerate(): void {
    this.validationResult.set(null);
    this.onGenerateClick.emit();
  }

  copyToClipboard(): void {
    if (this.inputValue) {
      navigator.clipboard.writeText(this.inputValue).then(() => {
        this.copied.set(true);
        setTimeout(() => this.copied.set(false), 2000);
      });
    }
  }

  setValidationResult(result: boolean): void {
    this.validationResult.set(result);
  }

  setInputValue(value: string): void {
    this.inputValue = value;
    this.valueChange.emit(value);
  }
}
