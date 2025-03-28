import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChatHistorialComponent } from "../../components/chat-historial/chat-historial.component";
import { ChatTextbarComponent } from "../../components/chat-textbar/chat-textbar.component";
import { HistorialSideBarComponent } from "../../components/Historial-sideBar/Historial-sideBar.component";

@Component({
  selector: 'app-principal-page',
  imports: [ChatHistorialComponent, ChatTextbarComponent, HistorialSideBarComponent],
  templateUrl: './principal-page.component.html',
  styleUrl: './principal-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrincipalPageComponent { }
