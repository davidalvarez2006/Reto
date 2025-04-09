import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { MessageService } from '../../services/chat-service.service';
import { ChatServiceHistorial } from '../../services/chatSave-service.service';

@Component({
  selector: 'app-chat-textbar',
  templateUrl: './chat-textbar.component.html',
  styleUrls: ['./chat-textbar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatTextbarComponent {
  @Output() mensajeOutput = new EventEmitter<{ texto: string; tipo: 'usuario' | 'bot' }>();
  @ViewChild('inputPregunta') inputPregunta!: ElementRef;

  private activeConversationId: number = 0;

  constructor(private messageService: MessageService, private chatHistorial: ChatServiceHistorial) {}

  enviarMensaje(texto: string) {
    if (texto.trim() === '') return;

    const mensajeUsuario: { texto: string; tipo: 'usuario' } = { texto, tipo: 'usuario' };
    this.chatHistorial.addMessageToConversation(this.activeConversationId, mensajeUsuario);

    this.messageService.llamada(texto).subscribe({
      next: (respuesta) => {
        const textoRespuesta = typeof respuesta === 'string' ? respuesta : JSON.stringify(respuesta);
        const mensajeBot: { texto: string; tipo: 'bot' } = { texto: textoRespuesta, tipo: 'bot' };

        this.chatHistorial.addMessageToConversation(this.activeConversationId, mensajeBot);
      },
      error: (error) => console.error('Error al enviar mensaje:', error),
    });

    this.inputPregunta.nativeElement.value = '';
    this.inputPregunta.nativeElement.focus();
  }

  nuevoChat() {
    this.chatHistorial.clearConversations();
    this.inputPregunta.nativeElement.value = '';
    this.inputPregunta.nativeElement.focus();
  }
}
