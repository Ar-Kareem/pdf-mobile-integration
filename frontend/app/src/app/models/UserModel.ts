export class User {
    constructor(
        public given_name: string,
        public family_name: string,
        public picture: string,
        public email: string,
        public is_authenticated: boolean
    ) { }
}