---
title: js 并发任务脚本
---

`````markdown
实现一个nodejs 脚本, 目标版本 node 25 , esm，零外部依赖

使用下面的dispatcher控制并发，本地已有存在文件视为失败
控制台美观输出运行情况

```js
function dispatcher({
  run,
  next = async () => { return {} },
  ok = async () => { },
  error = async () => { },
  maxWorkers = 8,
  timeout = 120000,
  delay = 50,
  delayOffset = 1000,
  delayFail = 3000,
  maxFails = 10,
  maxAttempts = 3,
  batch = 1,
}) {
  let workers = new Set()
  let fails = 0
  let running = false
  let _delay = delay
  async function _run() {
    const params = await next() // throw-out
    for (let i = 0; running && i < maxAttempts; i++) {
      try {
        ok(await run(params, { signal: AbortSignal.timeout(timeout), date: new Date() }));
        return;
      } catch (err) {
        error(err)
        await sleep(_delay * 2 ** i + Math.floor(Math.random() * delayOffset));
      }
    }
    throw new Error('Maximum retry factor reached.');
  }

  async function start() {
    if (running) return;
    running = true
    while (running) {
      for (let i = 0; i < batch; i++) {
        if (workers.size < maxWorkers) {
          const p = _run()
            .then(() => {
              fails = 0
              _delay = delay
            })
            .catch((err) => {
              // Internal error of next()
              // Maximum retry
              fails++
              _delay = delayFail
              error(err)
            })
          workers.add(p)
          p.finally(() => {
            workers.delete(p)
          })

          if (fails > maxFails) {
            console.error(`Reached max continuous fails (${maxFails}).`)
            running = false
          }
        }
      }
      await sleep(_delay * 2 ** fails + Math.floor(Math.random() * delayOffset));
    }
  }
  async function stop() {
    running = false
    return await Promise.allSettled(workers)
  }

  return {
    start,
    stop,
    get alive() { return workers.size }
  }
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

async function run({ }, { signal }) {

}

async function next() {

}

async function ok(res) {

}
async function error(err) {
  console.error(err);
}

process.on('unhandledRejection', (reason, promise) => {
  console.error('unhandledRejection:');
  console.error('reason:', reason);
  console.error('Promise:', promise);
});

dispatcher({ run, next, ok, error }).start()



```
`````
