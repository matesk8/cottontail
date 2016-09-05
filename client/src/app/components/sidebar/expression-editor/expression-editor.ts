import {Observable} from "rxjs/Observable";
import Editor = AceAjax.Editor;
import Document = AceAjax.Document;
import IEditSession = AceAjax.IEditSession;
import TextMode = AceAjax.TextMode;
import {AbstractCodeEditorService} from "../../../services/abstract-code-editor/abstract-code-editor.service";

require ("./expression-editor.component.scss");

export class ExpressionEditor extends AbstractCodeEditorService {

    constructor(editor: Editor) {

        super();

        this.editor = editor;

        // to disable a warning message from ACE about a deprecated method
        this.editor.$blockScrolling = Infinity;

        this.session = editor.getSession();
        this.document = this.session.getDocument();

        this.setTheme('twilight');
        this.setMode("javascript");
        //this.setText(this.content);

        /*this.contentChanges = Observable.fromEvent(this.editor as any, "change")
         .debounceTime(300)
         .map(_ => this.document.getValue())
         .distinctUntilChanged()
         .withLatestFrom(this.fileStream, (content, file) => {
         return Object.assign(file, {content});
         }).share();*/
    }
}
