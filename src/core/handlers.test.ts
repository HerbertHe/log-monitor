import { readFromPath, formatter } from "./handlers"
import * as path from "path"
import * as fs from "fs"

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

test("测试ApacheError日志处理", () => {
    const ex = path.resolve(__dirname, "../../examples/apache/error_log")
    const raw = fs.readFileSync(ex, {
        encoding: "utf-8",
    })
    const result = formatter(raw, "apache", "error")
    // console.log(result)
})
