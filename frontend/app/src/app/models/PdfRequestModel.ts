export class PdfRequestModel {

    public percent: number|undefined;

    constructor(
        public request_id: string,
        public user: string,
        public given_name: string,
        public url: string,
        public len: number,
        public done: number,
    ) { }
}