import { rawLogHandler, readFromPath } from "./handlers"
import { sorter } from "./sorter"

interface ILogMonitorOptions {
    log?: string | Array<string>
    path?: string
    mode?: "nginx" | "custom"
    filter?: RegExp
}

class LogMonitor {
    private log: string | Array<string> = null
    private path: string = null
    private mode: "nginx" | "custom" = "nginx"
    private filter: RegExp = null
    constructor(opts: ILogMonitorOptions) {
        const { log, path, mode, filter } = opts
        this.log = log
        this.path = path
        this.mode = mode
        this.filter = filter
    }

    export = () => {
        if (!!this.path) {
            // path传参的时候, 读取目录下的所有的文件
            const logs = rawLogHandler(readFromPath(this.path), this.filter)
            const afterSorted = sorter(logs)
        } else if (!!this.log) {
            // log存在的时候
        }
    }
}

export default LogMonitor
