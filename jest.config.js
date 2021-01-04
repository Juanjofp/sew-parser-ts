module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    coverageDirectory: './coverage',
    collectCoverage: true,
    collectCoverageFrom: ['src/**/*.ts', '!src/index.ts'],
    coverageThreshold: {
        global: {
            statements: 100,
            branches: 100,
            functions: 100,
            lines: 100
        }
    },
    watchPlugins: [
        'jest-watch-typeahead/filename',
        'jest-watch-typeahead/testname'
    ],
    setupFiles: ['./setup-tests.ts'],
    testTimeout: 10000
};
