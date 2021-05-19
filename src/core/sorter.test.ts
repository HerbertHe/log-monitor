import { sorter } from "./sorter"
import { readFromPath, formatter } from "./handlers"
import * as path from "path"
import * as fs from "fs"

test("测试nginx标准日志分拣器", () => {
    const ex = path.resolve(__dirname, "../../examples")
    const raw = readFromPath(ex, "nginx")
    if (raw) {
        const logs = formatter(raw[0].content)
        const result = sorter(logs, "access")
        fs.writeFileSync(
            path.resolve(__dirname, "../../test_res/nginx_sorter.json"),
            JSON.stringify(result),
            {
                encoding: "utf-8",
            }
        )
    }
})

test("测试Apache错误日志分拣器", () => {
    const ex = path.resolve(__dirname, "../../examples/apache/error_log")
    const raw = fs.readFileSync(ex, { encoding: "utf-8" })
    const logs = formatter(raw, "apache", "error")
    const result = sorter(logs, "error", "apache")
    fs.writeFileSync(
        path.resolve(__dirname, "../../test_res/apache_error_sorter.json"),
        JSON.stringify(result),
        {
            encoding: "utf-8",
        }
    )
})
