import { nginxTimeConverter } from "./time"

test("测试nginx时间转化", () => {
    const ex = "13/May/2021:06:49:38 +0800"
    const res = nginxTimeConverter(ex)
    expect(res?.toLocaleString("en-US", { timeZone: "Asia/Shanghai" })).toEqual(
        "5/13/2021, 6:49:38 AM"
    )
})
