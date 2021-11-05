import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import { downloadPdfAttempted, downloadPdfFailed, downloadPdfSuccess } from "./pdf.reducer";
import { PdfService } from "./pdf.service";


@Injectable()
export class PdfEffects {

  constructor(
    private actions$: Actions,
    private pdfService: PdfService
  ) {}

  downloadPdf$ = createEffect(() => this.actions$.pipe(
    ofType(downloadPdfAttempted),
    switchMap((action) => this.pdfService.create_request()
      .pipe(
        map(result => {
          const reqID = result.result;
          console.log('HERE');
          setTimeout(async () => {
            await this.pdfService.download(reqID, action.url).toPromise()
          }, 0);
          return downloadPdfSuccess({req: reqID});
        },
        catchError(() => of(downloadPdfFailed())),
      ))
    )
  ));

}