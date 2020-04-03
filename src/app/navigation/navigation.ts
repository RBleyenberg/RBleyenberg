import { DareNavigation } from '@dare/types';

export const navigation: DareNavigation[] = [
    {
        id: 'crm',
        title: 'CRM',
        translate: 'NAV.CRM',
        type: 'collapsable',
        icon: 'account_box',
        children: [
            {
                id: 'customers',
                title: 'customers',
                type: 'item',
                url: '/sample'
            },
            {
                id: 'list',
                title: 'Lists',
                type: 'collapsable',
                children: [
                    {
                        id: 'adressen',
                        title: 'adressen',
                        type: 'item',
                        url: '/adressen'
                    },
                    {
                        id: 'landen',
                        title: 'landen',
                        type: 'item',
                        url: '/landen'
                    },
                    {
                        id: 'talen',
                        title: 'talen',
                        type: 'item',
                        url: '/talen'
                    },
                    {
                        id: 'rechtsvormen',
                        title: 'rechtsvormen',
                        type: 'item',
                        url: '/rechtsvormen'
                    }
                ]
            },
            {
                id: 'settings',
                title: 'settings',
                type: 'collapsable',
                children: [
                    {
                        id: 'settings',
                        title: 'settings',
                        type: 'item',
                        url: '/settings'
                    }
                ]
            }
        ]

    },
    {
        id: 'items',
        title: 'ITEMS',
        translate: 'NAV.ITEMS',
        type: 'item',
        icon: 'format_list_bulleted',
        url: '/item'
    }
];
