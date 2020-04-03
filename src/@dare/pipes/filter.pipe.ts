import { Pipe, PipeTransform } from '@angular/core';
import { DareUtils } from '@dare/utils';

@Pipe({ name: 'filter' })
export class FilterPipe implements PipeTransform {
    transform(mainArr: any[], searchText: string, property: string): any {
        return DareUtils.filterArrayByString(mainArr, searchText);
    }
}
