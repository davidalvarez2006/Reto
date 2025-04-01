import { Component, input, Input, signal } from '@angular/core';
import { MessageService } from '../../services/chat-service.service';// Asegúrate de que la ruta sea la correcta

@Component({
  selector: 'app-chat-historial',
  templateUrl: './chat-historial.component.html',
  styleUrls: ['./chat-historial.component.css'],
})
export class ChatHistorialComponent {
  mensajes = input<mensajes[]>()
}

interface mensajes{
  texto: string;
  tipo: 'usuario' | 'bot' ;
}




