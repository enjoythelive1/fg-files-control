"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var file_1 = require("./file");
var Observable_1 = require("rxjs/Observable");
var Subject_1 = require("rxjs/Subject");
var forms_1 = require("@angular/forms");
var upload_service_1 = require("./upload.service");
require("rxjs/add/observable/from");
require("rxjs/add/operator/mergeMap");
require("rxjs/add/operator/switchMap");
require("rxjs/add/operator/merge");
var FilesControl = (function () {
    function FilesControl(uploadService) {
        this.uploadService = uploadService;
        this.files = [];
        this.options = {};
        this.OnDragging = new core_1.EventEmitter();
        this.OnDrop = new core_1.EventEmitter();
        this.OnFileAdded = new core_1.EventEmitter();
        this.OnFilesChanged = new core_1.EventEmitter();
        this.dragging = false;
        this.filesSubject = new Subject_1.Subject();
        this.touchTriggered = false;
    }
    FilesControl.prototype.ngOnInit = function () {
        this.filesSubject.next(this.files);
    };
    FilesControl.prototype.ngOnDestroy = function () {
        this.filesSubject.complete();
        if (this.changeSubscription) {
            this.changeSubscription.unsubscribe();
        }
    };
    FilesControl.prototype.addFiles = function () {
        this.fileInput.click();
    };
    FilesControl.prototype.remove = function (file) {
        var index = this.files.indexOf(file);
        if (index !== -1) {
            this.files.splice(index, 1);
            this.pushChanges();
            this.OnFilesChanged.emit(this.files);
        }
    };
    FilesControl.prototype.addFile = function (file, triggerChanged) {
        if (triggerChanged === void 0) { triggerChanged = true; }
        this.triggerTouched();
        this.OnFileAdded.emit(file);
        this.files.push(file);
        this.pushChanges();
        if (triggerChanged) {
            this.OnFilesChanged.emit(this.files);
        }
    };
    FilesControl.prototype.upload = function (file) {
        return file.upload();
    };
    FilesControl.prototype.uploadAll = function () {
        return Observable_1.Observable.from(this.files)
            .mergeMap(function (file) { return file.upload(); });
    };
    Object.defineProperty(FilesControl.prototype, "filesObservable", {
        get: function () {
            var _this = this;
            return Observable_1.Observable.create(function (observer) {
                observer.next(_this.files);
            }).merge(this.filesSubject.asObservable());
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FilesControl.prototype, "empty", {
        get: function () {
            return this.files.length === 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FilesControl.prototype, "inputAccepts", {
        get: function () {
            if (this.options.types) {
                return this.options.types.join(',');
            }
            else {
                return '';
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FilesControl.prototype, "multiple", {
        get: function () {
            return !this.options.single && (!this.options.limit || this.options.limit <= 1);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FilesControl.prototype, "fieldName", {
        get: function () {
            return this.options.fieldName || 'file';
        },
        enumerable: true,
        configurable: true
    });
    FilesControl.prototype.writeValue = function (files) {
        var _this = this;
        this.files = files.map(function (file) { return new file_1.FileObject(file, _this.uploadService, _this); });
    };
    FilesControl.prototype.registerOnChange = function (fn) {
        this.changeSubscription = this.uploadResults.subscribe(fn);
    };
    Object.defineProperty(FilesControl.prototype, "uploadResults", {
        get: function () {
            var _this = this;
            return this.filesObservable.switchMap(function () { return _this.uploadAll(); });
        },
        enumerable: true,
        configurable: true
    });
    FilesControl.prototype.registerOnTouched = function (fn) {
        this.onTouched = fn;
    };
    FilesControl.prototype.isFileValid = function (file) {
        var _this = this;
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
        if (this.options.types && !this.options.types.every(function (type) { return _this.match(file, type); })) {
            return false;
        }
        return true;
    };
    FilesControl.prototype.createNewFile = function (file) {
        return new file_1.FileObject(file, this.uploadService, this);
    };
    FilesControl.prototype.match = function (file, type) {
        if (type[0] === '.') {
            return file.name.endsWith(type);
        }
        var mimeType = file.type;
        var wildcardMatches = /([\w-]+)\/\*/i.exec(type);
        if (wildcardMatches && wildcardMatches[1]) {
            return mimeType.startsWith(wildcardMatches[1] + '/');
        }
        return mimeType === type;
    };
    FilesControl.prototype.onDrop = function (e) {
        var _this = this;
        this.dragging = false;
        this.OnDragging.emit(this.dragging);
        var newFiles = Array.from(e.dataTransfer.files).filter(this.isFileValid).map(this.createNewFile);
        this.OnDrop.emit(newFiles);
        newFiles.forEach(function (file) { return _this.addFile(file, false); });
        this.OnFilesChanged.emit(this.files);
    };
    FilesControl.prototype.onDragEnter = function (e) {
        this.dragging = true;
        this.OnDragging.emit(this.dragging);
    };
    FilesControl.prototype.onDragLeave = function (e) {
        this.dragging = false;
        this.OnDragging.emit(this.dragging);
    };
    FilesControl.prototype.onInputChange = function (e) {
        var _this = this;
        Array.from(this.fileInput.files).filter(this.isFileValid).map(this.createNewFile).forEach(function (file) { return _this.addFile(file, false); });
        this.OnFilesChanged.emit(this.files);
        this.pushChanges();
        this.fileInput.value = '';
    };
    FilesControl.prototype.pushChanges = function () {
        this.filesSubject.next(this.files);
    };
    FilesControl.prototype.triggerTouched = function () {
        if (!this.touchTriggered) {
            this.onTouched();
            this.touchTriggered = true;
        }
    };
    __decorate([
        core_1.Input('options'), 
        __metadata('design:type', Object)
    ], FilesControl.prototype, "options", void 0);
    __decorate([
        core_1.Output('dragging'), 
        __metadata('design:type', core_1.EventEmitter)
    ], FilesControl.prototype, "OnDragging", void 0);
    __decorate([
        core_1.Output('drop'), 
        __metadata('design:type', core_1.EventEmitter)
    ], FilesControl.prototype, "OnDrop", void 0);
    __decorate([
        core_1.Output('fileAdded'), 
        __metadata('design:type', core_1.EventEmitter)
    ], FilesControl.prototype, "OnFileAdded", void 0);
    __decorate([
        core_1.Output('filesChanged'), 
        __metadata('design:type', core_1.EventEmitter)
    ], FilesControl.prototype, "OnFilesChanged", void 0);
    __decorate([
        core_1.ViewChild('input'), 
        __metadata('design:type', HTMLInputElement)
    ], FilesControl.prototype, "fileInput", void 0);
    __decorate([
        core_1.HostListener('drop', ['$event']), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [DragEvent]), 
        __metadata('design:returntype', void 0)
    ], FilesControl.prototype, "onDrop", null);
    __decorate([
        core_1.HostListener('dragenter', ['$event']), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [DragEvent]), 
        __metadata('design:returntype', void 0)
    ], FilesControl.prototype, "onDragEnter", null);
    __decorate([
        core_1.HostListener('dragleave', ['$event']), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [DragEvent]), 
        __metadata('design:returntype', void 0)
    ], FilesControl.prototype, "onDragLeave", null);
    FilesControl = __decorate([
        core_1.Component({
            selector: 'fg-files-control',
            styles: ["[hidden]{display:none !important}"],
            template: "<input #input type=\"file\" [accept]=\"inputAccepts\" [multiple]=\"multiple\" (change)=\"onInputChange\" hidden/><ng-content></ng-content>",
            providers: [
                {
                    provide: forms_1.NG_VALUE_ACCESSOR,
                    useExisting: core_1.forwardRef(function () { return FilesControl; }),
                    multi: true
                }
            ],
            exportAs: 'fgFileControl'
        }), 
        __metadata('design:paramtypes', [upload_service_1.UploadService])
    ], FilesControl);
    return FilesControl;
}());
exports.FilesControl = FilesControl;
