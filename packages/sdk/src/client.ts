export interface OrvynOptions {
    apiKey?: string;
}

export class OrvynClient {
    private apiKey?: string;

    constructor(options: OrvynOptions = {}) {
        this.apiKey = options.apiKey;
    }

    // Placeholder methods for future implementation
    async compile() { }
    async deploy() { }
}
