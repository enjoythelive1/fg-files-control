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
var files_control_component_1 = require("./files-control.component");
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var upload_service_1 = require("./upload.service");
var FilesControlModule = (function () {
    function FilesControlModule() {
    }
    FilesControlModule = __decorate([
        core_1.NgModule({
            imports: [forms_1.FormsModule],
            declarations: [files_control_component_1.FilesControl],
            providers: [upload_service_1.UploadService],
            exports: [files_control_component_1.FilesControl]
        }), 
        __metadata('design:paramtypes', [])
    ], FilesControlModule);
    return FilesControlModule;
}());
exports.FilesControlModule = FilesControlModule;
