import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bullmq';
import { makeCounterProvider } from '@willsoto/nestjs-prometheus';
import { OcmResolver } from '../schemas/ocm.resolver';
import { OcmService } from './ocm.service';
import { OcmProcessor } from './ocm.processor';
import { OcmEvents } from './ocm.events';
import { TarantoolModule } from '../tarantool/tarantool.module';

@Module({
  imports: [
    HttpModule,
    TarantoolModule,
    BullModule.registerQueue({ name: 'ocm' }),
  ],
  providers: [
    OcmResolver,
    OcmService,
    OcmProcessor,
    OcmEvents,
    makeCounterProvider({
      name: 'ocm_job_success_total',
      help: 'Total number of successful OCM jobs',
    }),
    makeCounterProvider({
      name: 'ocm_job_failure_total',
      help: 'Total number of failed OCM jobs',
    }),
  ],
})
export class OcmModule {}