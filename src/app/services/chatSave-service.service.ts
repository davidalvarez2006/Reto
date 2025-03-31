import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Conversation {
  id: number;
  title: string;
  messages: string[];
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

  addConversation(title: string, messages: string[]) {
    const newConversation: Conversation = { id: this.nextId++, title, messages };
    this.conversations.push(newConversation);
    this.updateConversations();
  }

  getConversationById(id: number): Conversation | undefined {
    return this.conversations.find((c) => c.id === id);
  }

  private updateConversations() {
    this.conversationsSubject.next([...this.conversations]);
  }

  private saveToLocalStorage() {
    localStorage.setItem('conversations', JSON.stringify(this.conversations));
  }

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
