import { ISorterFn } from "./sorter";
interface ILogMonitorOptions {
    log?: string | Array<string>;
    path?: string;
    mode?: "nginx" | "custom";
    filter?: RegExp;
    custom?: ICustom;
}
/**
 * 自定义解析日志类型
 * @param sorter 自定义分拣器函数
 */
interface ICustom {
    sorter: ISorterFn;
}
declare class LogMonitor {
    private log?;
    private path?;
    private mode?;
    private filter?;
    private custom?;
    constructor(opts: ILogMonitorOptions);
    export: () => any;
}
export default LogMonitor;
