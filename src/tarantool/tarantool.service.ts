import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
// @ts-ignore
import TarantoolConnection = require('tarantool-driver');

@Injectable()
export class TarantoolService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(TarantoolService.name);
  private connection: any;

  async onModuleInit() {
    this.connection = new TarantoolConnection({
      host: process.env.TARANTOOL_HOST || 'localhost',
      port: parseInt(process.env.TARANTOOL_PORT || '3301', 10),
    });

    try {
      await this.connection.connect();
      this.logger.log('AEU Enact System: Connected to Tarantool Tactical Database.');
    } catch (error) {
      this.logger.error('AEU Enact System: Database Connection Failed', error);
    }
  }

  async onModuleDestroy() {
    if (this.connection) {
      await this.connection.destroy();
      this.logger.log('Tarantool connection closed.');
    }
  }

  async saveStationData(data: any) {
    // Calls the Lua function 'save_station_data' defined in init.lua
    this.logger.debug(`Upserting station data for ID: ${data.ID}`);
    return this.connection.call('save_station_data', [data]);
  }
}