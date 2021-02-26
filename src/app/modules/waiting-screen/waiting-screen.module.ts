import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WaitingScreenComponent } from './waiting-screen.component';



@NgModule({
    declarations: [WaitingScreenComponent],
    exports: [
        WaitingScreenComponent
    ],
    imports: [
        CommonModule
    ]
})
export class WaitingScreenModule { }
