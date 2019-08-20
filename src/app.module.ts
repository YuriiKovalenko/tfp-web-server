import { Module, HttpModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RegionController } from './region/region.controller';
import { RegionService } from './region/region.service';

@Module({
  imports: [HttpModule],
  controllers: [AppController, RegionController],
  providers: [AppService, RegionService],
})
export class AppModule {}
