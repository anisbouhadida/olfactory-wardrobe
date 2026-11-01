import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { CatalogModule } from './catalog/catalog.module.js';
import { CollectionModule } from './collection/collection.module.js';
import { ConsultationsModule } from './consultations/consultations.module.js';
import { ProfilesModule } from './profiles/profiles.module.js';
import { RecommendationsModule } from './recommendations/recommendations.module.js';
import { WardrobeModule } from './wardrobe/wardrobe.module.js';
import { DecisionsModule } from './decisions/decisions.module.js';
import { WishlistModule } from './wishlist/wishlist.module.js';
import { SamplingModule } from './sampling/sampling.module.js';
import { PrivacyModule } from './privacy/privacy.module.js';
import { JobsModule } from './jobs/jobs.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    CatalogModule,
    CollectionModule,
    ConsultationsModule,
    ProfilesModule,
    RecommendationsModule,
    WardrobeModule,
    DecisionsModule,
    WishlistModule,
    SamplingModule,
    PrivacyModule,
    JobsModule,
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
