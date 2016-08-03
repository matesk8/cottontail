import {
    Component,
    OnInit,
    style,
    animate,
    state,
    transition,
    trigger,
    Input
} from "@angular/core";
import {GuiEditorService} from "../gui-editor.service";
import {VisibilityState} from "../animation.states";
import {ShowSidebarEvent} from "../gui-editor.events";
import {BehaviorSubject} from "rxjs/Rx";

require ("./editor-sidebar.component.scss");

export enum SidebarType {
    expression,
    editor
}

/** TODO: make this switch between an expression editor and an object inspector*/
@Component({
    selector: "editor-sidebar",
    animations: [
        trigger("sidebarState", [
            state("visible", style({
                width: '40%',
                display: 'block',
                overflowY: "auto"
            })),
            state("hidden", style({
                width: '10%',
                display: 'none',
                overflowY: "hidden"
            })),
            transition("hidden => visible", animate("100ms ease-in")),
            transition("visible => hidden", animate("100ms ease-out"))
        ])
    ],
    template: `
                    <div class="editor-sidebar-component" @sidebarState="sidebarState">
                        <div class="collapse-icon">
                            <i class="fa fa-lg fa-caret-left" (click)="collapseSidebar()"></i>
                        </div>
                        <div class="sidebar-content">
                            <!-- TODO: add expression and objects editor -->
                            This is the right sidebar content
                        </div>
                    </div>
    `
})
export class EditorSidebarComponent implements OnInit {
    /** Emit changes of the sidebar animation to the parent component */
    @Input()
    private sidebarVisibility: BehaviorSubject<VisibilityState>;

    /** State of the sidebar animation */
    private sidebarState: VisibilityState;

    constructor(private guiEditorService: GuiEditorService) {
        this.guiEditorService.publishedSidebarEvents.subscribe((event: ShowSidebarEvent) => {
            this.showSideBar(event.data.sidebarType);
        });
    }

    ngOnInit(): void {
        this.sidebarVisibility.subscribe((state: VisibilityState) => {
            this.sidebarState = state;
        });
    }

    showSideBar(sidebarType: SidebarType): void {
        this.sidebarVisibility.next("visible");
    }

    collapseSidebar(): void {
        this.sidebarVisibility.next("hidden");
    }
}
