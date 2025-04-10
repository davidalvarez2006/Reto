import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { ChatServiceHistorial, Conversation, Message } from '../../services/chatSave-service.service';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './Historial-sideBar.component.html',
  styleUrls: ['./Historial-sideBar.component.css'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  newChatTitle: string = '';
  conversations$: Observable<Conversation[]>;
  selectedChatId: number | null = null;
  isMobileMenuOpen: boolean = false;
  isMobile: boolean = false;

  // Se emite un objeto con el id y los mensajes de la conversación
  @Output() selectedConversation = new EventEmitter<{ id: number, mensajes: { texto: string; tipo: 'usuario' | 'bot' }[] }>();

  constructor(private chatService: ChatServiceHistorial) {
    this.conversations$ = this.chatService.conversations$;
  }

  ngOnInit() {
    this.checkIfMobile();
    window.addEventListener('resize', this.checkIfMobile);
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.checkIfMobile);
  }

  checkIfMobile = () => {
    this.isMobile = window.innerWidth <= 768;
  };

  openConversation(id: number) {
    this.selectedChatId = id;
    const conversation = this.chatService.getConversationById(id);
    if (conversation) {
      // Emitir tanto el id como los mensajes
      this.selectedConversation.emit({ id: conversation.id, mensajes: conversation.messages });
    } else {
      console.error('Conversation not found for id: ', id);
    }
    this.isMobileMenuOpen = false;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  createNewConversation() {
    if (this.newChatTitle.trim() !== '') {
      const maxLength = 15;
      const truncatedTitle = this.newChatTitle.length > maxLength
        ? this.newChatTitle.substring(0, maxLength) + '...'
        : this.newChatTitle;
      const newMessages: Message[] = [];
      this.chatService.addConversation(truncatedTitle, newMessages).subscribe({
        next: (savedConversation) => {
          this.chatService.fetchConversations();
          this.openConversation(savedConversation.id);
          this.newChatTitle = '';
        },
        error: (error) => {
          console.error('Error al crear nueva conversación', error);
        }
      });
    } else {
      alert('Por favor, ingresa un título para la nueva conversación.');
    }
  }

  deleteConversation(id: number): void {
    this.chatService.deleteConversation(id);
    if (this.selectedChatId === id) {
      this.selectedChatId = null;
      this.selectedConversation.emit({ id: 0, mensajes: [] });
    }
  }

  clearHistory() {
    this.chatService.clearConversations();
    this.selectedChatId = null;
  }




}
