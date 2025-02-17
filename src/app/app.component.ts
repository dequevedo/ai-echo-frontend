import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TestChatboxComponent } from "./components/test-chatbox/test-chatbox.component";
import { AvatarComponent } from "./components/avatar/avatar.component";
import { HttpClientModule } from '@angular/common/http';
import { ChatBubbleComponent } from "./components/chat-bubble/chat-bubble.component";

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [RouterOutlet, TestChatboxComponent, AvatarComponent, HttpClientModule, ChatBubbleComponent]
})
export class AppComponent {
  title = 'poc-angular-chat';
}
