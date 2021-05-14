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
 * 日志格式转换工具
 * @param logs 日志切割之后的数组
 */
export declare const transformer: (logs: Array<string>, mode?: "nginx" | "custom" | undefined) => null | undefined;
/**
 * 从本地读取日志
 * @param path 本地路径
 */
export declare const readFromPath: (path: string, mode?: "nginx" | "custom" | undefined) => IStandardLogFile[] | null | undefined;
/**
 * 标准化各种日志信息
 * @param log 各种类型日志
 * @param filter 过滤器
 */
