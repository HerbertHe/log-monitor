import { IStandardLogFile, ModeType } from "../typings/types";
/**
 * 日志标准化工具
 * @param log 日志内容
 * @param mode 日志模式
 * @param type 日志类型
 * @param filter 日志过滤器
 */
export declare const formatter: (log: string, mode?: ModeType | undefined, type?: "access" | "error" | undefined, filter?: RegExp | undefined) => string[];
/**
 * 从本地读取日志
 * @param path 本地路径
 */
export declare const readFromPath: (path: string, mode?: ModeType | undefined) => IStandardLogFile[] | null | undefined;
