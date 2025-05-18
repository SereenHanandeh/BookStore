import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reusable-modal',
  imports: [CommonModule, DialogModule, ButtonModule],
  templateUrl: './reusable-modal.component.html',
  styleUrl: './reusable-modal.component.scss',
})
export class ReusableModalComponent {
  @Input() visible: boolean = false;
  @Input() title: string = 'Message';
  @Input() message: string = '';
  @Input() showOkButton: boolean = true;

  @Output() onClose = new EventEmitter<void>();

  closeModal() {
    this.onClose.emit();
  }
}
