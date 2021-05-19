import { ModeType } from "../typings/types";
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
 * @param log
 * @param type
 * @param mode
 * @param fn
 */
export declare const sorter: (log: Array<string>, type: "access" | "error", mode?: ModeType | undefined, fn?: ISorterFn | undefined) => IStandardLog | null | undefined;
