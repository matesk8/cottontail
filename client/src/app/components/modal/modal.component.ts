import {
    Component,
    ApplicationRef,
    Injectable,
    ComponentResolver,
    ViewContainerRef,
    ComponentFactory } from '@angular/core';
import {
    NgStyle,
    FORM_DIRECTIVES } from '@angular/common';
import { PromiseWrapper } from '@angular/common/src/facade/async';
import {
    ModalBuilder,
    ModalFunctionsInterface } from './builders/modal.builder.ts';
import { InjectableModalInterface } from './interfaces/injectable-modal.interface.ts'
require('./modal.component.scss');


@Injectable()
@Component({
    providers: [ModalBuilder]
})
export class ModalComponent {
    confirm: Function;
    cancel: Function;
    modalComponent:any;

    data: any;
    width:number = 250;
    height:number = 150;

    constructor(private app:ApplicationRef,
                private resolver: ComponentResolver,
                private modalBuilder: ModalBuilder) { }

    toComponent() : Function {
        let confirm = this.confirm;
        let cancel = this.cancel;

        let modalComponent:any = this.modalComponent;

        let width:string = this.width + 'px';
        let height:string = this.height + 'px';

        let data:any = this.data;

        let template:string = `
        <div class="modal-background" (click)="cancel()">
        <div id="modalDiv" class="modal" (click)="$event.stopPropagation()" [ngStyle]="{'width':'` + width + `', 'height':'` + height + `'}">
     
                <div class="modal-dialog" role="document">
                <div class="modal-content">
                      
                        <div class="modal-body">
                            <template #dynamicContentPlaceHolder></template>
                        </div>
                
                </div>
                </div>
        
        </div>
        </div>
        `;

        let injectableModal:InjectableModalInterface = {
            selector: 'modal',
            containerTemplate: template,
            viewContainerRefName: 'dynamicContentPlaceHolder',
            modalComponent: modalComponent,
            data: data
        };

        let modalFunctions:ModalFunctionsInterface = {
            cancel: cancel,
            confirm: confirm
        };

        return this.modalBuilder.CreateComponent(injectableModal, modalFunctions, [FORM_DIRECTIVES, NgStyle]);
    }

    show() : Promise<any> {
        // Top level hack
        let viewContainerRef:ViewContainerRef = this.app['_rootComponents'][0]['_hostElement'].vcRef;

        // Set up the promise to return.
        let promiseWrapper:any = PromiseWrapper.completer();

        this.resolver
            .resolveComponent(this.toComponent())
            .then((factory: ComponentFactory<any>) => {
                let dynamicComponent = viewContainerRef.createComponent(factory, 0);
                let component = dynamicComponent.instance;

                // Assign the cref to the newly created modal so it can self-destruct correctly.
                component.cref = dynamicComponent;

                // Assign the promise to resolve.
                component.result = promiseWrapper;
            });

        return promiseWrapper.promise;
    }
}
