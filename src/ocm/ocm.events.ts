import { QueueEventsHost, QueueEventsListener, OnQueueEvent } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter } from 'prom-client';

@QueueEventsListener('ocm')
export class OcmEvents extends QueueEventsHost {
  private readonly logger = new Logger(OcmEvents.name);

  constructor(
    @InjectMetric('ocm_job_success_total') public successCounter: Counter<string>,
    @InjectMetric('ocm_job_failure_total') public failureCounter: Counter<string>,
  ) {
    super();
  }

  @OnQueueEvent('completed')
  onCompleted(job: { jobId: string; returnvalue: any }) {
    this.successCounter.inc();
    this.logger.log(`Job ${job.jobId} completed successfully. Result: ${JSON.stringify(job.returnvalue)}`);
  }

  @OnQueueEvent('failed')
  onFailed(job: { jobId: string; failedReason: string }) {
    this.failureCounter.inc();
    this.logger.error(`Job ${job.jobId} failed. Reason: ${job.failedReason}`);
  }
}