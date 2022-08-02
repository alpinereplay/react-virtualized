// module.exports = {
//     globalSetup: "jest-environment-puppeteer/setup",
//     globalTeardown: "jest-environment-puppeteer/teardown",
//     setupFiles: ["./source/jest-setup.js"],
//     roots: ["./source"],
//     coverageReporters: ["lcov"],
//     collectCoverageFrom: [
//         "source/**/*.js",
//         "!source/vendor/**",
//         "!source/demo/**",
//         "!source/jest-*.js",
//         "!source/TestUtils.js",
//         "!**/*.example.js",
//     ],
//     testRegex: ".(jest|e2e|ssr).js$",
//     verbose: true,
// }

import type { Config } from "@jest/types"
// Sync object
const config: Config.InitialOptions = {
    verbose: true,
    transform: {
        "^.+\\.tsx?$": "ts-jest",
    },
}
export default config
