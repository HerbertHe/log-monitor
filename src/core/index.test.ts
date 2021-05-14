import LogMonitor from "./index"
import * as path from "path"
import * as fs from "fs"

test("测试log输出", () => {
    const tx = new LogMonitor({
        path: path.resolve(__dirname, "../../examples"),
    })
    const res = tx.export()
    fs.writeFileSync(
        path.resolve(__dirname, "../../test_res/index_export.json"),
        JSON.stringify(res),
        {
            encoding: "utf-8",
        }
    )
})
