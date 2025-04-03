import { AfterViewChecked, Component, ElementRef, input, Input, signal, ViewChild } from '@angular/core';

@Component({
  selector: 'app-chat-historial',
  templateUrl: './chat-historial.component.html',
  styleUrls: ['./chat-historial.component.css'],
})
export class ChatHistorialComponent implements AfterViewChecked {
  @ViewChild('chatContainer') chatContainer!: ElementRef;
  mensajes = input<mensajes[]>()
  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    if (this.chatContainer) {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    }
  }

}

interface mensajes{
  texto: string;
  tipo: 'usuario' | 'bot' ;
}




