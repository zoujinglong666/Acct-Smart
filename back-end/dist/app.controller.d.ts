export declare class AppController {
    getHealth(): {
        code: number;
        message: string;
        data: {
            status: string;
            timestamp: string;
            uptime: number;
        };
    };
    getRoot(): {
        code: number;
        message: string;
        data: {
            version: string;
            description: string;
        };
    };
}
