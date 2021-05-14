import { sorter } from "./sorter"
import { readFromPath, formatter } from "./handlers"
import * as path from "path"
import * as fs from "fs"

test("测试nginx标准日志分拣器", () => {
    const ex = path.resolve(__dirname, "../../examples")
    const raw = readFromPath(ex, "nginx")
    if (raw) {
        const logs = formatter(raw[0].content)
        const result = sorter(logs)
        fs.writeFileSync(
            path.resolve(__dirname, "../../test_res/nginx_sorter.json"),
            JSON.stringify(result),
            {
                encoding: "utf-8",
            }
        )
    }
})
