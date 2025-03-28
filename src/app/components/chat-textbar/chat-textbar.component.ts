import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-chat-textbar',
  imports: [],
  templateUrl: './chat-textbar.component.html',
  styleUrl: './chat-textbar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatTextbarComponent { }
