import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { ChatServiceHistorial, Conversation, Message } from '../../services/chatSave-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sidebar',
  templateUrl: './Historial-sideBar.component.html',
  styleUrls: ['./Historial-sideBar.component.css'],
  imports: [CommonModule, FormsModule],
})
export class SidebarComponent implements OnInit {
  newChatTitle: string = '';
  conversations$;
  selectedChatId: number | null = null;
  isMobileMenuOpen: boolean = false; // Estado para el menú móvil
  isMobile: boolean = false; // Propiedad para verificar si es móvil

  @Output() selectedConversation = new EventEmitter<{ texto: string; tipo: 'usuario' | 'bot' }[]>();

  constructor(private chatService: ChatServiceHistorial) {
    this.conversations$ = this.chatService.conversations$;
  }

  ngOnInit() {
    this.checkIfMobile();
    window.addEventListener('resize', () => this.checkIfMobile()); // Escuchar el cambio de tamaño de la ventana

    // Cargar las conversaciones desde el servicio
    this.chatService.conversations$.subscribe({
      next: (conversations) => {
        this.conversations$ = conversations;
      },
      error: (error) => {
        console.error('Error al cargar las conversaciones:', error);
      }
    });
  }

  checkIfMobile() {
    this.isMobile = window.innerWidth <= 768; // Definir el tamaño del dispositivo como móvil si el ancho es <= 768px
  }

  openConversation(id: number) {
    this.selectedChatId = id;
    const conversation = this.chatService.getConversationById(id);
    if (conversation) {
      this.selectedConversation.emit(conversation.messages);
    }
    this.isMobileMenuOpen = false; // Cierra el menú al seleccionar
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  createNewConversation() {
    if (this.newChatTitle.trim() !== '') {
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
      this.selectedChatId = null;
    }
  }

  clearHistory() {
    this.chatService.clearConversations();
    this.selectedChatId = null;
  }
}
