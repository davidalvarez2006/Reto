import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Message {
  texto: string;
  tipo: 'usuario' | 'bot';
}

export interface Conversation {
  id: number;
  title: string;
  messages: Message[];
}

@Injectable({
  providedIn: 'root',
})
export class ChatServiceHistorial implements OnDestroy {
  private conversations: Conversation[] = [];
  private conversationsSubject = new BehaviorSubject<Conversation[]>([]);
  conversations$ = this.conversationsSubject.asObservable();
  private nextId = 1;

  constructor() {
    this.loadFromLocalStorage();
    window.addEventListener('beforeunload', () => this.saveToLocalStorage());
  }

  /**
   * Crea una nueva conversación en el historial.
   */
  addConversation(title: string, messages: Message[]): number {
    const newConversation: Conversation = { id: this.nextId++, title, messages };
    this.conversations.push(newConversation);
    this.updateConversations();
    this.saveToLocalStorage(); // Guarda en localStorage
    return newConversation.id; // 🔹 Ahora retorna el ID
  }



  /**
   * Agrega un mensaje a una conversación existente.
   */
  addMessageToConversation(conversationId: number, message: { texto: string; tipo: 'usuario' | 'bot' }) {
    const conversation = this.conversations.find(c => c.id === conversationId);
    if (conversation) {
      conversation.messages.push(message);
      this.updateConversations();
    }
  }


  /**
   * Obtiene una conversación específica por su ID.
   */
  getConversationById(id: number): Conversation | undefined {
    return this.conversations.find(c => c.id === id);
  }

  /**
   * Actualiza la lista de conversaciones y guarda en `localStorage`.
   */
  private updateConversations() {
    this.conversationsSubject.next([...this.conversations]);
    this.saveToLocalStorage();
  }

  /**
   * Guarda el historial de chats en `localStorage`.
   */
  private saveToLocalStorage() {
    localStorage.setItem('conversations', JSON.stringify(this.conversations));
  }

  /**
   * Carga las conversaciones guardadas en `localStorage`.
   */
  private loadFromLocalStorage() {
    const storedData = localStorage.getItem('conversations');
    if (storedData) {
      this.conversations = JSON.parse(storedData);
      this.nextId = this.conversations.length > 0 ? Math.max(...this.conversations.map(c => c.id)) + 1 : 1;
      this.conversationsSubject.next(this.conversations);
    }
  }

  ngOnDestroy() {
    this.saveToLocalStorage();
    window.removeEventListener('beforeunload', () => this.saveToLocalStorage());
  }
}
