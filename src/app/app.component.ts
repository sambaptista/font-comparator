import {AfterViewInit, Component, ElementRef, NgZone, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {Font, FontsService} from './services/font.service';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {FontSelectComponent, FontSelection} from './font-select/font-select.component';
import {CdkTextareaAutosize, TextFieldModule} from '@angular/cdk/text-field';
import * as categories from '../assets/categories.json';
import * as fonts from '../assets/fonts.json';
import {delay, first, Subject, takeUntil} from 'rxjs';
import {FontSettings, FontSettingsComponent} from './font-settings/font-settings.component';
import {CdkDragDrop, DragDropModule, moveItemInArray} from '@angular/cdk/drag-drop';

type Model = FontSettings & {
    bodyFont: Font | null;
}

type Settings = FontSettings & {
    bgColor: string;
    textColor: string;
    italic: boolean;
    fontVariant: string;
    align: string;
    allVariants: boolean;
    horizontal: boolean;
    logo: boolean;
    expanded: boolean;
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [
        RouterModule,
        CommonModule,
        FontSelectComponent,
        FormsModule,
        TextFieldModule,
        FontSettingsComponent,
        DragDropModule,
    ],
})
export class AppComponent implements OnInit, AfterViewInit {

    @ViewChildren('autosize') autosizes!: QueryList<CdkTextareaAutosize>;
    @ViewChildren('modelElement') modelElements!: QueryList<ElementRef<HTMLElement>>;
    @ViewChild('modelsWrapper', {static: true}) modelsWrapper!: ElementRef<HTMLElement>;

    private readonly defaultFontSettings = {
        fontSize: 22,
        lineHeight: 1.7,
        wordSpacing: 0,
        letterSpacing: 0,
        fontWeight: 400,
    };

    private readonly defaultModel: Model = {bodyFont: null};

    public globalSettings: Settings = Object.assign({
        bgColor: '#ffffff',
        textColor: '#000000',
        italic: false,
        fontVariant: 'normal',
        align: 'left',
        allVariants: false,
        horizontal: false,
        logo: false,
        expanded: false,
    }, this.defaultFontSettings);

    /**
     * Variants
     */
    public variants = [
        'italic',
        '100',
        '200',
        '300',
        'regular',
        '500',
        '600',
        '700',
        '800',
        '900',
    ];


    public selectedVariants: {[key: string]: boolean} = {'regular': true};

    /**
     * Categories
     */
    public categories: string[] = (categories as any).default;
    public selectedCategories: {[key: string]: boolean} = {};
    public models: Model[] = [this.defaultModel];
    public titleText = 'Culture of typography';
    public bodyText = 'Typography is more than mere text formatting. It\'s the art and science of visually presenting information, where every character, space, and typographic element contributes to readability, understanding, and impact. Typography encompasses font selection, layout, spacing, color, and visual hierarchy, providing a visual language that guides the reader through the content. Well-designed typography can enhance clarity, bolster credibility, and evoke emotion. It transcends words to bring writing to life, making each text a unique and memorable visual experience.';
    public fonts: Font[] = (fonts as any).default;
    private firstInteraction = new Subject<void>();

    public constructor(
        public fontService: FontsService,
        private route: ActivatedRoute,
        private router: Router,
    ) {
    }

    public ngOnInit(): void {
        this.categories.push('slab');
        this.initSettings();
        this.handleEvents();
    }

    public ngAfterViewInit(): void {
        this.autosizes.changes.pipe(first(), delay(150)).subscribe(() => this.autoresize());
    }

    public handleEvents(): void {
        document.addEventListener('keydown', event => {

            if (document.activeElement !== document.body && document.activeElement !== document.documentElement) {
                return;
            }

            let delta = 0;

            switch (event.key) {
                case 'ArrowUp':
                case 'ArrowLeft':
                    delta = -1;
                    event.preventDefault();
                    break;
                case 'ArrowDown':
                case 'ArrowRight':
                    delta = 1;
                    event.preventDefault();
                    break;
            }

            if (event.key === ' ') {
                delta = event.shiftKey ? -1 : 1;
                event.preventDefault();
            }

            if (!delta) {
                return;
            }

            const isHorizontal = this.globalSettings.horizontal;
            const element = this.getNextModelElement(isHorizontal ? 'left' : 'top', isHorizontal ? 200 : 0, delta < 0);

            if (!element) {
                return;
            }

            element.scrollIntoView({behavior: 'instant', block: 'start', inline: 'start'});
        });
    }

    private getNextModelElement(attribute: 'top' | 'left', offset: number, reverse: boolean = false): HTMLElement | null {

        let items = this.modelElements.toArray();
        items = reverse ? items.reverse() : items;
        const result = items.find((element: ElementRef) => {
            if (reverse) {
                return element.nativeElement.getBoundingClientRect()[attribute] < offset;
            } else {
                return element.nativeElement.getBoundingClientRect()[attribute] > offset;
            }
        });

        return result?.nativeElement || null;
    }

    public initSettings(): void {
        this.route.queryParams.pipe(takeUntil(this.firstInteraction)).subscribe(params => {
            if (params['settings']) {
                const settings = JSON.parse(params['settings']);

                if (settings.categories) settings.categories.forEach((c: string) => this.selectedCategories[c] = true);
                if (settings.variants) settings.variants.forEach((v: string) => this.selectedVariants[v] = true);
                if (settings.titleText) this.titleText = settings.titleText === 'empty' ? '' : settings.titleText;
                if (settings.bodyText) this.bodyText = settings.bodyText === 'empty' ? '' : settings.bodyText;

                if (settings.models) {
                    this.models = settings.models;
                    this.models.forEach(model => model.bodyFont ? this.fontService.loadFont(model.bodyFont) : null);
                    this.addModelIfEmpty();
                }

                if (settings.globalStyles) {
                    this.globalSettings = Object.assign(this.globalSettings, settings.globalStyles);
                }

                this.filterFonts(false);
                this.autoresize(false);
            }
        });
    }

    public persist(): void {
        this.firstInteraction.next();
        const params = {
            categories: this.filterTrueValues(this.selectedCategories),
            variants: this.filterTrueValues(this.selectedVariants),
            globalStyles: this.globalSettings,
            models: this.models,
            titleText: this.titleText || 'empty',
            bodyText: this.bodyText || 'empty',
        };

        const queryParams = {settings: JSON.stringify(params)};
        this.router.navigate([], {queryParams: queryParams});
    }

    public filterFonts(persist: boolean = true): void {
        this.fonts = this.fontService.filterFontsByCategory(this.filterTrueValues(this.selectedCategories), this.filterTrueValues(this.selectedVariants), this.globalSettings.allVariants);
        if (persist) {
            this.persist();
        }
    }

    public useFont(font: FontSelection): void {
        this.fontService.loadFont(font.selected).subscribe(() => this.autoresize());
        this.fontService.loadFont(font.next);
    }

    public autoresize(persist: boolean = true) {

        this.autosizes.toArray().forEach(autosize => {
            autosize.reset();
            autosize.resizeToFitContent(true);
        });

        if (persist) {
            this.persist();
        }
    }

    private filterTrueValues(obj: {[key: string]: boolean}): string[] {
        const filteredObj: any = {};
        for (const key in obj) {
            if (obj[key]) {
                filteredObj[key] = true;
            }
        }
        return Object.keys(filteredObj);
    }

    public duplicate(model: Model): void {
        this.addModel(model);
        this.persist();
    }

    public remove(index: number): void {
        this.models.splice(index, 1);
        this.addModelIfEmpty();
        this.persist();
    }

    public swapColors(): void {
        const tempColor = this.globalSettings.textColor;
        this.globalSettings.textColor = this.globalSettings.bgColor;
        this.globalSettings.bgColor = tempColor;
        this.persist();
    }

    public addModelIfEmpty(): void {
        if (!this.models.length) {
            this.models.push(this.defaultModel);
        }
    }

    public toggleLayout(): void {
        this.globalSettings.horizontal = !this.globalSettings.horizontal;
        setTimeout(() => this.autoresize(), 100);
    }

    public toggleExpanded(): void {
        this.globalSettings.expanded = !this.globalSettings.expanded;
        setTimeout(() => this.autoresize(), 100);
    }

    public toggleLogoMode(): void {
        this.globalSettings.logo = !this.globalSettings.logo;
        this.globalSettings.fontSize = this.globalSettings.logo ? 90 : 22;
        setTimeout(() => this.autoresize(), 100);
    }

    public getFontSetting(model: Model, name: keyof FontSettings): number | null {
        return model[name] || this.globalSettings[name] || null;
    }

    public resetFontSettings(model: Model): void {
        delete model.wordSpacing;
        delete model.fontSize;
        delete model.fontWeight;
        delete model.letterSpacing;
        delete model.lineHeight;
        this.autoresize();
    }

    public resetGlobalFontSettings(): void {
        this.globalSettings = Object.assign(this.globalSettings, this.defaultFontSettings);
        this.autoresize();
    }

    public addModel(model: Model = this.defaultModel): void {
        this.models.push(Object.assign({}, model));
        setTimeout(() => {
            this.modelElements.last.nativeElement.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'start'});
        }, 20);
    }

    public drop(event: CdkDragDrop<Model[]>) {
        moveItemInArray(this.models, event.previousIndex, event.currentIndex);
        this.persist();
    }
}
