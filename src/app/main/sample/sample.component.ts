import { Component, ViewEncapsulation } from '@angular/core';
import { DareTranslationLoaderService } from '@dare/services/translation-loader.service';
import { locale as english } from './i18n/en';
import { locale as turkish } from './i18n/tr';
import { dareAnimations } from '@dare/animations';

@Component({
    selector: 'sample',
    templateUrl: './sample.component.html',
    styleUrls: ['./sample.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : dareAnimations
})
export class SampleComponent {

    menu: any[] = [
        {
            name: 'relaties',
            icon: 'list_alt'
        },
        {
            name: 'contactpersonen',
            icon: 'list_alt'
        },
        {
            name: 'concurrenten',
            icon: 'list_alt'
        },
        {
            name: 'leveradressen',
            icon: 'list_alt'
        },
        {
            name: 'instellingen crm',
            category: 'algemeen',
            icon: 'settings'
        },
        {
            name: 'adressen',
            category: 'algemeen',
            icon: 'settings'
        },
        {
            name: 'staten/provincies',
            category: 'algemeen',
            icon: 'settings'
        },
        {
            name: 'landen',
            category: 'algemeen',
            icon: 'settings',
            url: '/customers'
        },
        {
            name: 'talen',
            category: 'algemeen',
            icon: 'settings'
        },
        {
            name: 'relatietypes',
            category: 'algemeen',
            icon: 'settings'
        },
        {
            name: 'bedrijfstakken',
            category: 'algemeen',
            icon: 'settings'
        },
        {
            name: 'relatiegroepen',
            category: 'algemeen',
            icon: 'settings'
        },
        {
            name: 'verkoopregios',
            category: 'algemeen',
            icon: 'settings'
        },
        {
            name: 'relatiebronnen',
            category: 'algemeen',
            icon: 'settings'
        },
        {
            name: 'financiele status van relatie',
            category: 'algemeen',
            icon: 'settings'
        },
        {
            name: 'rechtsvormen',
            category: 'algemeen',
            icon: 'settings'
        },
        {
            name: 'titels',
            category: 'algemeen',
            icon: 'settings'
        },
        {
            name: 'functieniveaus',
            category: 'algemeen',
            icon: 'settings'
        },
        {
            name: 'functies',
            category: 'algemeen',
            icon: 'settings'
        },
        {
            name: 'personen',
            category: 'algemeen',
            icon: 'settings'
        }
    ];


    constructor(private _dareTranslationLoaderService: DareTranslationLoaderService) {
        this._dareTranslationLoaderService.loadTranslations(english, turkish);
    }
}
