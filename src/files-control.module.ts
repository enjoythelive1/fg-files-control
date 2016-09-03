import {FilesControl} from "./files-control.component";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {UploadService} from "./upload.service";
@NgModule({
    imports: [FormsModule],
    declarations: [FilesControl],
    providers: [UploadService],
    exports: [FilesControl]
})
export class FilesControlModule {
}