
import { Component, Output, EventEmitter } from '@angular/core';
import { ChatServiceHistorial, Conversation, Message } from '../../services/chatSave-service.service';
import { CommonModule } from '@angular/common';
import { DataBaseService } from '../../services/DataBase-service.service.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './Historial-sideBar.component.html',
  styleUrls: ['./Historial-sideBar.component.css'],
  imports: [CommonModule],
})
export class SidebarComponent {
  conversations$;

  @Output() selectedConversation = new EventEmitter<{ texto: string; tipo: 'usuario' | 'bot' }[]>(); // 🔹 Agregamos el Output

  constructor(private chatService: ChatServiceHistorial, private DataBaseService: DataBaseService ) {
    this.conversations$ = this.chatService.conversations$;
  }

  openConversation(id: number) {
    const conversation = this.chatService.getConversationById(id);
    if (conversation) {
      this.selectedConversation.emit(conversation.messages); // 🔹 Emitimos los mensajes al chat
    }
  }
  clearHistory() {
    this.chatService.clearConversations(); // 🔹 Llama al servicio para limpiar las conversaciones
  }
  createNewConversation() {
    const newTitle = 'Nueva Conversación'; // Puedes personalizar el título o solicitarlo al usuario
    const newMessages: Message[] = []; // Inicializa la lista de mensajes vacía
    this.chatService.addConversation(newTitle, newMessages); // Crea y agrega la nueva conversación
  }

}
