"use strict";
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/observable/of");
require("rxjs/add/observable/throw");
require("rxjs/add/observable/empty");
require("rxjs/add/operator/share");
var FileObject = (function () {
    function FileObject(file, uploadService, filesControl) {
        this.file = file;
        this.uploadService = uploadService;
        this.filesControl = filesControl;
        this.previewUrl = this.getPreviewUrl().share();
    }
    FileObject.prototype.upload = function () {
        if (this.file instanceof Blob) {
            if (!this.upload$) {
                this.upload$ = this.uploadService.upload(this, this.filesControl).publish();
            }
            return this.upload$;
        }
        else {
            return Observable_1.Observable.empty();
        }
    };
    FileObject.prototype.remove = function () {
        this.filesControl.remove(this);
    };
    FileObject.prototype.getPreviewUrl = function () {
        var _this = this;
        if (this.file instanceof Blob) {
            return Observable_1.Observable.create(function (observer) {
                var fileReader = new FileReader();
                fileReader.onloadend = function (ev) { return observer.next(fileReader.result); };
                fileReader.readAsDataURL(_this.file);
                return function () {
                    fileReader.abort();
                };
            });
        }
        else if (this.file.url) {
            return Observable_1.Observable.of(this.file.preview || this.file.url);
        }
        else if (this.file.path) {
            return Observable_1.Observable.of(this.file.preview || this.file.path);
        }
        else if (typeof this.file === "string") {
            return Observable_1.Observable.of(this.file);
        }
        else {
            return Observable_1.Observable.throw(new Error("File object not valid"));
        }
    };
    return FileObject;
}());
exports.FileObject = FileObject;
