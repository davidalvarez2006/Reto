import { Component, Output, EventEmitter } from '@angular/core';
import { ChatServiceHistorial, Conversation, Message } from '../../services/chatSave-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sidebar',
  templateUrl: './Historial-sideBar.component.html',
  styleUrls: ['./Historial-sideBar.component.css'],
  imports: [CommonModule, FormsModule],
})
export class SidebarComponent {
  newChatTitle: string = '';  // Propiedad para almacenar el título del nuevo chat
  conversations$;

  @Output() selectedConversation = new EventEmitter<{ texto: string; tipo: 'usuario' | 'bot' }[]>(); // 🔹 Agregamos el Output

  constructor(private chatService: ChatServiceHistorial) {
    this.conversations$ = this.chatService.conversations$;
  }

  openConversation(id: number) {
    const conversation = this.chatService.getConversationById(id);
    if (conversation) {
      this.selectedConversation.emit(conversation.messages); // 🔹 Emitimos los mensajes al chat
    }
  }

  // Función para crear un nuevo chat con un título personalizado
  createNewConversation() {
    if (this.newChatTitle.trim() !== '') { // Aseguramos que el título no esté vacío
      const newMessages: Message[] = []; // Inicializa la lista de mensajes vacía
      const newId = this.chatService.addConversation(this.newChatTitle, newMessages); // Crea y agrega la nueva conversación con el título dado
      this.openConversation(newId); // Abre la conversación recién creada
      this.newChatTitle = ''; // Limpia el campo de entrada después de crear el chat
    } else {
      alert('Por favor, ingresa un título para la nueva conversación.');
    }
  }

  deleteConversation(id: number): void {
    this.chatService.deleteConversation(id);
  }

  clearHistory() {
    this.chatService.clearConversations(); // 🔹 Llama al servicio para limpiar las conversaciones
  }
}
