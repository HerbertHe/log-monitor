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
 * @param log 日志文件
 * @param mode
 */
export const sorter = (
    log: Array<string>,
    mode?: "nginx" | "custom",
    fn?: ISorterFn
) => {
    if (!log) {
        return null
    }

    if (!mode || mode === "nginx") {
        // nginx日志标准化处理
        const regex =
            /(([0-9]{1,3}.?)+)\s*-\s*-\s*\[([^[]+)\]\s*\"([^"]+)\"\s*([0-9]{3})\s*([0-9]+)\s*\"([^"]+)\"\s*\"([^"]+)\"/
        const result = log.map((item: string) => {
            const res = regex.exec(item) as RegExpExecArray
            // 转化为数组输出
            if (!!res) {
                return [
                    ...res.filter((val: any, index: number) => !(index === 2)),
                ]
            }
        })
        return {
            labels: [
                "raw",
                "ip",
                "time",
                "request",
                "status",
                "code",
                "url",
                "ua",
            ],
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
