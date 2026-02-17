import { Module } from '@nestjs/common';
import { TarantoolService } from './tarantool.service';

@Module({
  providers: [TarantoolService],
  exports: [TarantoolService],
})
export class TarantoolModule {}