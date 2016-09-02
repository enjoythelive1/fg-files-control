import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import {FileObject} from "./file";
import {Observable} from "rxjs/Observable";
import "rxjs/add/observable/throw";
import "rxjs/add/operator/map";
import {FilesControl} from "./files-control.component";
@Injectable()
export class UploadService {
    constructor(private http: Http) {

    }

    upload(file: FileObject, filesControl: FilesControl): Observable<FileObject> {
        if (!filesControl.options.url) {
            return Observable.throw(new Error("The fg-files-control requires the url to upload the file"));
        }

        let formData = new FormData();
        formData.append(filesControl.fieldName, file.file);

        return this.http.post(filesControl.options.url, formData)
            .map((response: Response) => response.json());
    }
}