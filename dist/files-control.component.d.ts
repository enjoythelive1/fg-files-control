import { EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FileObject, FileLikeObject } from "./file";
import { Observable } from "rxjs/Observable";
import { ControlValueAccessor } from "@angular/forms";
import { UploadService } from "./upload.service";
import "rxjs/add/observable/from";
import "rxjs/add/operator/mergeMap";
import "rxjs/add/operator/switchMap";
export interface FilesControlOptions {
    types?: string[];
    single?: boolean;
    limit?: number;
    maxSize?: number;
    url?: string;
    fieldName?: string;
    isFileValid?: (file: File) => boolean;
}
export declare class FilesControl implements OnInit, OnDestroy, ControlValueAccessor {
    private uploadService;
    files: FileObject[];
    options: FilesControlOptions;
    OnDragging: EventEmitter<boolean>;
    OnDrop: EventEmitter<FileObject[]>;
    OnFileAdded: EventEmitter<FileObject>;
    OnFilesChanged: EventEmitter<FileObject[]>;
    dragging: boolean;
    private filesSubject;
    private onTouched;
    private fileInput;
    private touchTriggered;
    private changeSubscription;
    constructor(uploadService: UploadService);
    ngOnInit(): void;
    ngOnDestroy(): void;
    addFiles(): void;
    remove(file: FileObject): void;
    addFile(file: FileObject, triggerChanged?: boolean): void;
    upload(file: FileObject): Observable<any>;
    uploadAll(): Observable<any>;
    filesObservable: Observable<FileObject[]>;
    empty: boolean;
    inputAccepts: string;
    multiple: boolean;
    fieldName: string;
    writeValue(files: FileLikeObject[]): void;
    registerOnChange(fn: any): void;
    uploadResults: Observable<any>;
    registerOnTouched(fn: any): void;
    isFileValid(file: File): boolean;
    createNewFile(file: File): FileObject;
    private match(file, type);
    private onDrop(e);
    private onDragEnter(e);
    private onDragLeave(e);
    private onInputChange(e);
    private pushChanges();
    private triggerTouched();
}
