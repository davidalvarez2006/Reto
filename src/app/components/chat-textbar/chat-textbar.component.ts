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
  // Estado para indicar si un mensaje está siendo enviado
  enviando: boolean = false;

  // Entrada del ID de la conversación activa
  @Input() activeConversationId: number = 0;

  // Emisión de un mensaje hacia el componente padre
  @Output() mensajeOutput = new EventEmitter<{ texto: string; tipo: 'usuario' | 'bot' }>();

  // Referencia al campo de texto donde se escribe la pregunta
  @ViewChild('inputPregunta') inputPregunta!: ElementRef;

  constructor(
    private messageService: MessageService,  // Servicio para enviar mensajes al bot
    private chatHistorial: ChatServiceHistorial  // Servicio para gestionar el historial de chats
  ) {}

  /**
   * Método para enviar un mensaje al bot.
   * @param texto El texto del mensaje a enviar.
   * @param event Evento opcional para evitar la acción por defecto (cuando se presiona enter).
   */
  enviarMensaje(texto: string, event?: KeyboardEvent) {
    // Evitar la acción por defecto del evento si se pasa como parámetro
    if (event) {
      event.preventDefault();
    }

    // Evitar enviar si ya se está enviando un mensaje o si el texto está vacío
    if (this.enviando || texto.trim() === '') {
      return;
    }

    // Cambiar el estado de "enviando" para evitar duplicados
    this.enviando = true;

    // Crear el mensaje del usuario y emitirlo hacia el componente padre
    const mensajeUsuario = { texto, tipo: 'usuario' as const };
    this.mensajeOutput.emit(mensajeUsuario);

    // Guardar el mensaje en el historial de la conversación
    this.chatHistorial.addMessageToConversation(this.activeConversationId, mensajeUsuario);

    // Llamada al servicio para obtener la respuesta del bot
    this.messageService.llamada(texto).subscribe({
      // Si la respuesta es exitosa, procesamos el mensaje del bot
      next: (respuesta: any) => {
        console.log('Respuesta del chatbot:', respuesta);

        // Extraemos el texto de la respuesta del bot
        const textoRespuesta = respuesta.answare || 'No se obtuvo respuesta del bot';
        const mensajeBot = { texto: textoRespuesta, tipo: 'bot' as const };

        // Guardamos el mensaje del bot en el historial y lo emitimos
        this.chatHistorial.addMessageToConversation(this.activeConversationId, mensajeBot);
        this.mensajeOutput.emit(mensajeBot);

        // Restauramos el estado de "enviando"
        this.enviando = false;
      },
      // Manejo de errores al enviar el mensaje
      error: (error) => {
        console.error('Error al enviar mensaje:', error);
        this.enviando = false;  // Restauramos el estado de "enviando" incluso con error
      }
    });

    // Limpiar el campo de texto y enfocar el cursor después de enviar
    this.inputPregunta.nativeElement.value = '';
    this.inputPregunta.nativeElement.focus();
  }
}
