import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { lastValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class OcmService {
  private readonly logger = new Logger(OcmService.name);
  private readonly API_URL = 'https://api.openchargemap.io/v3/poi';

  constructor(
    private readonly httpService: HttpService,
    @InjectQueue('ocm') private readonly ocmQueue: Queue,
  ) {}

  async findOne(id: number) {
    const params = {
      output: 'json',
      chargepointid: id,
      maxresults: 1,
      key: process.env.OCM_API_KEY,
    };

    const data = await lastValueFrom(
      this.httpService.get(this.API_URL, { params }).pipe(map((res) => res.data)),
    );

    return data && data.length > 0 ? data[0] : null;
  }

  async findAll(
    latitude: number,
    longitude: number,
    distance = 50,
    distanceUnit = 'KM',
    maxResults = 10,
  ) {
    const params = {
      output: 'json',
      latitude,
      longitude,
      distance,
      distanceunit: distanceUnit,
      maxresults: maxResults,
      key: process.env.OCM_API_KEY,
    };

    return lastValueFrom(
      this.httpService.get(this.API_URL, { params }).pipe(map((res) => res.data)),
    );
  }

  async spawnFetchJob(latitude: number, longitude: number, distance = 50) {
    await this.ocmQueue.add(
      'fetch_stations',
      { latitude, longitude, distance },
      {
        repeat: {
          every: 300,
        },
      },
    );
    this.logger.log(`Spawned repeatable fetch job for sector [${latitude}, ${longitude}]`);
  }
}