import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-chat-textbar',
  imports: [],
  template: `<p>chat-textbar works!</p>`,
  styleUrl: './chat-textbar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatTextbarComponent { }
