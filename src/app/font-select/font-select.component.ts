import {Component, input, OnInit, output} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {Font} from '../services/font.service';

export type FontSelection = {
    selected: Font;
    next: Font;
};

@Component({
    selector: 'app-font-select',
    imports: [ReactiveFormsModule],
    templateUrl: './font-select.component.html',
    styleUrl: './font-select.component.scss',
    host: {
        '[tabIndex]': '1',
        '(focus)': 'onFocus()',
        '(blur)': 'onBlur()',
    },
})
export class FontSelectComponent implements OnInit {

    public readonly selectionChange = output<FontSelection | null>();

    private _focused = false;

    public onFocus(): void {
        this._focused = true;
    }

    public onBlur(): void {
        this._focused = false;
    }

    public readonly showClear = input(false);
    public readonly fonts = input.required<Font[]>();
    public readonly font = input<Font | null>(null);
    public readonly label = input('None');

    public ngOnInit(): void {
        this.handleKeydown();
    }

    private handleKeydown(): void {
        document.addEventListener('keydown', event => {
            if (!this._focused) {
                return;
            }

            switch (event.key) {
                case 'ArrowUp':
                case 'ArrowLeft':
                    this.selectPrevious();
                    event.preventDefault();
                    event.stopPropagation();
                    break;
                case 'ArrowDown':
                case 'ArrowRight':
                    this.selectNext();
                    event.preventDefault();
                    event.stopPropagation();
                    break;
            }
        });
    }

    public clear(): void {
        this.font = null;
        this.selectionChange.emit(null);
    }

    private selectNext(): void {
        this.font = this.getNextFont(1);
        this.selectionChange.emit({
            selected: this.font(),
            next: this.getNextFont(1, this.font()),
        });
    }

    private selectPrevious(): void {
        this.font = this.getNextFont(-1);
        this.selectionChange.emit({
            selected: this.font(),
            next: this.getNextFont(-1, this.font()),
        });
    }

    private getNextFont(delta = 1, font: Font | null = this.font()): Font {
        const currentIndex = this.getIndex(font || this.fonts()[this.fonts().length - 1]);
        const nextIndex = (currentIndex + delta) % this.fonts().length;
        return this.fonts()[nextIndex > -1 ? nextIndex : this.fonts().length - 1];
    }

    public getIndex(value: Font): number {
        return this.fonts().findIndex(font => font.family === value.family);
    }

    public randomize(): void {
        const randomIndex = Math.floor(Math.random() * this.fonts().length);
        this.font = this.fonts()[randomIndex];
        this.selectionChange.emit({
            selected: this.font(),
            next: this.font(),
        });
    }
}
