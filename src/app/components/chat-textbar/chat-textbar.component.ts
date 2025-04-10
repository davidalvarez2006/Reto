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
  // Bandera para evitar envíos duplicados
  enviando: boolean = false;
  // Recibirá el id de la conversación activa desde el componente padre
  @Input() activeConversationId: number = 0;
  @Output() mensajeOutput = new EventEmitter<{ texto: string; tipo: 'usuario' | 'bot' }>();
  @ViewChild('inputPregunta') inputPregunta!: ElementRef;

  constructor(private messageService: MessageService, private chatHistorial: ChatServiceHistorial) {}

  enviarMensaje(texto: string, event?: KeyboardEvent) {
    // Si se presionó Enter, prevení comportamiento por defecto para evitar doble llamada.
    if (event) {
      event.preventDefault();
    }

    if (this.enviando || texto.trim() === '') {
      return;
    }

    this.enviando = true;

    const mensajeUsuario = { texto, tipo: 'usuario' } as { texto: string; tipo: 'usuario' };

    // Agrega el mensaje del usuario al historial (para actualizar la base de datos, si corresponde)
    this.chatHistorial.addMessageToConversation(this.activeConversationId, mensajeUsuario);
    // Emite el mensaje para que el padre (por ejemplo, PrincipalPage) lo agregue al array
    this.mensajeOutput.emit(mensajeUsuario);

    // Llamada a la API del chatbot
    this.messageService.llamada(texto).subscribe({
      next: (respuesta: any) => {
        console.log('Respuesta del chatbot:', respuesta);
        const textoRespuesta = respuesta.answare || 'No se obtuvo respuesta del bot';
        const mensajeBot = { texto: textoRespuesta, tipo: 'bot' } as { texto: string; tipo: 'bot' };

        // Agrega el mensaje del bot al historial en la base de datos
        this.chatHistorial.addMessageToConversation(this.activeConversationId, mensajeBot);
        // Emite el mensaje del bot para actualizar el array en el componente padre
        this.mensajeOutput.emit(mensajeBot);
        this.enviando = false; // Finaliza el envío
      },
      error: (error) => {
        console.error('Error al enviar mensaje:', error);
        this.enviando = false; // Finaliza el envío en caso de error
      }
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
