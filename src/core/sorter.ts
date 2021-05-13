export interface IStandardNginxLog {
    ip: string
    time: string
    request: string
    status: string
    code: string
    url: string
    ua: string
    raw: string
}

/**
 * 日志分拣器
 * @param log 日志文件
 * @param mode
 */
export const sorter = (log: Array<string>, mode?: "nginx" | "custom") => {
    if (!log) {
        return null
    }

    if (!!mode || mode === "nginx") {
        // nginx日志标准化处理
        const regex =
            /(([0-9]{1,3}.?)+)\s*-\s*-\s*\[([^[]+)\]\s*\"([^"]+)\"\s*([0-9]{3})\s*([0-9]+)\s*\"([^"]+)\"\s*\"([^"]+)\"/
        const result = log.map((item: string) => {
            const res = regex.exec(item) as RegExpExecArray
            return {
                ip: res[1],
                time: res[3],
                request: res[4],
                status: res[5],
                code: res[6],
                url: res[7],
                ua: res[8],
                raw: res[0],
            } as IStandardNginxLog
        })
        return result
    }
}
