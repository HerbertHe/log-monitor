import { ModeType } from "../typings/types"
import { nginxTimeConverter } from "./time"

export interface IStandardLog {
    labels: Array<string>
    content: Array<Array<string>>
}

export type ISorterFn = (logs: Array<string>) => {
    labels: Array<string>
    content: Array<Array<string>>
}

/**
 * 日志分拣器
 * @param log
 * @param type
 * @param mode
 * @param fn
 */
export const sorter = (
    log: Array<string>,
    type: "access" | "error",
    mode?: ModeType,
    fn?: ISorterFn
) => {
    if (!log) {
        return null
    }

    if ((!mode || ["nginx", "apache"].includes(mode)) && type === "access") {
        // nginx日志标准化处理
        const regex =
            /(([0-9]{1,3}.?)+)\s*-\s*-\s*\[([^[]+)\]\s*\"([^"]*)\"\s*([0-9]{3})\s*([0-9]+)(\s*\"([^"]+)\"\s*\"([^"]+)\")?/
        const result = log
            .map((item: string) => {
                const res = regex.exec(item) as RegExpExecArray
                // 转化为数组输出
                if (!!res) {
                    return [
                        ...res.filter(
                            (val: any, index: number) =>
                                !(index === 2 || index === 7)
                        ),
                    ]
                }
            })
            .filter((item: any) => !!item)

        return {
            labels: [
                "raw",
                "ip",
                "time",
                "request",
                "status",
                "bytes",
                "referer",
                "ua",
            ],
            content: result,
        } as IStandardLog
    }

    if ((!mode || mode === "nginx") && type === "error") {
        const regex =
            /([0-9]{4}\/[0-9]{2}\/[0-9]{2} ([0-9]{2}:?)+)\s*\[([a-z]+)\]\s*([0-9#]+):\s*\*([0-9]+)\s*([^,]+),\s*(client:\s*[^,]+),\s*(server:\s*[^,]+),\s*(request:\s*\"[^"]+\"),? ?(upstream:\s*\"[^"]+\")?(host:\s*\"[^"]+\")?,? ?(referrer:\s*\"[^"]+\")?/
        const result = log
            .map((item: string) => {
                const res = regex.exec(item) as RegExpExecArray
                // 转化为数组输出
                if (!!res) {
                    let tmp = []
                    for (let i = 0; i < res.length; i++) {
                        if (i !== 2) {
                            if (!res[i]) {
                                tmp.push("")
                                continue
                            }
                            tmp.push(res[i])
                        }
                    }
                    return tmp
                }
            })
            .filter((item: any) => !!item)

        return {
            labels: [
                "raw",
                "time",
                "level",
                "pid",
                "number",
                "message",
                "client",
                "server",
                "request",
                "upstream",
                "host",
                "referrer",
            ],
            content: result,
        } as IStandardLog
    }

    if (mode === "apache" && type === "error") {
        const regex =
            /\[([^\]]+)\]\s*\[([a-z]+)\]\s*\[client\s*([0-9\.?]+)\]\s*([^\n]+)/
        const result = log
            .map((item: string) => {
                const res = regex.exec(item) as RegExpExecArray
                // 转化为数组输出
                if (!!res) {
                    return [...res]
                }
            })
            .filter((item: any) => !!item)

        return {
            labels: ["raw", "time", "level", "client", "message"],
            content: result,
        } as IStandardLog
    }

    if (mode === "custom") {
        if (!fn) {
            throw new Error("No custom sorter function found!")
        }

        const { labels, content } = fn(log)
        if (labels.length > content[0].length) {
            throw new Error("Length of labels is more long than content")
        } else {
            return {
                labels,
                content,
            } as IStandardLog
        }
    }
}
