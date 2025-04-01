import { ChangeDetectionStrategy, Component, EventEmitter, Output, signal } from '@angular/core';
import { MessageService } from '../../services/chat-service.service';

@Component({
  selector: 'app-chat-textbar',
  templateUrl: './chat-textbar.component.html',
  styleUrl: './chat-textbar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatTextbarComponent {

  mensajes = signal<{ texto: string; tipo: 'usuario' | 'bot' }[]>([]);

  @Output() mensajeOutput = new EventEmitter<{ texto: string; tipo: 'usuario' | 'bot' }>();

  constructor(private messageService: MessageService) {}

  enviarMensaje(texto: string) {
    if (texto.trim() === '') return;

    // Mensaje del usuario con tipo bien definido
    const mensajeUsuario: { texto: string; tipo: 'usuario' } = { texto, tipo: 'usuario' };
    this.mensajes.update((msgs) => [...msgs, mensajeUsuario]);
    this.mensajeOutput.emit(mensajeUsuario);

    this.messageService.llamada(texto).subscribe({
      next: (respuesta) => {
        const textoRespuesta = typeof respuesta === 'string' ? respuesta : JSON.stringify(respuesta);

        // Mensaje del bot con tipo bien definido
        const mensajeBot: { texto: string; tipo: 'bot' } = { texto: textoRespuesta, tipo: 'bot' };
        this.mensajes.update((msgs) => [...msgs, mensajeBot]);
        this.mensajeOutput.emit(mensajeBot);
      },
      error: (error) => console.error('Error al enviar mensaje:', error)
    });
  }
}




