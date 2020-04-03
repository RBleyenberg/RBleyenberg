import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { dareAnimations } from '@dare/animations';
import { DareConfigService } from '@dare/services/config.service';


@Component({
    selector     : 'app-login',
    templateUrl  : './login.component.html',
    styleUrls    : ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : dareAnimations
})
export class LoginComponent implements OnInit
{
    loginForm: FormGroup;

    constructor(
        private _dareConfigService: DareConfigService,
        private _formBuilder: FormBuilder
    )
    {
        this._dareConfigService.config = {
            layout: {
                navbar   : {
                    hidden: true
                },
                toolbar  : {
                    hidden: true
                },
                footer   : {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };
    }

    ngOnInit(): void
    {
        this.loginForm = this._formBuilder.group({
            email   : ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
    }
}
