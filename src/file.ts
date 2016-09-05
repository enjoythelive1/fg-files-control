import {UploadService} from "./upload.service";
import {FilesControl} from "./files-control.component";
import {Observable} from "rxjs/Observable";
import {Observer} from "rxjs/Observer";
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
export type FileLikeObject=string|File|Blob|UrlContainer|PathContainer;

export class FileObject {
    protected upload$: Observable<any>;
    private previewUrl:Observable<string>;

    constructor(public file: FileLikeObject, private uploadService: UploadService, private filesControl: FilesControl) {
        this.previewUrl = this.getPreviewUrl().share();
    }

    upload() {
        if (this.file instanceof Blob) {
            if (!this.upload$) {
                this.upload$ = this.uploadService.upload(this, this.filesControl).publish();
            }
            return this.upload$;
        } else {
            return Observable.empty();
        }
    }

    remove() {
        this.filesControl.remove(this);
    }

    getPreviewUrl() {
        if (this.file instanceof Blob) {
            return Observable.create((observer: Observer<string>) => {
                let fileReader = new FileReader();

                fileReader.onloadend = (ev: ProgressEvent)=> observer.next(fileReader.result);
                fileReader.readAsDataURL(<File>this.file);

                return ()=> {
                    fileReader.abort();
                }
            });
        } else if ((<UrlContainer>this.file).url) {
            return Observable.of((<UrlContainer>this.file).preview || (<UrlContainer>this.file).url);
        } else if ((<PathContainer>this.file).path) {
            return Observable.of((<PathContainer>this.file).preview || (<PathContainer>this.file).path);
        } else if (typeof this.file === "string") {
            return Observable.of(this.file);
        } else {
            return Observable.throw(new Error("File object not valid"))
        }
    }
}