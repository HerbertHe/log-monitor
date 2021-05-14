import { readFromPath, formatter } from "./handlers"
import * as path from "path"

test("测试从路径读取文件", () => {
    const ex = path.resolve(__dirname, "../../examples")
    const res = readFromPath(ex, "nginx")
    // console.log(res)
})

test("测试日志规范化", () => {
    const ex = path.resolve(__dirname, "../../examples")
    const raw = readFromPath(ex, "nginx")
    if (raw) {
        const res = formatter(raw[0].content)
        // console.log(res)
    }
})
