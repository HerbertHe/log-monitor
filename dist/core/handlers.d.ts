export interface IStandardLogFile {
    from: string;
    content: string;
}
/**
 * 日志标准化工具
 * @param log 日志内容
 * @param filter 日志过滤器
 */
export declare const formatter: (log: string, filter?: RegExp | undefined) => string[];
/**
 * 从本地读取日志
 * @param path 本地路径
 */
export declare const readFromPath: (path: string, mode?: "nginx" | "custom" | undefined) => IStandardLogFile[] | null | undefined;
