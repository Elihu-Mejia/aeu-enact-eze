import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { OcmService } from '../ocm/ocm.service';
import { TarantoolService } from '../tarantool/tarantool.service';

@Resolver('ChargingStation')
export class OcmResolver {
  constructor(
    private readonly ocmService: OcmService,
    private readonly tarantoolService: TarantoolService,
  ) {}

  @Query('station')
  async getStation(@Args('id') id: number) {
    return this.ocmService.findOne(id);
  }

  @Query('stations')
  async getStations(
    @Args('latitude') latitude: number,
    @Args('longitude') longitude: number,
    @Args('distance') distance?: number,
    @Args('distanceUnit') distanceUnit?: string,
    @Args('maxResults') maxResults?: number,
  ) {
    return this.ocmService.findAll(
      latitude, longitude, distance, distanceUnit, maxResults
    );
  }

  @Mutation('saveStation')
  async saveStation(@Args('id') id: number) {
    const station = await this.ocmService.findOne(id);
    if (station) {
      await this.tarantoolService.saveStationData(station);
    }
    return station;
  }

  @Mutation('spawnFetchJob')
  async spawnFetchJob(
    @Args('latitude') latitude: number,
    @Args('longitude') longitude: number,
    @Args('distance') distance?: number,
  ) {
    await this.ocmService.spawnFetchJob(latitude, longitude, distance);
    return true;
  }
}