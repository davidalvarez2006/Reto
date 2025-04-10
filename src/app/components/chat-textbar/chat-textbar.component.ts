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
  enviando: boolean = false;
  @Input() activeConversationId: number = 0;
  @Output() mensajeOutput = new EventEmitter<{ texto: string; tipo: 'usuario' | 'bot' }>();
  @ViewChild('inputPregunta') inputPregunta!: ElementRef;

  constructor(
    private messageService: MessageService,
    private chatHistorial: ChatServiceHistorial
  ) {}

  enviarMensaje(texto: string, event?: KeyboardEvent) {
    if (event) {
      event.preventDefault();
    }

    if (this.enviando || texto.trim() === '') {
      return;
    }

    this.enviando = true;

    const mensajeUsuario = { texto, tipo: 'usuario' as const };

    // ✅ Se emite y también se guarda el mensaje del usuario
    this.mensajeOutput.emit(mensajeUsuario);
    this.chatHistorial.addMessageToConversation(this.activeConversationId, mensajeUsuario);

    this.messageService.llamada(texto).subscribe({
      next: (respuesta: any) => {
        console.log('Respuesta del chatbot:', respuesta);
        const textoRespuesta = respuesta.answare || 'No se obtuvo respuesta del bot';
        const mensajeBot = { texto: textoRespuesta, tipo: 'bot' as const };

        this.chatHistorial.addMessageToConversation(this.activeConversationId, mensajeBot);
        this.mensajeOutput.emit(mensajeBot);
        this.enviando = false;
      },
      error: (error) => {
        console.error('Error al enviar mensaje:', error);
        this.enviando = false;
      }
    });

    this.inputPregunta.nativeElement.value = '';
    this.inputPregunta.nativeElement.focus();
  }
  }
