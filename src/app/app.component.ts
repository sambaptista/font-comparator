import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {Font, FontsService} from './services/font.service';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {FontSelectComponent, FontSelection} from './font-select/font-select.component';
import {CdkTextareaAutosize, TextFieldModule} from '@angular/cdk/text-field';
import * as categories from '../assets/categories.json';
import * as fonts from '../assets/fonts.json';
import {Subject, takeUntil} from 'rxjs';

type Model = {
    bodyFont: Font | null;
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [
        RouterModule,
        CommonModule,
        FormsModule,
        FontSelectComponent,
        TextFieldModule,
    ],
})
export class AppComponent implements OnInit {

    @ViewChildren('autosize') autosizes!: QueryList<CdkTextareaAutosize>;

    public globalSettings = {
        fontSize: 22,
        lineHeight: 1.7,
        fontWeight: 400,
        bgColor: '#ffffff',
        textColor: '#000000',
        wordSpacing: 0,
        letterSpacing: 0,
        italic: false,
        fontVariant: 'normal',
        align: 'left',
        allVariants: false,
        horizontal: false,
        logo: false
    };

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

    public models: Model[] = [
        {bodyFont: null},
    ];

    public titleText = 'Mon super titre';
    public bodyText = 'Par défaut, la balise dans HTML ne génère un événement que lorsque la sélection change, c\'est-à-dire lorsque l\'utilisateur clique pour sélectionner une option. Il n\'y a pas d\'événement intégré pour un changement de focus sur une option individuelle dans une liste déroulante.';

    public fonts: Font[] = (fonts as any).default;

    public constructor(public fontService: FontsService, private route: ActivatedRoute, private router: Router) {
    }

    public ngOnInit(): void {
        this.categories.push('slab');
        this.initSettings();
    }

    private firstInteraction = new Subject<void>();

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
        this.fontService.loadFont(font.selected);
        this.fontService.loadFont(font.next);
        setTimeout(() => this.autoresize(), 100);
    }

    public autoresize() {
        this.autosizes.toArray().forEach(autosize => {
            // autosize.reset();
            autosize.resizeToFitContent(true);
        });

        this.persist();
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
        this.models.push(Object.assign({}, model));
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
            this.models.push({bodyFont: null});
        }
    }

    public toggleLayout(): void {
        this.globalSettings.horizontal = !this.globalSettings.horizontal;
        setTimeout(() => this.autoresize(), 100);
    }

    public toggleLogoMode(): void {
        this.globalSettings.logo = !this.globalSettings.logo;
        this.globalSettings.fontSize = this.globalSettings.logo ? 90 : 22;
        setTimeout(() => this.autoresize(), 100);
    }

}
