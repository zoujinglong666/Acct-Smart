import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AudioService } from './audio.service';
import { AudioController } from './audio.controller';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [HttpModule, AiModule],
  controllers: [AudioController],
  providers: [AudioService],
  exports: [AudioService]
})
export class AudioModule {}
