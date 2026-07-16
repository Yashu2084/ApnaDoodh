import { geocodeAddress } from "./services";
import { getDeliveries, getUsers } from "./db";
import fs from "fs/promises";
import path from "path";

export interface Job {
  id: string;
  name: string;
  data: any;
  status: "waiting" | "active" | "completed" | "failed";
  progress: number;
  result?: any;
  error?: string;
  createdAt: number;
}

const jobsStore = new Map<string, Job>();
let isWorkerRunning = false;

const workersRegistry: Record<string, (data: any, progressCallback: (pct: number) => void) => Promise<any>> = {
  "GENERATE_DELIVERY_ROSTER": async (data: { date: string }, progressCallback) => {
    progressCallback(10);
    const deliveries = await getDeliveries();
    const targetDate = data.date || new Date().toLocaleDateString("en-US", { dateStyle: "medium" });
    const activeDrops = deliveries.filter(d => d.date === targetDate && d.status === "Scheduled");

    progressCallback(30);
    const users = await getUsers();
    
    progressCallback(50);
    const roster = [];
    for (let i = 0; i < activeDrops.length; i++) {
      const drop = activeDrops[i];
      const customer = users.find(u => u.id === drop.customerId);
      const coords = await geocodeAddress(drop.address);
      
      roster.push({
        deliveryId: drop.id,
        customerName: drop.customerName,
        address: drop.address,
        product: drop.product,
        quantity: drop.quantity,
        coordinates: coords,
        farmerId: drop.farmerId
      });

      const loopPct = 50 + Math.floor((i / activeDrops.length) * 40);
      progressCallback(loopPct);
    }

    progressCallback(90);
    const rosterPath = path.join("C:\\Users\\MOL\\.gemini\\antigravity", `delivery_roster_${targetDate.replace(/[\s,]+/g, "_")}.json`);
    await fs.writeFile(rosterPath, JSON.stringify(roster, null, 2), "utf-8");

    progressCallback(100);
    return {
      message: `Roster generated successfully for date: ${targetDate}`,
      totalDeliveriesScheduled: activeDrops.length,
      rosterCachedPath: rosterPath,
      deliveries: roster
    };
  }
};

async function runWorker() {
  if (isWorkerRunning) return;
  isWorkerRunning = true;

  try {
    while (true) {
      let nextJob: Job | null = null;
      for (const job of jobsStore.values()) {
        if (job.status === "waiting") {
          nextJob = job;
          break;
        }
      }

      if (!nextJob) {
        break;
      }

      const job = nextJob;
      job.status = "active";
      job.progress = 0;

      const workerFn = workersRegistry[job.name];
      if (!workerFn) {
        job.status = "failed";
        job.error = `No worker registered for task name: ${job.name}`;
        continue;
      }

      try {
        const result = await workerFn(job.data, (pct) => {
          job.progress = pct;
        });
        job.status = "completed";
        job.progress = 100;
        job.result = result;
      } catch (err: any) {
        job.status = "failed";
        job.progress = 0;
        job.error = err.message || String(err);
        console.error(`[Queue Worker] Job ${job.id} failed with error:`, err);
      }
    }
  } finally {
    isWorkerRunning = false;
  }
}

export const backgroundQueue = {
  async addJob(name: string, data: any): Promise<Job> {
    const id = "job_" + Math.random().toString(36).substring(2, 11);
    const job: Job = {
      id,
      name,
      data,
      status: "waiting",
      progress: 0,
      createdAt: Date.now()
    };

    jobsStore.set(id, job);

    setImmediate(() => {
      runWorker().catch(err => console.error("Worker thread crash:", err));
    });

    return job;
  },

  async getJob(id: string): Promise<Job | null> {
    return jobsStore.get(id) || null;
  }
};
