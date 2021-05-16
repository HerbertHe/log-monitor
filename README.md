# log-monitor

> A library for monitoring logs! (like nginx)

[简体中文](./README.CN.md) | [English](./README.md)

## Install

```bash
npm i @herberthe/log-monitor
# or yarn
yarn add @herberthe/log-monitor
```

## Usage

```ts
const { LogMonitor } = require("@herberthe/log-monitor")
const monitor = new LogMonitor(options)
console.log(monitor.export())
```
