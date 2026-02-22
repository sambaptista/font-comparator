import {Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {TextFieldModule} from '@angular/cdk/text-field';

export type FontSettings = {
    fontSize?: number;
    lineHeight?: number;
    letterSpacing?: number;
    fontWeight?: number;
    wordSpacing?: number;
};

@Component({
    selector: 'app-font-settings',
    imports: [FormsModule, TextFieldModule],
    templateUrl: './font-settings.component.html',
    styleUrl: './font-settings.component.scss'
})
export class FontSettingsComponent {
    @Input() public model: FontSettings = {
        fontSize: 22,
        lineHeight: 1.7,
        wordSpacing: 0,
        letterSpacing: 0,
        fontWeight: 400,
    };

    @Output() selectionChange: EventEmitter<FontSettings> = new EventEmitter<FontSettings>();
    @Output() reset: EventEmitter<void> = new EventEmitter<void>();

    public change(): void {
        this.selectionChange.emit(this.model);
    }
}
