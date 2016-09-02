import { Http } from "@angular/http";
import { FileObject } from "./file";
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/throw";
import "rxjs/add/operator/map";
import { FilesControl } from "./files-control.component";
export declare class UploadService {
    private http;
    constructor(http: Http);
    upload(file: FileObject, filesControl: FilesControl): Observable<FileObject>;
}
