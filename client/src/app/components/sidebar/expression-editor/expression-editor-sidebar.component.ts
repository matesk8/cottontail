import {Component, style, animate, state, transition, trigger} from "@angular/core";
import {Observable} from "rxjs/Rx";
import {VisibilityState} from "../../clt-editor/animation.states";
import {ExpressionEditorComponent} from "../expression-editor/expression-editor.component";
import {InputProperty} from "../../../models/input-property.model";
import {
    OpenExpressionEditor, CloseExpressionEditor, OpenInputInspector,
    CloseInputInspector
} from "../../../action-events/index";
import {EventHubService} from "../../../services/event-hub/event-hub.service";

require ("../shared/editor-sidebar.component.scss");

@Component({
    selector: "expression-editor-sidebar-component",
    animations: [
        trigger("sidebarState", [
            state("visible", style({
                display: "block",
                overflowY: "auto",
            })),
            state("hidden", style({
                display: "none",
                overflowY: "hidden"
            })),
            transition("hidden => visible", animate("100ms ease-in")),
            transition("visible => hidden", animate("100ms ease-out"))
        ])
    ],
    directives: [
        ExpressionEditorComponent
    ],
    template: `
            <div class="sidebar-component" @sidebarState="sidebarState" [ngClass]="{isTopOfStack: isShown}">
                <div class="sidebar-content">
                    
                    <div class="collapse-icon" (click)="collapseSidebar()">
                        <i class="fa fa-lg fa-caret-left"></i>
                    </div>
                    
                    <!--TODO: pass in data-->
                    <expression-editor *ngIf="sidebarData"></expression-editor>
                </div>
            </div>
    `
})
export class ExpressionEditorSidebarComponent {
    /** State of the sidebar animation */
    private sidebarState: VisibilityState = "hidden";

    /** Data that we are passing to the sidebar */
    private sidebarData: Observable<InputProperty>;

    private isShown: boolean;

    constructor(private eventHubService: EventHubService) {

        this.eventHubService.on(OpenExpressionEditor).subscribe((action) => {
            this.sidebarData = action.payload;
            this.sidebarState = "visible";
            this.isShown = true;
        });

        this.eventHubService.on(CloseExpressionEditor).subscribe(() => {
            this.sidebarState = "hidden";
        });

        this.eventHubService.on(OpenInputInspector).subscribe((action) => {
            this.isShown = false;
        });

        this.eventHubService.on(CloseInputInspector).subscribe(() => {
            this.isShown = true;
        });
    }

    private collapseSidebar(): void {
        this.eventHubService.publish(new CloseExpressionEditor());
    }
}
