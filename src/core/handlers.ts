import * as fs from "fs"

export interface IStandardLogFile {
    from: string
    content: string
}

/**
 * 日志标准化工具
 * @param log 日志内容
 * @param filter 日志过滤器
 */
export const formatter = (log: string, filter?: RegExp) => {
    if (!!log) {
        return []
    } else {
        log = log.replace(/\r\n/g, "\n")
    }

    if (!!filter) {
        return log.split("\n").filter((item: string) => !filter.test(item))
    } else {
        return log.split("\n")
    }
}

/**
 * 日志格式转换工具
 * @param logs 日志切割之后的数组
 */
export const transformer = (logs: Array<string>, mode?: "nginx" | "custom") => {
    if (!!logs || logs.length === 0) {
        return null
    }
}

/**
 * 从本地读取日志
 * @param path 本地路径
 */
export const readFromPath = (path: string, mode?: "nginx" | "custom") => {
    if (!path) {
        return null
    }

    // 过滤后缀.error.log .access.log .error.log.1
    const fileRegex = /.([error|access]+).log(.[0-9]+)?$/

    if (!mode || mode === "nginx") {
        // 过滤获取文件信息
        const files = fs
            .readdirSync(path, {
                encoding: "utf-8",
            })
            .filter((item: string) => fileRegex.test(item))

        if (files.length === 0) {
            return null
        }

        const result = files
            .map((item: string) => {
                const content = fs.readFileSync(`${path}/${item}`, {
                    encoding: "utf-8",
                })

                return {
                    from: item,
                    content,
                } as IStandardLogFile
            })
            .filter((item: IStandardLogFile) => !!item.content)
        return result
    }
}

/**
 * 标准化各种日志信息
 * @param log 各种类型日志
 * @param filter 过滤器
 */
export const rawLogHandler = (
    log: string | Array<string> | Array<IStandardLogFile>,
    filter: RegExp
): Array<string> => {
    if (!log || log.length === 0) {
        return null
    }

    if (typeof log === "string") {
        return [log]
    } else if (!!log[0] && typeof log[0] === "string") {
        // 数组类型
        return log as Array<string>
    } else {
        // 处理其他类型, 默认 标准日志文件 这种
        // 读取所有的日志, 转化为字符串数组
        const typedLog = log as Array<IStandardLogFile>
        return typedLog
            .map((item: IStandardLogFile) => [
                ...formatter(item.content, filter),
            ])
            .flat(Infinity) as Array<string>
    }
}
