import {Component, ViewChild, HostListener, Output, EventEmitter, Input, OnInit, OnDestroy} from '@angular/core'
import {FileObject, FileLikeObject} from "./file";
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";
import {Observer} from "rxjs/Observer";
import {Subscription} from "rxjs/Subscription";
import {ControlValueAccessor} from "@angular/forms";
import {UploadService} from "./upload.service";
import * as mime from 'mime';
import "rxjs/add/observable/from";
import "rxjs/add/operator/mergeMap";
import "rxjs/add/operator/switchMap";

export interface FilesControlOptions {
    types?: string[],
    single?: boolean,
    limit?: number,
    maxSize?: number,
    url?: string,
    fieldName?: string,
    isFileValid?: (file: File)=>boolean;
}

@Component({
    selector: 'fg-files-control',
    styles: [`[hidden]{display:none !important}`],
    template: `<input type="file" [accept]="inputAccepts" [multiple]="multiple" (change)="onInputChange" hidden/><ng-content></ng-content>`,
    exportAs: 'fgFileControl'
})

export class FilesControl implements OnInit, OnDestroy, ControlValueAccessor {
    public files: FileObject[] = [];
    @Input('options') public options: FilesControlOptions = {};
    @Output('dragging') public OnDragging: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output('drop') public OnDrop: EventEmitter<FileObject[]> = new EventEmitter<FileObject[]>();
    @Output('fileAdded') public OnFileAdded: EventEmitter<FileObject> = new EventEmitter<FileObject>();
    @Output('filesChanged') public OnFilesChanged: EventEmitter<FileObject[]> = new EventEmitter<FileObject[]>();
    public dragging: boolean = false;

    private filesSubject: Subject<FileObject[]> = new Subject<FileObject[]>();
    private onTouched: Function;
    @ViewChild('input[type="file"]')
    private fileInput: HTMLInputElement;
    private touchTriggered = false;
    private changeSubscription: Subscription;

    constructor(private uploadService: UploadService) {

    }

    ngOnInit() {
        this.filesSubject.next(this.files);
    }

    ngOnDestroy(): void {
        this.filesSubject.complete();
        if (this.changeSubscription) {
            this.changeSubscription.unsubscribe();
        }
    }

    addFiles() {
        this.fileInput.click();
    }

    remove(file: FileObject) {
        let index = this.files.indexOf(file);

        if (index !== -1) {
            this.files.splice(index, 1);
            this.pushChanges();
            this.OnFilesChanged.emit(this.files);
        }
    }

    addFile(file: FileObject, triggerChanged = true) {
        this.triggerTouched();
        this.OnFileAdded.emit(file);
        this.files.push(file);
        this.pushChanges();
        if (triggerChanged) {
            this.OnFilesChanged.emit(this.files);
        }

    }

    upload(file: FileObject) {
        return file.upload();
    }

    uploadAll() {
        return Observable.from(this.files)
            .mergeMap((file: FileObject) => file.upload());
    }

    get filesObservable(): Observable<FileObject[]> {
        return Observable.create((observer: Observer<FileObject[]>) => {
            observer.next(this.files);
        }).concat(this.filesSubject.asObservable());
    }

    get empty(): boolean {
        return this.files.length != 0;
    }

    get inputAccepts() {
        if (this.options.types) {
            return this.options.types.join(',');
        } else {
            return '';
        }
    }

    get multiple() {
        return !this.options.single && (!this.options.limit || this.options.limit <= 1)
    }

    get fieldName() {
        return this.options.fieldName || 'file';
    }

    writeValue(files: FileLikeObject[]): void {
        this.files = files.map((file: FileLikeObject) => new FileObject(file, this.uploadService, this));
    }

    registerOnChange(fn: any): void {
        this.changeSubscription = this.uploadResults.subscribe(fn);
    }

    get uploadResults() {
        return this.filesObservable.switchMap(()=> this.uploadAll());
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    isFileValid(file: File) {
        if (this.options.maxSize && file.size > this.options.maxSize) {
            return false;
        }

        if (this.options.limit && this.files.length > this.options.limit) {
            return false;
        }

        if (this.options.single && this.files.length > 1) {
            return false;
        }

        if (this.options.isFileValid && !this.options.isFileValid(file)) {
            return false;
        }

        if (this.options.types && !this.options.types.every((type: string) => this.match(file, type))) {
            return false;
        }

        return true;
    }

    createNewFile(file: File) {
        return new FileObject(file, this.uploadService, this);
    }

    private match(file: File, type: string) {
        if (type[0] === '.') {
            return file.name.endsWith(type);
        }

        let mimeType = mime.lookup(file.name);
        let wildcardMatches = /([\w-]+)\/\*/i.exec(type);

        if (wildcardMatches && wildcardMatches[1]) {
            return mimeType.startsWith(wildcardMatches[1] + '/');
        }

        return mimeType === type;
    }

    @HostListener('drop', ['$event'])
    private onDrop(e: DragEvent) {
        this.dragging = false;
        this.OnDragging.emit(this.dragging);

        let newFiles = Array.from(e.dataTransfer.files).filter(this.isFileValid).map(this.createNewFile);
        this.OnDrop.emit(newFiles);
        newFiles.forEach((file: FileObject) => this.addFile(file, false));
        this.OnFilesChanged.emit(this.files);
    }

    @HostListener('dragenter', ['$event'])
    private onDragEnter(e: DragEvent) {
        this.dragging = true;
        this.OnDragging.emit(this.dragging);
    }

    @HostListener('dragleave', ['$event'])
    private onDragLeave(e: DragEvent) {
        this.dragging = false;
        this.OnDragging.emit(this.dragging);
    }

    private onInputChange(e: Event) {
        Array.from(this.fileInput.files).filter(this.isFileValid).map(this.createNewFile).forEach((file: FileObject) => this.addFile(file, false));
        this.OnFilesChanged.emit(this.files);
        this.pushChanges();
        this.fileInput.value = '';
    }

    private pushChanges() {
        this.filesSubject.next(this.files);
    }

    private triggerTouched() {
        if (!this.touchTriggered) {
            this.onTouched();
            this.touchTriggered = true;
        }
    }
}