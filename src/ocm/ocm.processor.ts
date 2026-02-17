import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { OcmService } from './ocm.service';
import { TarantoolService } from '../tarantool/tarantool.service';

@Processor('ocm')
export class OcmProcessor extends WorkerHost {
  private readonly logger = new Logger(OcmProcessor.name);

  constructor(
    private readonly ocmService: OcmService,
    private readonly tarantoolService: TarantoolService,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.debug(`Processing job ${job.id}: ${job.name}`);

    if (job.name === 'fetch_stations') {
      const { latitude, longitude, distance } = job.data;
      const stations = await this.ocmService.findAll(latitude, longitude, distance);

      if (stations && stations.length > 0) {
        this.logger.log(`Fetched ${stations.length} stations. Saving to tactical database...`);
        for (const station of stations) {
          await this.tarantoolService.saveStationData(station);
        }
      }
      return { count: stations ? stations.length : 0 };
    }

    return {};
  }
}