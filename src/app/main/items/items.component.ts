import { Component, ViewEncapsulation } from '@angular/core';

import { DareTranslationLoaderService } from '@dare/services/translation-loader.service';

import { locale as english } from './i18n/en';
import { locale as turkish } from './i18n/tr';
import { dareAnimations } from '@dare/animations';

@Component({
    selector: 'item',
    templateUrl: './items.component.html',
    styleUrls: ['./items.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : dareAnimations

})
export class ItemComponent {

    menu: any[] = [
        {
            name: 'artikelen',
            icon: 'list_alt'
        },
        {
            name: 'diversen',
            icon: 'list_alt'
        },
        {
            name: 'artikelgroepen',
            icon: 'list_alt'
        },
        {
            name: 'serienummers',
            icon: 'list_alt'
        },
        {
            name: 'artikelen per leverancier',
            icon: 'list_alt'
        },
        {
            name: 'artikelen per debiteur',
            icon: 'list_alt'
        },
        {
            name: 'materialsoorten',
            category: 'algemeen',
            icon: 'settings'
        },
        {
            name: 'merken',
            category: 'algemeen',
            icon: 'settings'
        },
        {
            name: 'statistiekcodes',
            category: 'algemeen',
            icon: 'settings'
        },
        {
            name: 'verkoopprijssjablonen',
            category: 'algemeen',
            icon: 'settings'
        },
        {
            name: 'inkoopprijssjablonen',
            category: 'algemeen',
            icon: 'settings'
        },
        {
            name: 'prijsnamen',
            category: 'algemeen',
            icon: 'settings'
        },
        {
            name: 'staffels',
            category: 'algemeen',
            icon: 'settings'
        },
        {
            name: 'artikelprijsonderhoud',
            category: 'prijsonderhoud',
            icon: 'build'
        },
        {
            name: 'artikelinkoopprijs',
            category: 'prijsonderhoud',
            icon: 'build'
        },
        {
            name: 'artikelverkoopprijs',
            category: 'prijsonderhoud',
            icon: 'build'
        },
        {
            name: 'artikeleenheden',
            category: 'algemeen',
            icon: 'build'
        }
    ];

    constructor(private _dareTranslationLoaderService: DareTranslationLoaderService) {
        this._dareTranslationLoaderService.loadTranslations(english, turkish);
    }

}
