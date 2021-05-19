import { IStandardLogFile } from "../typings/types"
import { formatter, readFromPath } from "./handlers"
import { ISorterFn, sorter } from "./sorter"

interface ILogMonitorOptions {
    log?: string | Array<string>
    path?: string
    mode?: "nginx" | "custom"
    filter?: RegExp
    custom?: ICustom
}

/**
 * 自定义解析日志类型
 * @param sorter 自定义分拣器函数
 */
interface ICustom {
    sorter: ISorterFn
}

class LogMonitor {
    private log?: string | Array<string>
    private path?: string
    private mode?: "nginx" | "custom" = "nginx"
    private filter?: RegExp
    private custom?: ICustom
    constructor(opts: ILogMonitorOptions) {
        const { log, path, mode, filter, custom } = opts
        this.log = log
        this.path = path
        this.mode = mode
        this.filter = filter
        this.custom = custom
    }

    export = () => {
        if (!!this.path) {
            const logs = readFromPath(this.path, this.mode)
            if (!!logs && logs.length !== 0) {
                // 日志存在
                let result: any = []
                logs.forEach((item: IStandardLogFile) => {
                    const afterFormat = formatter(item.content, this.filter)
                    if (afterFormat.length === 0) {
                        result.push({
                            from: item.from,
                            type: item.type,
                            mode: !this.mode ? "nginx" : this.mode,
                            logs: { labels: [], content: [] },
                        })
                    } else {
                        const afterSorted = sorter(
                            afterFormat,
                            item.type,
                            item.mode
                        )
                        if (!!afterSorted) {
                            result.push({
                                from: item.from,
                                type: item.type,
                                mode: !this.mode ? "nginx" : this.mode,
                                logs: afterSorted,
                            })
                        }
                    }
                })
                return result
            } else {
                return null
            }
        } else if (!!this.log) {
            // log存在的时候
        }
    }
}

export default LogMonitor
