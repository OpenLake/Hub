import { Injectable, Logger } from '@nestjs/common';
import { ProxyService } from '../proxy/proxy.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly proxy: ProxyService,
    private readonly configService: ConfigService,
  ) {}

  async getUserBundle(email: string) {
    const internalSecret = this.configService.get<string>('HUB_INTERNAL_SECRET');
    
    const ACADMAP_URL = this.configService.get<string>('ACADMAP_URL') || 'https://acadmap.openlake.in';
    const COSA_URL = this.configService.get<string>('COSA_URL') || 'https://cosa.openlake.in';
    const SMART_INSTI_URL = this.configService.get<string>('SMART_INSTI_URL') || 'http://localhost:8000';

    const services = [
      {
        name: 'academics',
        provider: 'Acadmap',
        url: `${ACADMAP_URL}/api/v1/internal/user?email=${email}`,
      },
      {
        name: 'community',
        provider: 'CoSADB',
        url: `${COSA_URL}/api/v1/internal/user?email=${email}`,
      },
      {
        name: 'institute',
        provider: 'Smart Insti',
        url: `${SMART_INSTI_URL}/api/v1/internal/user?email=${email}`,
      },
      // Add more services here as they implement the internal API
    ];


    const results = await Promise.allSettled(
      services.map((service) =>
        this.proxy.forward({
          service: service.provider,
          url: service.url,
          method: 'GET',
          headers: {
            'X-Hub-Secret': internalSecret,
          },
        }),
      ),
    );

    const bundle: any = {
      identity: {
        email,
        // Identity data could be augmented from a primary source if needed
      },
      warnings: [],
    };

    results.forEach((result, index) => {
      const service = services[index];
      if (result.status === 'fulfilled') {
        const response = result.value;
        if (response.status === 200) {
          bundle[service.name] = {
            provider: service.provider,
            ...response.data.data,
          };
          
          // Optionally merge basic identity if not already present
          if (response.data.data?.identity) {
            bundle.identity = { ...bundle.identity, ...response.data.data.identity };
          }
        } else {
          bundle[service.name] = null;
          bundle.warnings.push(`Service ${service.provider} returned status ${response.status}`);
        }
      } else {
        this.logger.error(`Failed to fetch from ${service.provider}: ${result.reason}`);
        bundle[service.name] = null;
        bundle.warnings.push(`Service ${service.provider} is unreachable`);
      }
    });

    return bundle;
  }
}
