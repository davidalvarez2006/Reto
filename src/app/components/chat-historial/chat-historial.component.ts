import { Component } from '@angular/core';
import { MessageService } from '../../services/chat-service.service';// Asegúrate de que la ruta sea la correcta

@Component({
  selector: 'app-chat-historial',
  templateUrl: './chat-historial.component.html',
  styleUrls: ['./chat-historial.component.css']
})
export class ChatHistorialComponent {


  constructor(private MessageService: MessageService) {}
  enviarPregunta(input: string) {
    this.MessageService.llamada(input).subscribe(
      (respuesta) => {
        console.log('Respuesta del servidor:', respuesta);
      },
      (error) => {
        console.error('Error al realizar la solicitud:', error);
      }
    );
  }
}
