import { UploadService } from "./upload.service";
import { FilesControl } from "./files-control.component";
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/of";
import "rxjs/add/observable/throw";
import "rxjs/add/observable/empty";
import "rxjs/add/operator/share";
export interface UrlContainer {
    url?: string;
    preview?: string;
}
export interface PathContainer {
    path?: string;
    preview?: string;
}
export declare type FileLikeObject = string | File | Blob | UrlContainer | PathContainer;
export declare class FileObject {
    file: FileLikeObject;
    private uploadService;
    private filesControl;
    protected upload$: Observable<any>;
    private previewUrl$;
    constructor(file: FileLikeObject, uploadService: UploadService, filesControl: FilesControl);
    upload(): Observable<any>;
    remove(): void;
    previewUrl: Observable<string>;
    private getPreviewUrl();
}
