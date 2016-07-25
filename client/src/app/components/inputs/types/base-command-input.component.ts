import {Component, OnInit} from "@angular/core";
import {NgClass} from "@angular/common";

require ("./base-command-input.component.scss");

@Component({
    selector: 'docker-input',
    template: `
                <form id="baseCommandForm">
                    <fieldset class="form-group">
                            <a href="#" class="floatRight">Hide</a>
                   
                            <label for="baseCommand">Base Command</label>
                            <label for="baseCommand" class="secondaryLabel">What command do you want to call from the image</label>
                            
                            <div class="input-group">
                                
                                <input type="text" 
                                class="form-control"
                                [(ngModel)]="baseCommand">
                                
                                <span class="input-group-addon addExpression">
                                   <a href="#">Add expression</a>
                               </span>
                            </div>
                            
                            <a href="#">Add base command</a>
                    </fieldset>
                </form>`,
})
export class BaseCommandInput implements OnInit {
    baseCommand: string;

    constructor() {}

    ngOnInit(): any {

    }

    /*TODO: use actual model type here*/
    public setState(data: any) {
        this.baseCommand = data ? data : null;
    }

}
