import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MessageService } from '../../services/chat-service.service';
import { ChatServiceHistorial } from '../../services/chatSave-service.service';

@Component({
  selector: 'app-chat-textbar',
  templateUrl: './chat-textbar.component.html',
  styleUrls: ['./chat-textbar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatTextbarComponent {
  // Recibirá el id de la conversación activa desde el componente padre
  @Input() activeConversationId: number = 0;
  @Output() mensajeOutput = new EventEmitter<{ texto: string; tipo: 'usuario' | 'bot' }>();
  @ViewChild('inputPregunta') inputPregunta!: ElementRef;

  constructor(private messageService: MessageService, private chatHistorial: ChatServiceHistorial) {}

  enviarMensaje(texto: string) {
    if (texto.trim() === '') return;

    const mensajeUsuario = { texto, tipo: 'usuario' } as { texto: string; tipo: 'usuario' };

    // Agregar al historial en la base de datos mediante el servicio
    this.chatHistorial.addMessageToConversation(this.activeConversationId, mensajeUsuario);

    // Emitir mensaje del usuario para actualizar el array en el componente padre
    this.mensajeOutput.emit(mensajeUsuario);

    // Llamada a la API
    this.messageService.llamada(texto).subscribe({
      next: (respuesta: any) => {
        console.log('Respuesta del chatbot:', respuesta);
        const textoRespuesta = respuesta.answare || 'No se obtuvo respuesta del bot';
        const mensajeBot = { texto: textoRespuesta, tipo: 'bot' } as { texto: string; tipo: 'bot' };

        // Agregar al historial en la base de datos
        this.chatHistorial.addMessageToConversation(this.activeConversationId, mensajeBot);

        // Emitir mensaje del bot para actualizar el array en el padre
        this.mensajeOutput.emit(mensajeBot);
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
