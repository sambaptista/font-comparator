import {Injectable} from '@angular/core';
import * as fonts from '../../assets/fonts.json';
import {intersection} from 'lodash-es';
import {first, fromEvent, map, Observable, of, take} from 'rxjs';

export type Font = {
    family: string;
    variants: string[],
    category: string;
}

@Injectable({
    providedIn: 'root',
})
export class FontsService {

    private loadedFonts: Record<string, true> = {};

    constructor() {
    }

    public filterFontsByCategory(selectedCategories: string[], selectedVariants: string[], allVariants: boolean): Font[] {
        const filteredFonts = (fonts as any).default.filter((font: Font) => {
            let categoryCheck = selectedCategories.length ? selectedCategories.includes(font.category) : true;
            categoryCheck = categoryCheck || this.hasCategoryInName(font, selectedCategories);
            const variant = this.hasVariant(font, selectedVariants, allVariants);
            return categoryCheck && variant;
        });

        return filteredFonts;
    }

    private hasCategoryInName(font: Font, selected: string[]): boolean {
        const result = selected.some(category => {
            return font.family.toLowerCase().includes(category.toLowerCase());
        });

        return result;
    }

    private hasVariant(font: Font, selected: string[], all: boolean): boolean {

        if (!selected.length) {
            return true;
        }

        // If "and", transform 300 into 300italic to match original font variants
        const italic = selected.includes('italic') && all;
        if (italic) {
            selected = selected.map(v => v !== 'italic' && v !== 'regular' ? v + 'italic' : v);
        }

        const common = intersection(selected, font.variants);

        return all ? common.length === selected.length : common.length > 0;
    }

    // public loadFont(font: Font): void {
    //     if (this.loadedFonts[font.family]) {
    //         return;
    //     }
    //
    //     this.loadedFonts[font.family] = true;
    //
    //     const linkElement = document.createElement('link');
    //     linkElement.rel = 'stylesheet';
    //     linkElement.href = this.generateGoogleFontsURL(font);
    //     document.head.appendChild(linkElement);
    // }

    public loadFont(font: Font): Observable<void> {
        if (this.loadedFonts[font.family]) {
            return of(undefined);
        }

        this.loadedFonts[font.family] = true;

        const linkElement = document.createElement('link');
        linkElement.rel = 'stylesheet';
        linkElement.href = this.generateGoogleFontsURL(font);
        document.head.appendChild(linkElement);

        return fromEvent(linkElement, 'load').pipe(map(() => undefined), first());
    }

    public generateGoogleFontsURL(font: Font): string {
        const formattedFamilyName = font.family.replace(' ', '+');
        const variants = this.getVariantsParams(font);
        return `https://fonts.googleapis.com/css2?family=${formattedFamilyName}${variants}&display=swap`;
    }

    public getVariantsParams(font: Font): string {

        const variablesValues: string[] = [];
        font.variants.forEach(variant => {
            if (variant === 'italic') {
                variablesValues.push('1,400');
            } else if (variant === 'regular') {
                variablesValues.push('0,400');
            } else {
                const italic = +variant.includes('italic');
                variablesValues.push(italic + ',' + variant.replace('italic', ''));
            }
        });

        return ':ital,wght@' + variablesValues.sort().join(';');

    }

}
