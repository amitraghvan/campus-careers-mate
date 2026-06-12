/**
 * Auth Service — Unit Tests
 */

import { Test, TestingModule } from "@nestjs/testing";
import { ConflictException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { AuthService } from "./auth.service";
import { PrismaService } from "../../common/prisma/prisma.service";
import { RedisService } from "../../common/redis/redis.service";
import { PasswordSecurityService } from "./password-security.service";
import * as bcrypt from "bcrypt";

// Mocks
const mockPasswordSecurity = {
  isPasswordPwned: jest.fn().mockResolvedValue(false),
};
const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  refreshToken: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
    deleteMany: jest.fn(),
  },
};

const mockRedis = {
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
  delByPattern: jest.fn(),
};

const mockJwt = {
  sign: jest.fn().mockReturnValue("mock-access-token"),
};

const mockConfig = {
  get: jest.fn((key: string) => {
    const map: Record<string, string> = {
      JWT_ACCESS_SECRET: "test-secret",
      JWT_ACCESS_EXPIRY: "15m",
      JWT_REFRESH_EXPIRY: "7d",
    };
    return map[key] || "";
  }),
};

describe("AuthService", () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: RedisService, useValue: mockRedis },
        { provide: JwtService, useValue: mockJwt },
        { provide: ConfigService, useValue: mockConfig },
        { provide: PasswordSecurityService, useValue: mockPasswordSecurity },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  describe("signUp", () => {
    it("should create a new user and return tokens", async () => {
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
      mockPrisma.refreshToken.create.mockResolvedValue({});

      const result = await service.signUp(dto);

      expect(result.user.email).toBe("test@example.com");
      expect(result.tokens.accessToken).toBeDefined();
      expect(result.tokens.refreshToken).toBeDefined();
      expect(mockPrisma.user.create).toHaveBeenCalledTimes(1);
    });

    it("should throw ConflictException for duplicate email", async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: "existing" });

      await expect(
        service.signUp({
          name: "Test",
          email: "exists@example.com",
          password: "password123",
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe("signIn", () => {
    it("should authenticate and return tokens", async () => {
      const passwordHash = await bcrypt.hash("password123", 10);
      mockPrisma.user.findUnique.mockResolvedValue({
        id: "user-1",
        name: "Test User",
        email: "test@example.com",
        role: "STUDENT",
        college: null,
        avatarUrl: null,
        passwordHash,
        isActive: true,
      });
      mockPrisma.user.update.mockResolvedValue({});
      mockPrisma.refreshToken.create.mockResolvedValue({});

      const result = await service.signIn({
        email: "test@example.com",
        password: "password123",
      });

      expect(result.user.email).toBe("test@example.com");
      expect(result.tokens).toBeDefined();
    });

    it("should reject invalid password", async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: "user-1",
        email: "test@example.com",
        passwordHash: await bcrypt.hash("correct-password", 10),
        isActive: true,
      });

      await expect(
        service.signIn({
          email: "test@example.com",
          password: "wrong-password",
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it("should reject inactive accounts", async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: "user-1",
        email: "test@example.com",
        passwordHash: await bcrypt.hash("password123", 10),
        isActive: false,
      });

      await expect(
        service.signIn({
          email: "test@example.com",
          password: "password123",
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe("signOut", () => {
    it("should revoke all tokens when no specific token provided", async () => {
      mockPrisma.refreshToken.updateMany.mockResolvedValue({ count: 3 });

      await service.signOut("user-1");

      expect(mockPrisma.refreshToken.updateMany).toHaveBeenCalledWith({
        where: { userId: "user-1", revokedAt: null },
        data: { revokedAt: expect.any(Date) },
      });
    });
  });
});

