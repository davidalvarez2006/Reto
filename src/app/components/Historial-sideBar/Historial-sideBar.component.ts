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
  newChatTitle: string = '';
  conversations$;
  selectedChatId: number | null = null; // 🔹 Variable para almacenar el ID del chat seleccionado

  @Output() selectedConversation = new EventEmitter<{ texto: string; tipo: 'usuario' | 'bot' }[]>();

  constructor(private chatService: ChatServiceHistorial) {
    this.conversations$ = this.chatService.conversations$;
  }

  openConversation(id: number) {
    this.selectedChatId = id; // 🔹 Marcar como seleccionado
    const conversation = this.chatService.getConversationById(id);
    if (conversation) {
      this.selectedConversation.emit(conversation.messages);
    }
  }

  createNewConversation() {
    if (this.newChatTitle.trim() !== '') {
      // Limitar la longitud del título a 15 caracteres y agregar "..."
      const maxLength = 9;
      const truncatedTitle = this.newChatTitle.length > maxLength
        ? this.newChatTitle.substring(0, maxLength) + '...'
        : this.newChatTitle;

      const newMessages: Message[] = [];
      const newId = this.chatService.addConversation(truncatedTitle, newMessages);
      this.openConversation(newId);
      this.newChatTitle = '';
    } else {
      alert('Por favor, ingresa un título para la nueva conversación.');
    }
  }


  deleteConversation(id: number): void {
    this.chatService.deleteConversation(id);
    if (this.selectedChatId === id) {
      this.selectedChatId = null; // 🔹 Desmarcar si se elimina el chat seleccionado
    }
  }

  clearHistory() {
    this.chatService.clearConversations();
    this.selectedChatId = null; // 🔹 Limpiar la selección
  }
}
