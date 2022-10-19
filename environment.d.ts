declare global {
    namespace NodeJS {
        interface ProcessEnv {
            botToken: string;
            guildId: string;
            clientId: string;
            environment: "dev" | "prod" | "debug";
        }
    }
}

export {};