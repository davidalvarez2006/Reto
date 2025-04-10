import { ChangeDetectionStrategy, Component, ChangeDetectorRef } from '@angular/core';
import { ChatHistorialComponent } from '../../components/chat-historial/chat-historial.component';
import { ChatTextbarComponent } from '../../components/chat-textbar/chat-textbar.component';
import { SidebarComponent } from '../../components/Historial-sideBar/Historial-sideBar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-principal-page',
  imports: [ChatHistorialComponent, ChatTextbarComponent, SidebarComponent, CommonModule],
  templateUrl: './principal-page.component.html',
  styleUrl: './principal-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrincipalPageComponent {
  // Array de mensajes para la conversación activa
  mensajesGuardados: { texto: string; tipo: 'usuario' | 'bot' }[] = [];
  // ID de la conversación activa (0 si no hay ninguna seleccionada)
  activeConversationId: number = 0;

  constructor(private cdr: ChangeDetectorRef) {}

  // Este método se invoca desde el Sidebar al seleccionar (o crear) una conversación.
  actualizarConversacion(event: { id: number, mensajes: { texto: string; tipo: 'usuario' | 'bot' }[] }) {
    this.activeConversationId = event.id;
    this.mensajesGuardados = event.mensajes;
    console.log('Conversación actualizada: ID=', this.activeConversationId, 'Mensajes:', this.mensajesGuardados);
    this.cdr.detectChanges();
  }

  // Este método se invoca cuando el ChatTextbar emite un nuevo mensaje.
  recibirMensaje(mensaje: { texto: string; tipo: 'usuario' | 'bot' }) {
    this.mensajesGuardados = [...this.mensajesGuardados, mensaje];
    console.log('Mensaje guardado:', mensaje);
    this.cdr.detectChanges();
  }
}
