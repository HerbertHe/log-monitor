export declare type ModeType = "nginx" | "apache" | "custom";
export interface IStandardLogFile {
    from: string;
    type: "access" | "error";
    content: string;
    mode: ModeType;
}
