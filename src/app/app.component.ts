import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TestButtonComponent } from "./test-button/test-button.component";
import { TestChatboxComponent } from "./test-chatbox/test-chatbox.component";
import { AvatarComponent } from "./avatar/avatar.component";
import { AudioRecorderComponent } from './audio-recorder/audio-recorder.component';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [RouterOutlet, TestButtonComponent, TestChatboxComponent, AvatarComponent, AudioRecorderComponent]
})
export class AppComponent {
  title = 'poc-angular-chat';
}
