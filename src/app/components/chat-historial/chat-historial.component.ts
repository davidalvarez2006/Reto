import { Component, input, Input, signal } from '@angular/core';

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




