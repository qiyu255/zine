---
title: 可取消的sleep实现
---

```js
function sleep(ms, signal) {
  return new Promise((resolve) => {
    if (signal?.aborted) {
      return resolve();
    }

    const timer = setTimeout(resolve, ms);

    const onAbort = () => {
      clearTimeout(timer);
      resolve();
    };

    if (signal) {
      signal.addEventListener('abort', onAbort, { once: true });
    }
  });
}
```
