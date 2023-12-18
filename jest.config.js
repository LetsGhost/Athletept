export default {
  preset: "jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
    "^.+\\.js$": "babel-jest",
  },
  globals: {
    'ts-jest': {
      allowJs: true,
    },
  },
};