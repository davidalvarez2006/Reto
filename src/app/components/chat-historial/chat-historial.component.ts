import { AfterViewChecked, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

// Interface para definir la estructura de los mensajes
export interface Mensaje {
  texto: string;
  tipo: 'usuario' | 'bot';
}

@Component({
  selector: 'app-chat-historial',
  standalone: true,
  imports: [CommonModule],  // Se importa el módulo común
  templateUrl: './chat-historial.component.html',
  styleUrls: ['./chat-historial.component.css'],
})
export class ChatHistorialComponent implements AfterViewChecked, OnChanges {
  // Propiedad de entrada para los mensajes recibidos
  @Input() mensajes: Mensaje[] = [];

  // Referencia al contenedor de los mensajes en el DOM
  @ViewChild('chatContainer') chatContainer!: ElementRef;

  // Detecta los cambios en las entradas y hace scroll al final si los mensajes cambian
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mensajes']) {
      this.scrollToBottom(); // Desplazar al último mensaje
    }
  }

  // Detecta cada vez que se verifica la vista y asegura que el contenedor se desplace hacia abajo
  ngAfterViewChecked(): void {
    this.scrollToBottom(); // Desplazar al último mensaje después de cada cambio de vista
  }

  // Método para hacer scroll hacia el final del contenedor de mensajes
  scrollToBottom(): void {
    if (this.chatContainer && this.chatContainer.nativeElement) {
      // Se asegura de que el contenedor tiene una referencia válida
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    }
  }
}
