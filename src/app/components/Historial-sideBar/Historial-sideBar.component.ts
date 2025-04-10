import {
  Component,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy
} from '@angular/core';
import {
  ChatServiceHistorial,
  Conversation,
  Message
} from '../../services/chatSave-service.service';
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

  /** Título ingresado por el usuario para nueva conversación */
  newChatTitle: string = '';

  /** Observable de la lista de conversaciones */
  conversations$: Observable<Conversation[]>;

  /** ID de la conversación seleccionada */
  selectedChatId: number | null = null;

  /** Controla visibilidad del menú en dispositivos móviles */
  isMobileMenuOpen: boolean = false;

  /** Indica si se está usando una pantalla de móvil */
  isMobile: boolean = false;

  /** Emisor para enviar la conversación seleccionada (ID y mensajes) al componente padre */
  @Output() selectedConversation = new EventEmitter<{
    id: number,
    mensajes: { texto: string; tipo: 'usuario' | 'bot' }[]
  }>();

  constructor(private chatService: ChatServiceHistorial) {
    // Se enlaza el observable de conversaciones del servicio
    this.conversations$ = this.chatService.conversations$;
  }

  /** Inicialización: detecta si está en móvil y escucha cambios de tamaño */
  ngOnInit(): void {
    this.checkIfMobile();
    window.addEventListener('resize', this.checkIfMobile);
  }

  /** Limpieza: remueve listener de redimensionamiento */
  ngOnDestroy(): void {
    window.removeEventListener('resize', this.checkIfMobile);
  }

  /** Verifica si la pantalla es móvil y actualiza `isMobile` */
  checkIfMobile = (): void => {
    this.isMobile = window.innerWidth <= 768;
  };

  /** Abre una conversación existente por ID */
  openConversation(id: number): void {
    this.selectedChatId = id;
    const conversation = this.chatService.getConversationById(id);

    if (conversation) {
      // Emitir el ID y los mensajes al componente padre
      this.selectedConversation.emit({
        id: conversation.id,
        mensajes: conversation.messages
      });
    } else {
      console.error('Conversation not found for id:', id);
    }

    // En móvil, cerrar el menú al seleccionar conversación
    this.isMobileMenuOpen = false;
  }

  /** Muestra u oculta el menú lateral en móviles */
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  /** Crea una nueva conversación si el input no está vacío */
  createNewConversation(): void {
    const title = this.newChatTitle.trim();

    if (title !== '') {
      const maxLength = 15;

      // Truncar título si excede el máximo
      const truncatedTitle = title.length > maxLength
        ? title.substring(0, maxLength) + '...'
        : title;

      const newMessages: Message[] = [];

      // Agregar conversación a través del servicio
      this.chatService.addConversation(truncatedTitle, newMessages).subscribe({
        next: (savedConversation) => {
          this.chatService.fetchConversations(); // Actualiza la lista
          this.openConversation(savedConversation.id); // Abre la nueva
          this.newChatTitle = ''; // Limpia input
        },
        error: (error) => {
          console.error('Error al crear nueva conversación', error);
        }
      });
    } else {
      alert('Por favor, ingresa un título para la nueva conversación.');
    }
  }

  /** Elimina una conversación por ID */
  deleteConversation(id: number): void {
    this.chatService.deleteConversation(id);

    // Si la conversación eliminada estaba seleccionada, limpiar estado
    if (this.selectedChatId === id) {
      this.selectedChatId = null;
      this.selectedConversation.emit({ id: 0, mensajes: [] });
    }
  }

  /** Limpia todo el historial de conversaciones */
  clearHistory(): void {
    this.chatService.clearConversations();
    this.selectedChatId = null;
  }
}
