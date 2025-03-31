import { Component, inject, signal } from '@angular/core';
import { MessageService } from '../../services/chat-service.service';// Asegúrate de que la ruta sea la correcta
import { ChatTextbarComponent } from '../chat-textbar/chat-textbar.component';

@Component({
  selector: 'app-chat-historial',
  templateUrl: './chat-historial.component.html',
  styleUrls: ['./chat-historial.component.css'],
})
export class ChatHistorialComponent {
  mensajes = signal<{ texto: string; tipo: 'usuario' | 'bot' }[]>([]);
  chatInputOutput = inject(ChatTextbarComponent);
  constructor(private messageService: MessageService) {}

  enviarMensaje(texto: string) {
    if (texto.trim() === '') return;

    // Agregar mensaje del usuario
    this.mensajes.update((msgs) => [...msgs, { texto, tipo: 'usuario' }]);

    this.messageService.llamada(texto).subscribe({
      next: (respuesta) => {
        // Convertir respuesta a string si es un objeto
        const textoRespuesta = typeof respuesta === 'string' ? respuesta : JSON.stringify(respuesta);

        // Agregar respuesta del bot
        this.mensajes.update((msgs) => [...msgs, { texto: textoRespuesta, tipo: 'bot' }]);
      },
      error: (error) => console.error('Error al enviar mensaje:', error)
    });
  }
}





