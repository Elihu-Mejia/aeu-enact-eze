import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { OcmService } from '../src/ocm/ocm.service';
import { TarantoolService } from '../src/tarantool/tarantool.service';

// Mock bullmq to prevent Redis connection attempts
jest.mock('bullmq', () => ({
  Queue: jest.fn().mockImplementation(() => ({
    add: jest.fn(),
    close: jest.fn(),
    on: jest.fn(),
    waitUntilReady: jest.fn().mockResolvedValue(true),
  })),
  Worker: jest.fn().mockImplementation(() => ({
    on: jest.fn(),
    close: jest.fn(),
    run: jest.fn(),
    waitUntilReady: jest.fn().mockResolvedValue(true),
  })),
  QueueEvents: jest.fn().mockImplementation(() => ({
    on: jest.fn(),
    close: jest.fn(),
    waitUntilReady: jest.fn().mockResolvedValue(true),
  })),
}));

describe('AEU Enact Eze (e2e)', () => {
  let app: INestApplication;

  const mockOcmService = {
    findAll: jest.fn().mockResolvedValue([
      {
        ID: 1,
        Title: 'AEU Orbital Elevator Station',
        AddressInfo: { Title: 'Paris, Sector 7' },
        Connections: [],
      },
    ]),
    findOne: jest.fn().mockResolvedValue({
      ID: 1,
      Title: 'AEU Orbital Elevator Station',
    }),
    spawnFetchJob: jest.fn().mockResolvedValue(true),
  };

  const mockTarantoolService = {
    saveStationData: jest.fn().mockResolvedValue(true),
    onModuleInit: jest.fn(),
    onModuleDestroy: jest.fn(),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(OcmService)
      .useValue(mockOcmService)
      .overrideProvider(TarantoolService)
      .useValue(mockTarantoolService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect({ status: 'ok' });
  });

  // this fails and don't know why!!!! aaaaaaaaaaaaaa!!!!!!!!
  it('GraphQL: stations query', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          query {
            stations(latitude: 48.8566, longitude: 2.3522) {
              ID
              Title
            }
          }
        `,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.stations).toEqual([
          { ID: 1, Title: 'AEU Orbital Elevator Station' },
        ]);
      });
  });
});