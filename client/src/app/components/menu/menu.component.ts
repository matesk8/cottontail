import {Component, Input} from "@angular/core";
import {MenuItemComponent} from "./menu-item.component";
import {MenuItem} from "./menu-item";

require("./menu.component.scss");

@Component({
    selector: "ct-menu",
    directives: [MenuItemComponent],
    template: `
        <ct-menu-item *ngFor="let item of items" [item]="item"></ct-menu-item>
    `
})
export class MenuComponent {
    @Input()
    private items;

    public setItems(items: MenuItem[]) {
        this.items = items;
    }
}
