import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatTextbarComponent } from "./components/chat-textbar/chat-textbar.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ChatTextbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'reto';
}
