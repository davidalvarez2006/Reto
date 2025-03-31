import { Component } from '@angular/core';
import { ChatServiceHistorial, Conversation } from '../../services/chatSave-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  templateUrl: './Historial-sideBar.component.html',
  styleUrls: ['./Historial-sideBar.component.css'],
  imports: [CommonModule],
})
export class SidebarComponent {
  conversations$;

  constructor(private chatService: ChatServiceHistorial) {
    this.conversations$ = this.chatService.conversations$;
  }

  openConversation(id: number) {
    console.log('Abriendo conversación con ID:', id);
  }
}
