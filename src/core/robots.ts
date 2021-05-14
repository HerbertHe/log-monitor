interface IRobots {
    name: string
    symbol: string
}

/**
 * 机器人侦测
 * @param ua user-agent
 */
export const robotScanner = (ua: string) => {
    if (ua === "-") {
        return ["", ""]
    }

    const robots: Array<IRobots> = [
        {
            name: "百度蜘蛛",
            symbol: "Baiduspider",
        },
        {
            name: "搜狗spider",
            symbol: "Sogou web spider",
        },
        {
            name: "华为PetalBot",
            symbol: "PetalBot",
        },
        {
            name: "AhrefsBot",
            symbol: "AhrefsBot",
        },
        {
            name: "Nimbostratus-Bot",
            symbol: "Nimbostratus-Bot",
        },
        {
            name: "l9explore",
            symbol: "l9explore",
        },
        {
            name: "BLEXBot",
            symbol: "BLEXBot",
        },
    ]

    for (let i = 0; i < robots.length; i++) {
        const matched = ua.match(robots[i].symbol)
        if (!!matched) {
            return [robots[i].name, robots[i].symbol]
        }
    }

    return ["", ""]
}
