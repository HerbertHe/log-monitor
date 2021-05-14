import commonjs from "@rollup/plugin-commonjs"
import resolve from "@rollup/plugin-node-resolve"
import babel from "@rollup/plugin-babel"
import pkg from "./package.json"

const extensions = [".js", ".ts"]

export default {
    input: "./src/index.ts",
    external: [],

    plugins: [
        resolve({ extensions }),

        commonjs(),

        babel({ extensions, include: ["src/**/*"], babelHelpers: "bundled" }),
    ],

    output: [
        {
            file: pkg.main,
            format: "cjs",
        },
    ],
}
