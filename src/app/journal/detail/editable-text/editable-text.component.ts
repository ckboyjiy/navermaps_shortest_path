import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input, OnInit,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {b} from '@angular/core/src/render3';

@Component({
  selector: 'app-editable-content',
  templateUrl: './editable-text.component.html',
  styleUrls: ['./editable-text.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EditableTextComponent implements OnInit, AfterViewInit {

  @Input() text: string;
  @Input() multi: boolean;
  @Input() align: string;
  @Input() beginEdit: boolean;
  @Input() placeholder: string;
  @Output() changes = new EventEmitter();
  @ViewChild('label') label: ElementRef;
  @ViewChild('inputText') inputText: ElementRef;
  @ViewChild('textarea') textarea: ElementRef;
  isEdit = false;
  styles = {};
  constructor() {}
  ngOnInit() {
    this.multi = !this.multi ? false : true;
    this.beginEdit = !this.beginEdit ? false : true;
    this.placeholder = !this.placeholder ? '클릭하여 입력하기' : this.placeholder;
  }
  ngAfterViewInit() {
    if (!this.align) { this.align = 'left'; }
    this.styles = {
      width: 'calc(100% - 6px)',
      color: window.getComputedStyle(this.label.nativeElement).getPropertyValue('color'),
      'font-size': window.getComputedStyle(this.label.nativeElement).getPropertyValue('font-size'),
      'font-weight': window.getComputedStyle(this.label.nativeElement).getPropertyValue('font-weight'),
      'text-align': this.align
    };
  }
  clickLabel() {
    this.isEdit = true;
    window.requestAnimationFrame(() => {
      if (!this.multi) { this.inputText.nativeElement.focus(); }
      if (this.multi) {
        if (this.text) { this.resizeTextArea(this.text.split('<br>').length); }
        this.textarea.nativeElement.focus();
      }
    });
  }
  blurText(value) {
    if (this.multi) {
      value = value.replace(/\n/gi, '<br>');
    }
    if (this.text !== value) {
      this.text = value;
      this.changes.emit(this.text);
    }
    this.isEdit = false;
  }
  getTextarea() {
    return this.text ? this.text.replace(/<br>/gi, '\n') : '';
  }
  resizeTextArea(rows: number) {
    this.textarea.nativeElement.rows = rows + 1;
  }
  keyup(event) {
    if (event.keyCode === 13) {
      this.resizeTextArea(event.target.rows);
    }
  }
}
