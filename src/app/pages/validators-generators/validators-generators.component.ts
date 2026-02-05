import { Component, ViewChildren, QueryList, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import {
  ValidatorGeneratorComponent,
  ValidatorGeneratorConfig,
} from '../../shared/components/validator-generator/validator-generator.component';

interface CardData {
  id: string;
  config: ValidatorGeneratorConfig;
  value: string;
  validate: (value: string) => boolean;
  generate: () => string;
}

@Component({
  selector: 'app-validators-generators',
  standalone: true,
  imports: [CommonModule, CardModule, ValidatorGeneratorComponent],
  templateUrl: './validators-generators.component.html',
  styleUrls: ['./validators-generators.component.scss'],
})
export class ValidatorsGeneratorsComponent implements AfterViewInit {
  @ViewChildren('validatorCards') validatorCards!: QueryList<ValidatorGeneratorComponent>;

  cards: CardData[] = [
    {
      id: 'nif',
      config: {
        title: 'NIF (Portugal)',
        description: 'Valide e gere Números de Identificação Fiscal portugueses.',
        placeholder: 'Introduzir número NIF',
        validationLabel: 'Validar',
        generateLabel: 'Gerar NIF',
      },
      value: '',
      validate: (value: string) => this.validateNIF(value),
      generate: () => this.generateNIF(),
    },
    {
      id: 'niss',
      config: {
        title: 'NISS (Portugal)',
        description: 'Valide e gere Números de Identificação da Segurança Social portugueses.',
        placeholder: 'Introduzir número NISS',
        validationLabel: 'Validar',
        generateLabel: 'Gerar NISS',
      },
      value: '',
      validate: (value: string) => this.validateNISS(value),
      generate: () => this.generateNISS(),
    },
    {
      id: 'creditcard',
      config: {
        title: 'Cartão de Crédito',
        description:
          'Valide e gere números válidos de cartões de crédito usando o algoritmo de Luhn.',
        placeholder: 'Introduzir número do cartão de crédito',
        validationLabel: 'Validar',
        generateLabel: 'Gerar CC',
      },
      value: '',
      validate: (value: string) => this.validateCreditCard(value),
      generate: () => this.generateCreditCard(),
    },
  ];

  ngAfterViewInit(): void {
    // Components are now available
  }

  onValueChange(cardId: string, value: string): void {
    const card = this.cards.find((c) => c.id === cardId);
    if (card) {
      card.value = value;
    }
  }

  onValidate(cardId: string, value: string): void {
    const card = this.cards.find((c) => c.id === cardId);
    if (card) {
      const isValid = card.validate(value);
      const index = this.cards.findIndex((c) => c.id === cardId);
      const validatorCard = this.validatorCards.toArray()[index];
      if (validatorCard) {
        validatorCard.setValidationResult(isValid);
      }
    }
  }

  onGenerate(cardId: string): void {
    const card = this.cards.find((c) => c.id === cardId);
    if (card) {
      const generatedValue = card.generate();
      card.value = generatedValue;
      const index = this.cards.findIndex((c) => c.id === cardId);
      const validatorCard = this.validatorCards.toArray()[index];
      if (validatorCard) {
        validatorCard.setInputValue(generatedValue);
      }
    }
  }

  // NIF Validation and Generation (Portuguese Tax ID)
  // NIF is a 9-digit number where the last digit is a check digit
  private validateNIF(nif: string): boolean {
    if (!nif || !/^\d{9}$/.test(nif)) {
      return false;
    }

    const digits = nif.split('').map(Number);
    const checkDigit = digits[8];

    // Calculate check digit
    let sum = 0;
    for (let i = 0; i < 8; i++) {
      sum += digits[i] * (9 - i);
    }

    const remainder = sum % 11;
    const calculatedCheck = remainder < 2 ? 0 : 11 - remainder;

    return checkDigit === calculatedCheck;
  }

  private generateNIF(): string {
    // Generate first 8 digits randomly
    const firstDigits: number[] = [];
    for (let i = 0; i < 8; i++) {
      firstDigits.push(Math.floor(Math.random() * 10));
    }

    // Calculate check digit
    let sum = 0;
    for (let i = 0; i < 8; i++) {
      sum += firstDigits[i] * (9 - i);
    }

    const remainder = sum % 11;
    const checkDigit = remainder < 2 ? 0 : 11 - remainder;

    return [...firstDigits, checkDigit].join('');
  }

  // NISS Validation and Generation (Portuguese Social Security Number)
  // NISS is an 11-digit number with specific rules
  private validateNISS(niss: string): boolean {
    if (!niss || !/^\d{11}$/.test(niss)) {
      return false;
    }

    const digits = niss.split('').map(Number);

    // First digit must be 1, 2, or 3
    if (digits[0] < 1 || digits[0] > 3) {
      return false;
    }

    // Calculate check digit
    let sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += digits[i] * (10 - i);
    }

    const remainder = sum % 11;
    const calculatedCheck = remainder === 0 ? 0 : 11 - remainder;
    const checkDigit = calculatedCheck === 10 ? 0 : calculatedCheck;

    return digits[10] === checkDigit;
  }

  private generateNISS(): string {
    // First digit must be 1, 2, or 3
    const firstDigit = [1, 2, 3][Math.floor(Math.random() * 3)];

    // Generate next 9 digits randomly
    const middleDigits: number[] = [firstDigit];
    for (let i = 1; i < 10; i++) {
      middleDigits.push(Math.floor(Math.random() * 10));
    }

    // Calculate check digit
    let sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += middleDigits[i] * (10 - i);
    }

    const remainder = sum % 11;
    const calculatedCheck = remainder === 0 ? 0 : 11 - remainder;
    const checkDigit = calculatedCheck === 10 ? 0 : calculatedCheck;

    return [...middleDigits, checkDigit].join('');
  }

  // Credit Card Validation using Luhn Algorithm
  private validateCreditCard(cardNumber: string): boolean {
    if (!cardNumber || !/^\d{13,19}$/.test(cardNumber)) {
      return false;
    }

    const digits = cardNumber.split('').map(Number);

    // Luhn algorithm
    let sum = 0;
    let isEven = false;

    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = digits[i];

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  }

  private generateCreditCard(): string {
    // Generate a valid credit card number using Luhn algorithm
    // We'll generate 16 digits
    const digits: number[] = [];

    // First digit is typically 4 (Visa), 5 (Mastercard), or 3 (Amex)
    const firstDigits = [4, 5, 3];
    digits.push(firstDigits[Math.floor(Math.random() * firstDigits.length)]);

    // Generate next 14 digits randomly
    for (let i = 1; i < 15; i++) {
      digits.push(Math.floor(Math.random() * 10));
    }

    // Calculate check digit using Luhn algorithm
    // Process digits from right to left (excluding the check digit position)
    // Every second digit (even positions from the right) gets doubled
    // If doubled value > 9, subtract 9
    let sum = 0;
    for (let i = 14; i >= 0; i--) {
      let digit = digits[i];
      // Position from right: position 1 = rightmost (index 15 in 16-digit number)
      // We start at index 14, which is position 2 from right (even position)
      if ((15 - i) % 2 === 0) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      sum += digit;
    }

    const checkDigit = (10 - (sum % 10)) % 10;
    digits.push(checkDigit);

    return digits.join('');
  }
}
