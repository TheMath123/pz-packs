import { appWorker } from './app-queue'
import { connection } from './connection'
import { appQueue } from './instance'

const workers = [appWorker]

const queues = [appQueue]

export const setupQueues = () => {
  if (
    'options' in connection &&
    connection.options.maxRetriesPerRequest !== null
  )
    // Optional: Add global error listeners or monitoring here
    workers.forEach((worker) => {
      worker.on('error', (_err) => {
        // Log worker errors
      })
    })
}

export const shutdownQueues = async () => {
  await Promise.all([
    ...workers.map((w) => w.close()),
    ...queues.map((q) => q.close()),
  ])
}
