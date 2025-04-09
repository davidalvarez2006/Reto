import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { ChatServiceHistorial, Conversation, Message } from '../../services/chatSave-service.service';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sidebar',
  templateUrl: './Historial-sideBar.component.html',
  styleUrls: ['./Historial-sideBar.component.css'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  newChatTitle: string = '';
  conversations$: Observable<Conversation[]>;
  selectedChatId: number | null = null;
  isMobileMenuOpen: boolean = false;
  isMobile: boolean = false;

  @Output() selectedConversation = new EventEmitter<{ texto: string; tipo: 'usuario' | 'bot' }[]>();

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
      this.selectedConversation.emit(conversation.messages);
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
      const maxLength = 15;  // Se recomienda hacerlo configurable si es posible
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
      this.selectedConversation.emit([]);
    }
  }

  clearHistory() {
    this.chatService.clearConversations();
    this.selectedChatId = null;
  }
}
