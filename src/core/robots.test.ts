import { robotScanner } from "./robots"

test("测试机器人侦测", () => {
    const ua =
        "Mozilla/5.0 (compatible;PetalBot;+https://webmaster.petalsearch.com/site/petalbot)"
    expect(robotScanner(ua)).toEqual(["华为PetalBot", "PetalBot"])
})
