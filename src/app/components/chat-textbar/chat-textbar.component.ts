import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, signal, ViewChild } from '@angular/core';
import { MessageService } from '../../services/chat-service.service';
import { ChatServiceHistorial } from '../../services/chatSave-service.service';

@Component({
  selector: 'app-chat-textbar',
  templateUrl: './chat-textbar.component.html',
  styleUrls: ['./chat-textbar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatTextbarComponent {
  mensajes = signal<{ texto: string; tipo: 'usuario' | 'bot' }[]>([]);
  @Output() mensajeOutput = new EventEmitter<{ texto: string; tipo: 'usuario' | 'bot' }>();
  @ViewChild('inputPregunta')
  inputPregunta!: ElementRef;

  private activeConversationId: number;

  constructor(private messageService: MessageService, private chatHistorial: ChatServiceHistorial) {
    // Creamos una nueva conversación al iniciar
    this.activeConversationId = this.chatHistorial.addConversation('Nueva Conversación', []);
  }

  // Función para truncar el mensaje si es demasiado largo
  truncateMessage(message: string, maxLength: number = 10): string {
    if (message.length > maxLength) {
      return message.substring(0, maxLength) + '...'; // Trunca y agrega los puntos suspensivos
    }
    return message; // Devuelve el mensaje tal cual si no es largo
  }

  // Método para enviar un mensaje
  enviarMensaje(texto: string) {
    if (texto.trim() === '') return;

    const mensajeUsuario: { texto: string; tipo: 'usuario' } = { texto, tipo: 'usuario' };
    this.mensajes.update((msgs) => [...msgs, mensajeUsuario]);
    this.mensajeOutput.emit(mensajeUsuario);

    // Guarda la primera conversación con el primer mensaje del usuario como título
    if (this.mensajes().length === 1) { // Solo el primer mensaje
      const firstMessage = this.truncateMessage(texto); // Truncamos el primer mensaje si es largo
      this.activeConversationId = this.chatHistorial.addConversation(firstMessage, [mensajeUsuario]);
    } else {
      const truncatedMessage = this.truncateMessage(mensajeUsuario.texto); // Truncamos el mensaje antes de agregarlo
      this.chatHistorial.addMessageToConversation(this.activeConversationId, { ...mensajeUsuario, texto: truncatedMessage });
    }

    // Llamada al bot y agregar respuesta
    this.messageService.llamada(texto).subscribe({
      next: (respuesta) => {
        const textoRespuesta = typeof respuesta === 'string' ? respuesta : JSON.stringify(respuesta);
        const mensajeBot: { texto: string; tipo: 'bot' } = { texto: textoRespuesta, tipo: 'bot' };

        this.mensajes.update((msgs) => [...msgs, mensajeBot]);
        this.mensajeOutput.emit(mensajeBot);

        this.chatHistorial.addMessageToConversation(this.activeConversationId, mensajeBot);
      },
      error: (error) => console.error('Error al enviar mensaje:', error),
    });

    this.inputPregunta.nativeElement.value = '';  // Limpiar el campo de texto
    this.inputPregunta.nativeElement.focus();
  }

  // Método para iniciar una nueva conversación (Nuevo Chat)
 
  nuevoChat() {
    // Limpiar los mensajes actuales de la interfaz
    this.mensajes.update(() => []); // Vaciar el historial de mensajes

    // Crear una nueva conversación
    this.activeConversationId = this.chatHistorial.addConversation('Nueva Conversación', []);

    // Limpiar el campo de texto de entrada
    this.inputPregunta.nativeElement.value = '';

    // Focalizar el input para que el usuario pueda escribir
    this.inputPregunta.nativeElement.focus();
  }
}
