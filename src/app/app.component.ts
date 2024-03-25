import {Component, OnInit} from '@angular/core';
import {Font, GoogleFontsService} from './google-font.service';
import {RouterModule} from '@angular/router';
import * as fonts from '../assets/fonts.json';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

const font = new FontFace('Aclonica', 'url(https://fonts.gstatic.com/s/aclonica/v22/K2FyfZJVlfNNSEBXGb7TCI6oBjLz.ttf)');

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [
        RouterModule,
        CommonModule,
        FormsModule
    ],
})
export class AppComponent implements OnInit {
    public fonts: Font[] = (fonts as any).default;

    public font1: Font | null = null;
    public font2: Font | null = null;

    public constructor(private readonly fontService: GoogleFontsService) {

    }

    public ngOnInit(): void {
        console.log('init', this.fonts);
        // this.fontService.getFontsList().subscribe(result => {
        //     console.log('result', result);
        // });
    }

    public useFont2(font: Font, element: HTMLDivElement): void {
        console.log('event', font);
        this.loadFont2(font );
        element.style.fontFamily = font.family;
    }

    public loadFont2(font: Font): void {
        let newStyle = document.createElement('style');
        newStyle.appendChild(document.createTextNode(`
            @font-face {
              font-family: ${font.family};
              src: url(${font.files.regular});
              font-style: normal;
            }
          `));
        document.head.appendChild(newStyle);
    }

    public useFont(font: Font, element: HTMLDivElement): void {
        const f = new FontFace(font.family, `url(${font.files.regular})`);
        this.loadFont(f);
        element.style.fontFamily = font.family;
    }

    public loadFont(font: FontFace): void {
        font.load().then(function(loadedFace) {
            (document.fonts as any).add(loadedFace);
        }).catch(function(error) {
            // handle error
            console.log('Failed to load font: ' + error);
        });
    }


}
