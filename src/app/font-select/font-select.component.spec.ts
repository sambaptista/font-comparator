import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FontSelectComponent} from './font-select.component';

describe('FontSelectComponent', () => {
    let component: FontSelectComponent;
    let fixture: ComponentFixture<FontSelectComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FontSelectComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(FontSelectComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
