import * as fs from "fs"
import { IStandardLogFile, ModeType } from "../typings/types"

/**
 * 日志标准化工具
 * @param log 日志内容
 * @param mode 日志模式
 * @param type 日志类型
 * @param filter 日志过滤器
 */
export const formatter = (
    log: string,
    mode?: ModeType,
    type?: "error" | "access",
    filter?: RegExp
) => {
    if (!log) {
        return []
    } else {
        log = log.replace(/\r\n/g, "\n")
    }

    // 处理掉mode时apache error的情况
    if (mode === "apache" && type === "error") {
        const ApacheErrorRegex =
            /\[([^\]]+)\]\s*\[([a-z]+)\]\s*\[client\s*([0-9\.?]+)\]\s*([^\[]+)\n?/g
        const res = log.match(ApacheErrorRegex)
        if (!!res) {
            if (!!filter) {
                return res
                    .map((item: string) => item.replace(/\s+/g, " ").trim())
                    .filter((item: string) => !filter.test(item) && !!item)
            } else {
                return res
                    .map((item: string) => item.replace(/\s+/g, " ").trim())
                    .filter((item: string) => !!item)
            }
        }
        return []
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
export const readFromPath = (path: string, mode?: ModeType) => {
    if (!path) {
        return null
    }

    // 过滤后缀.error.log .access.log .error.log.1
    const fileRegex = /\.?([error|access]+)[.|_]log(.[0-9]+)?(.gz)?$/

    if (!mode || ["nginx", "apache"].includes(mode)) {
        // 过滤获取文件信息

        const files = fs.readdirSync(path, {
            encoding: "utf-8",
        })

        if (files.length === 0) {
            return null
        }

        let result = []

        for (let i = 0; i < files.length; i++) {
            const res = fileRegex.exec(files[i])
            if (!!res && ["access", "error"].includes(res[1]) && !res[3]) {
                const content = fs.readFileSync(`${path}/${files[i]}`, {
                    encoding: "utf-8",
                })

                result.push({
                    from: files[i],
                    type: res[1],
                    content,
                    mode: !mode ? "nginx" : mode,
                } as IStandardLogFile)
            }
        }

        return result.filter((item: IStandardLogFile) => !!item.content)
    }
}
