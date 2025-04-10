import { AfterViewChecked, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Mensaje {
  texto: string;
  tipo: 'usuario' | 'bot';
}

@Component({
  selector: 'app-chat-historial',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat-historial.component.html',
  styleUrls: ['./chat-historial.component.css'],
})
export class ChatHistorialComponent implements AfterViewChecked, OnChanges {
  @Input() mensajes: Mensaje[] = [];

  @ViewChild('chatContainer') chatContainer!: ElementRef;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mensajes']) {
      this.scrollToBottom();
    }
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    if (this.chatContainer && this.chatContainer.nativeElement) {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    }
  }
}
