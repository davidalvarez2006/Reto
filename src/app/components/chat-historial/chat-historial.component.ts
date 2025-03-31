import { Component } from "@angular/core";
import { ChatService } from "../../services/chat-service.service";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat-historial',
  templateUrl: './chat-historial.component.html',
  styleUrl: './chat-historial.component.css',
  imports: [CommonModule],
})
export class ChatHistorialComponent {
  messages: any[] = [];
  newMessage: string = '';

  constructor(private chatService: ChatService) {}

  sendMessage() {
    if (this.newMessage.trim() === '') return;

    this.chatService.sendMessage(this.newMessage).subscribe(response => {
      this.messages.push({ text: this.newMessage, sender: 'user' });
      this.newMessage = '';
    });
  }

  loadMessages() {
    this.chatService.getMessages().subscribe(response => {
      this.messages = response;
    });
  }

  ngOnInit() {
    this.loadMessages(); // Carga los mensajes al iniciar
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }
}



