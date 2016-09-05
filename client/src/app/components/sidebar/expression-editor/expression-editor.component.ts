import {Component, ElementRef, ViewChild} from "@angular/core";
import {ExpressionEditor} from "./expression-editor";
import Document = AceAjax.Document;
import IEditSession = AceAjax.IEditSession;
import TextMode = AceAjax.TextMode;

require ("./expression-editor.component.scss");

@Component({
    selector: "expression-editor",
    template: `
         <div class="expression-editor-component">
                <div #ace class="ace-editor"></div>
         </div>
 `
})
export class ExpressionEditorComponent {
    
    /** Reference to the element in which we want to instantiate the Ace editor */
    @ViewChild("ace")
    private aceContainer: ElementRef;

    private editor: ExpressionEditor;

    constructor() { }

    ngOnInit(): any {
        this.editor = new ExpressionEditor(ace.edit(this.aceContainer.nativeElement));
    }
}
