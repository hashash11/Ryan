import { spawn, Pool, Worker } from "threads"



// this file and threads are used in multithreading connect generator.service.ts for pass images and tiles with que.
// if you dont used this file so it s called single threading 
const pool = Pool(() => spawn(new Worker("./imaging/generator")), 4 /* optional size */)

pool.queue(async multiplier => {
  const multiplied = await multiplier(4, 5)
  console.log(`2 * 3 = ${multiplied}`)
})

 pool.completed()
 pool.terminate()
