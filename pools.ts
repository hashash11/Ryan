import { Thread, Pool } from "threads"

interface PoolOptions {
    concurrency?: number
    maxQueuedJobs?: number
    name?: string
    size?: number
  }
  
  function Pool(threadFactory: () => Thread, size?: number): Pool
  function Pool(threadFactory: () => Thread, options?: PoolOptions): Pool