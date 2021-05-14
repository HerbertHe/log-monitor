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
    if (!log) {
        return []
    } else {
        log = log.replace(/\r\n/g, "\n")
    }

    if (!!filter) {
        return log
            .split("\n")
            .filter((item: string) => !filter.test(item) && !!item)
    } else {
        return log.split("\n").filter((item: string) => !!item)
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
    const fileRegex = /\.?([error|access]+).log(.[0-9]+)?(.gz)?$/

    if (!mode || mode === "nginx") {
        // 过滤获取文件信息
        const files = fs
            .readdirSync(path, {
                encoding: "utf-8",
            })
            .filter((item: string) => {
                // 更改filter条件
                const res = fileRegex.exec(item)
                if (!!res && ["access", "error"].includes(res[1]) && !res[3]) {
                    return true
                } else {
                    return false
                }
            })

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
