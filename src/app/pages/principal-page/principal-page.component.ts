import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChatHistorialComponent } from "../../components/chat-historial/chat-historial.component";
import { ChatTextbarComponent } from "../../components/chat-textbar/chat-textbar.component";
import {SidebarComponent } from "../../components/Historial-sideBar/Historial-sideBar.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-principal-page',
  imports: [ChatHistorialComponent, ChatTextbarComponent, SidebarComponent, ChatHistorialComponent, CommonModule],
  templateUrl: './principal-page.component.html',
  styleUrl: './principal-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrincipalPageComponent {
  mensajesGuardados: { texto: string; tipo: 'usuario' | 'bot' }[] = [];

  recibirMensaje(mensaje: { texto: string; tipo: 'usuario' | 'bot' }) {
    this.mensajesGuardados.push(mensaje);
    console.log('Mensaje guardado:', mensaje);
  }
 }
