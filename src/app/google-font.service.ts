import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

export type FontFiles = {
    regular: string;
    [key: string]: string;
}

export type Font = {
    family: string;
    variants: string[];
    subsets: string[];
    version: string;
    lastModified: string;
    files: FontFiles,
    category: string;
    kind: string;
    menu: string;
}

@Injectable({
    providedIn: 'root',
})
export class GoogleFontsService {
    private apiKey: string = 'AIzaSyDmg0eaJ5G5nN2IQtgqdgMfWqlof1R-ZFg';

    constructor(private http: HttpClient) {
    }

    public getFontsList(): Observable<any[]> {
        const apiUrl = `https://www.googleapis.com/webfonts/v1/webfonts?key=${this.apiKey}`;
        return this.http.get<any>(apiUrl).pipe(
            map(response => {
                return response.items;
            }),
        );
    }

    public filterFontsByCategory(category: string): Observable<any[]> {
        return this.getFontsList().pipe(
            map(fonts => fonts.filter(font => font.category === category)),
        );
    }
}
