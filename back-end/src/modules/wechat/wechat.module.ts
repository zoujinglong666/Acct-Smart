import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { WechatService } from './wechat.service';
import { WechatController } from './wechat.controller';

@Module({
  imports: [HttpModule],
  controllers: [WechatController],
  providers: [WechatService],
  exports: [WechatService]
})
export class WechatModule {}
