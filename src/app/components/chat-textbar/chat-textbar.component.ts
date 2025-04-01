// import { ChangeDetectionStrategy, Component, EventEmitter, signal } from '@angular/core';
// import { MessageService } from '../../services/chat-service.service';

// @Component({
//   selector: 'app-chat-textbar',
//   imports: [],
//   templateUrl: './chat-textbar.component.html',
//   styleUrl: './chat-textbar.component.css',
//   changeDetection: ChangeDetectionStrategy.OnPush,
// })
// export class ChatTextbarComponent {

//   // enviarMensaje(texto: string) {
//   //   if (texto.trim() === '') return; // Evita enviar mensajes vacíos

//   //   console.log('Mensaje enviado:', texto);

//   //   this.messageService.llamada(texto).subscribe({
//   //     next: (response) => console.log('Respuesta del servidor:', response),
//   //     error: (error) => console.error('Error al enviar mensaje:', error)
//   //   });
//   // }
//   mensajes = signal<{ texto: string; tipo: 'usuario' | 'bot' }[]>([]);

//   constructor(private messageService: MessageService) {}
//   public inputOutput:string[] = []

//   enviarMensaje(texto: string) {
//     if (texto.trim() === '') return;

//     // Agregar mensaje del usuario
//     this.mensajes.update((msgs) => [...msgs, { texto, tipo: 'usuario' }]);

//     this.messageService.llamada(texto).subscribe({
//       next: (respuesta) => {
//         // Convertir respuesta a string si es un objeto
//         const textoRespuesta = typeof respuesta === 'string' ? respuesta : JSON.stringify(respuesta);

//         // Agregar respuesta del bot
//         this.mensajes.update((msgs) => [...msgs, { texto: textoRespuesta, tipo: 'bot' }]);
//       },
//       error: (error) => console.error('Error al enviar mensaje:', error)
//     });
//     this.inputOutput.push(texto);
//     console.log(this.inputOutput);

//   }

// }
import { ChangeDetectionStrategy, Component, EventEmitter, Output, signal } from '@angular/core';
import { MessageService } from '../../services/chat-service.service';

@Component({
  selector: 'app-chat-textbar',
  templateUrl: './chat-textbar.component.html',
  styleUrl: './chat-textbar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatTextbarComponent {

  mensajes = signal<{ texto: string; tipo: 'usuario' | 'bot' }[]>([]);

  @Output() mensajeOutput = new EventEmitter<{ texto: string; tipo: 'usuario' | 'bot' }>();

  constructor(private messageService: MessageService) {}

  enviarMensaje(texto: string) {
    if (texto.trim() === '') return;

    // Mensaje del usuario con tipo bien definido
    const mensajeUsuario: { texto: string; tipo: 'usuario' } = { texto, tipo: 'usuario' };
    this.mensajes.update((msgs) => [...msgs, mensajeUsuario]);
    this.mensajeOutput.emit(mensajeUsuario);

    this.messageService.llamada(texto).subscribe({
      next: (respuesta) => {
        const textoRespuesta = typeof respuesta === 'string' ? respuesta : JSON.stringify(respuesta);

        // Mensaje del bot con tipo bien definido
        const mensajeBot: { texto: string; tipo: 'bot' } = { texto: textoRespuesta, tipo: 'bot' };
        this.mensajes.update((msgs) => [...msgs, mensajeBot]);
        this.mensajeOutput.emit(mensajeBot);
      },
      error: (error) => console.error('Error al enviar mensaje:', error)
    });
  }
}




