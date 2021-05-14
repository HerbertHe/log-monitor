# log-monitor

> 日志监控库

[简体中文](./README.CN.md) | [English](./README.md)

## 安装

```bash
npm i @herberthe/log-monitor
# or yarn
yarn add @herberthe/log-monitor
```

## 使用方法

```ts
const LogMonitor = require("@herberthe/log-monitor")
const monitor = new LogMonitor(options)
console.log(monitor.export())
```
