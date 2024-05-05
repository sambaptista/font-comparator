import {Component, EventEmitter, HostBinding, HostListener, Input, OnInit, Output} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {Font} from '../services/font.service';
import {CommonModule} from '@angular/common';

export type FontSelection = {
    selected: Font;
    next: Font;
};

@Component({
    selector: 'app-font-select',
    standalone: true,
    imports: [ReactiveFormsModule],
    templateUrl: './font-select.component.html',
    styleUrl: './font-select.component.scss',
})
export class FontSelectComponent implements OnInit {
    @HostBinding('tabindex') tabindex = 1;

    @Output() selectionChange: EventEmitter<FontSelection | null> = new EventEmitter<FontSelection | null>();

    @HostListener('focus')
    public onFocus() {
        this._focused = true;
    }

    @HostListener('blur')
    public onBlur() {
        this._focused = false;
    }

    @Input() public showClear = false;
    @Input({required: true}) public fonts: Font[] = [];
    @Input() public font: Font | null = null;
    @Input() public label: string = 'None';

    private _focused = false;

    public constructor() {}

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
            selected: this.font,
            next: this.getNextFont(1, this.font),
        });
    }

    private selectPrevious(): void {
        this.font = this.getNextFont(-1);
        this.selectionChange.emit({
            selected: this.font,
            next: this.getNextFont(-1, this.font),
        });
    }

    private getNextFont(delta: number = 1, font: Font | null = this.font): Font {
        const currentIndex = this.getIndex(font || this.fonts[this.fonts.length - 1]);
        const nextIndex = (currentIndex + delta) % this.fonts.length;
        return this.fonts[nextIndex > -1 ? nextIndex : this.fonts.length - 1];
    }

    public getIndex(value: Font) {
        return this.fonts.findIndex(font => font.family === value.family);
    }

    public randomize(): void {
        const randomIndex = Math.floor(Math.random() * this.fonts.length);
        this.font = this.fonts[randomIndex];
        this.selectionChange.emit({
            selected: this.font,
            next: this.font,
        });
    }
}
