import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {RetroCardItem} from "../model";

@Component({
    selector: 'app-retro-card',
    templateUrl: './retro-card.component.html',
    styleUrls: ['./retro-card.component.scss'],
})
export class RetroCardComponent {

    @Input()
    title: string;

    @Input()
    items: RetroCardItem[];

    @Output()
    itemAdded = new EventEmitter<RetroCardItem>();

    @Output()
    itemLiked= new EventEmitter<number>();

    itemText: string;

    like(index: number) {
        this.itemLiked.emit(index);
    }

    private addItem(item: RetroCardItem) {
        this.itemAdded.emit(item);
    }

    submit() {
        if (this.itemText) {
            this.addItem({text: this.itemText});
            this.itemText = '';
        }
    }

}
