import { resolve6 } from "dns"
import { nginxTimeConverter } from "./time"

test("测试nginx时间转化", () => {
    const ex = "13/May/2021:06:49:38 +0800"
    const res = nginxTimeConverter(ex)
    expect(res?.toString()).toEqual(
        "Thu May 13 2021 06:49:38 GMT+0800 (GMT+08:00)"
    )
})
