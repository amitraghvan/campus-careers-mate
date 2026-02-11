
import { Test, TestingModule } from "@nestjs/testing";
import { InternalServerErrorException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { AuthService } from "./auth.service";
import { PrismaService } from "../../common/prisma/prisma.service";
import { RedisService } from "../../common/redis/redis.service";

// Mocks
const mockPrisma = {
    user: {
        findUnique: jest.fn(),
        create: jest.fn(),
    },
    refreshToken: {
        create: jest.fn(),
    },
};

const mockRedis = {
    set: jest.fn(),
};

// Mock JWT Service that might fail if secret is missing/undefined
const mockJwt = {
    sign: jest.fn((payload, options) => {
        if (!options.secret) {
            throw new Error("secretOrPrivateKey must have a value");
        }
        return "mock-access-token";
    }),
};

// Mock Config Service returning undefined for secrets
const mockConfigMissingSecret = {
    get: jest.fn((key: string) => {
        if (key === "JWT_ACCESS_SECRET") return undefined;
        if (key === "JWT_ACCESS_EXPIRY") return "15m";
        if (key === "JWT_REFRESH_EXPIRY") return "7d";
        return "";
    }),
};

describe("AuthService - Missing Env Vars", () => {
    let service: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: PrismaService, useValue: mockPrisma },
                { provide: RedisService, useValue: mockRedis },
                { provide: JwtService, useValue: mockJwt },
                { provide: ConfigService, useValue: mockConfigMissingSecret },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
    });

    it("should throw InternalServerErrorException when JWT secret is missing", async () => {
        const dto = {
            name: "Test User",
            email: "test@example.com",
            password: "password123",
        };

        mockPrisma.user.findUnique.mockResolvedValue(null);
        mockPrisma.user.create.mockResolvedValue({
            id: "user-1",
            name: "Test User",
            email: "test@example.com",
            role: "STUDENT",
            college: null,
            avatarUrl: null,
        });

        // We expect the service to catch the error from jwt.sign and throw InternalServerErrorException
        await expect(service.signUp(dto)).rejects.toThrow(InternalServerErrorException);
    });
});
