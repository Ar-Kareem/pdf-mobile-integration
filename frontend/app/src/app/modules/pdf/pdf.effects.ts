import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import { pdfActions } from "./pdf.reducer";
import { PdfService } from "./pdf.service";


@Injectable()
export class PdfEffects {

  constructor(
    private actions$: Actions,
    private pdfService: PdfService
  ) {}

  downloadPdf$ = createEffect(() => this.actions$.pipe(
    ofType(pdfActions.downloadPdfAttempted),
    switchMap((action) => this.pdfService.create_request()
      .pipe(
        map(result => {
          const reqID = result.result;
          console.log('HERE');
          setTimeout(async () => {
            await this.pdfService.download(reqID, action.url).toPromise()
          }, 0);
          return pdfActions.downloadPdfSuccess({req: reqID});
        },
        catchError(() => of(pdfActions.downloadPdfFailed())),
      ))
    )
  ));

}