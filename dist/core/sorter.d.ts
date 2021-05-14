export interface IStandardLog {
    labels: Array<string>;
    content: Array<Array<string>>;
}
export declare type ISorterFn = (logs: Array<string>) => {
    labels: Array<string>;
    content: Array<Array<string>>;
};
/**
 * 日志分拣器
 * @param log 日志文件
 * @param mode
 */
export declare const sorter: (log: Array<string>, mode?: "nginx" | "custom" | undefined, fn?: ISorterFn | undefined) => IStandardLog | null | undefined;
