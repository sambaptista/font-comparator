import {Component, input, output} from '@angular/core';
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
    styleUrl: './font-settings.component.scss',
})
export class FontSettingsComponent {
    public readonly model = input<FontSettings>({
        fontSize: 22,
        lineHeight: 1.7,
        wordSpacing: 0,
        letterSpacing: 0,
        fontWeight: 400,
    });

    public readonly selectionChange = output<FontSettings>();
    public readonly resetFired = output();

    public change(): void {
        this.selectionChange.emit(this.model());
    }
}
