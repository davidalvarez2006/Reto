import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MessageService } from '../../services/chat-service.service';

@Component({
  selector: 'app-chat-textbar',
  imports: [],
  templateUrl: './chat-textbar.component.html',
  styleUrl: './chat-textbar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatTextbarComponent {
  constructor(private messageService: MessageService) {}
  public inputOutput:string[] = []

  enviarMensaje(texto: string) {
    if (texto.trim() === '') return; // Evita enviar mensajes vacíos

    console.log('Mensaje enviado:', texto);

    this.messageService.llamada(texto).subscribe({
      next: (response) => {
        console.log('Respuesta del servidor:', response);
        this.inputOutput.push(JSON.stringify(response));
        console.log(this.inputOutput);

      },
      error: (error) => console.error('Error al enviar mensaje:', error)
    });
    this.inputOutput.push(texto);
    console.log(this.inputOutput);

  }
}




