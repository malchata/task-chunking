function blockingTask (taskNum, ms = 250) {
  // Create the starting mark
  performance.mark(`blocking_task_${taskNum}_mark`);

  let arr = [];
  const blockingStart = performance.now();

  console.log(`Synthetic task #${taskNum} running for ${ms} ms`);

  while (performance.now() < (blockingStart + ms)) {
    arr.push(Math.random() * performance.now / blockingStart / ms);
  }

  // End the task measure.
  performance.measure(`blocking_task_${taskNum}`, `blocking_task_${taskNum}_mark`);
}

function yieldWithPromise (taskNum) {
  performance.mark(`promise_yield_${taskNum}_mark`);

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();

      performance.measure(`promise_yield_${taskNum}`, `promise_yield_${taskNum}_mark`);
    });
  });
}

function noChunking () {
  blockingTask(1);
  blockingTask(2);
  blockingTask(3);
  blockingTask(4);
  blockingTask(5);
}

function chunkingWithSetTimeout () {
  blockingTask(1);

  setTimeout(() => {
    performance.mark(`setTimeout_1_mark`);
    blockingTask(2);
    performance.measure(`setTimeout_1`, `setTimeout_1_mark`);
  });

  setTimeout(() => {
    performance.mark(`setTimeout_2_mark`);
    blockingTask(3);
    performance.measure(`setTimeout_2`, `setTimeout_2_mark`);
  });

  setTimeout(() => {
    performance.mark(`setTimeout_3_mark`);
    blockingTask(4);
    performance.measure(`setTimeout_3`, `setTimeout_3_mark`);
  });

  setTimeout(() => {
    performance.mark(`setTimeout_4_mark`);
    blockingTask(5);
    performance.measure(`setTimeout_4`, `setTimeout_4_mark`);
  });
}

async function chunkingWithPromiseSetTimeout () {
  blockingTask(1);
  await yieldWithPromise(2);
  blockingTask(2);
  await yieldWithPromise(3);
  blockingTask(3);
  await yieldWithPromise(4);
  blockingTask(4);
  await yieldWithPromise(5);
  blockingTask(5);
}

async function chunkingWithPostTask () {
  const { signal } = new TaskController({
    priority: "user-blocking"
  });

  await scheduler.postTask(() => {
    blockingTask(1);
  }, {
    signal
  });

  await scheduler.postTask(() => {
    blockingTask(2);
  }, {
    signal
  });

  await scheduler.postTask(() => {
    blockingTask(3);
  }, {
    signal
  });


  await scheduler.postTask(() => {
    blockingTask(4);
  }, {
    signal
  });

  await scheduler.postTask(() => {
    blockingTask(5);
  }, {
    signal
  });
}

function chunkingWithRequestIdleCallback () {
  requestIdleCallback(() => {
    performance.mark(`requestIdleCallback_1_mark`);
    blockingTask(1);
    performance.measure(`requestIdleCallback_1`, `requestIdleCallback_1_mark`);
  });

  requestIdleCallback(() => {
    performance.mark(`requestIdleCallback_2_mark`);
    blockingTask(2);
    performance.measure(`requestIdleCallback_2`, `requestIdleCallback_2_mark`);
  });

  requestIdleCallback(() => {
    performance.mark(`requestIdleCallback_3_mark`);
    blockingTask(3);
    performance.measure(`requestIdleCallback_3`, `requestIdleCallback_3_mark`);
  });

  requestIdleCallback(() => {
    performance.mark(`requestIdleCallback_4_mark`);
    blockingTask(4);
    performance.measure(`requestIdleCallback_4`, `requestIdleCallback_4_mark`);
  });

  requestIdleCallback(() => {
    performance.mark(`requestIdleCallback_5_mark`);
    blockingTask(5);
    performance.measure(`requestIdleCallback_5`, `requestIdleCallback_5_mark`);
  });
}

// Wire up buttons
document.getElementById("no-chunking").addEventListener("click", noChunking);
document.getElementById("chunking-with-settimeout").addEventListener("click", chunkingWithSetTimeout);
document.getElementById("chunking-with-promise-settimeout").addEventListener("click", chunkingWithPromiseSetTimeout);
document.getElementById("chunking-with-posttask").addEventListener("click", chunkingWithPostTask);
document.getElementById("chunking-with-requestidlecallback").addEventListener("click", chunkingWithRequestIdleCallback);
