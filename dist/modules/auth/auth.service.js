"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AuthService", {
    enumerable: true,
    get: function() {
        return AuthService;
    }
});
const _common = require("@nestjs/common");
const _jwt = require("@nestjs/jwt");
const _bcryptjs = /*#__PURE__*/ _interop_require_wildcard(require("bcryptjs"));
const _prismaservice = require("../../prisma/prisma.service");
const _configservice = require("../../config/config.service");
const _xpservice = require("../gamification/xp.service");
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) return obj;
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") return {
        default: obj
    };
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) return cache.get(obj);
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) Object.defineProperty(newObj, key, desc);
            else newObj[key] = obj[key];
        }
    }
    newObj.default = obj;
    if (cache) cache.set(obj, newObj);
    return newObj;
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") {
        r = Reflect.decorate(decorators, target, key, desc);
    } else {
        for(var i = decorators.length - 1; i >= 0; i--){
            if (d = decorators[i]) {
                r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
            }
        }
    }
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") {
        return Reflect.metadata(metadataKey, metadataValue);
    }
}
let AuthService = class AuthService {
    async register(dto) {
        const existing = await this.prisma.user.findUnique({
            where: {
                email: dto.email
            }
        });
        if (existing) {
            throw new _common.ConflictException('Email already registered');
        }
        const hashedPassword = await _bcryptjs.hash(dto.password, 12);
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                name: dto.name,
                passwordHash: hashedPassword,
                profile: {
                    create: {}
                },
                settings: {
                    create: {}
                }
            },
            include: {
                profile: true,
                settings: true
            }
        });
        await this.xpService.addTransaction(user.id, 50, 'registration');
        const tokens = await this.generateTokens(user.id, user.email);
        return {
            user: this.sanitizeUser(user),
            ...tokens
        };
    }
    async login(dto) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email
            },
            include: {
                profile: true,
                settings: true
            }
        });
        if (!user || !user.passwordHash) {
            throw new _common.UnauthorizedException('Invalid credentials');
        }
        const valid = await _bcryptjs.compare(dto.password, user.passwordHash);
        if (!valid) {
            throw new _common.UnauthorizedException('Invalid credentials');
        }
        const tokens = await this.generateTokens(user.id, user.email);
        return {
            user: this.sanitizeUser(user),
            ...tokens
        };
    }
    async handleGoogleOAuth(token) {
        try {
            const { data } = await require('axios').get('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return this.findOrCreateOAuthUser(data.email, data.name, data.sub, 'google');
        } catch  {
            throw new _common.UnauthorizedException('Invalid Google token');
        }
    }
    async handleGithubOAuth(code) {
        try {
            const tokenResp = await require('axios').post('https://github.com/login/oauth/access_token', {
                client_id: this.config.githubClientId,
                client_secret: this.config.githubClientSecret,
                code
            }, {
                headers: {
                    Accept: 'application/json'
                }
            });
            const accessToken = tokenResp.data.access_token;
            const { data } = await require('axios').get('https://api.github.com/user', {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            const emailResp = await require('axios').get('https://api.github.com/user/emails', {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            const primaryEmail = emailResp.data.find((e)=>e.primary)?.email || `${data.id}@github.com`;
            return this.findOrCreateOAuthUser(primaryEmail, data.name || data.login, String(data.id), 'github');
        } catch  {
            throw new _common.UnauthorizedException('Invalid GitHub code');
        }
    }
    async refreshToken(refreshToken) {
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: this.config.jwtSecret
            });
            const user = await this.prisma.user.findUnique({
                where: {
                    id: payload.sub
                }
            });
            if (!user) throw new _common.UnauthorizedException('User not found');
            const tokens = await this.generateTokens(user.id, user.email);
            return tokens;
        } catch  {
            throw new _common.UnauthorizedException('Invalid refresh token');
        }
    }
    async logout(userId) {
        return {
            message: 'Logged out successfully'
        };
    }
    async findOrCreateOAuthUser(email, name, oauthId, provider) {
        let user = await this.prisma.user.findFirst({
            where: {
                OR: [
                    {
                        email
                    },
                    {
                        accounts: {
                            some: {
                                providerAccountId: oauthId,
                                provider
                            }
                        }
                    }
                ]
            },
            include: {
                profile: true,
                settings: true,
                accounts: true
            }
        });
        if (!user) {
            user = await this.prisma.user.create({
                data: {
                    email,
                    name: name || 'User',
                    profile: {
                        create: {}
                    },
                    settings: {
                        create: {}
                    },
                    accounts: {
                        create: {
                            provider,
                            providerAccountId: oauthId
                        }
                    }
                },
                include: {
                    profile: true,
                    settings: true
                }
            });
        } else {
            const existingAccount = user.accounts?.find((a)=>a.provider === provider && a.providerAccountId === oauthId);
            if (!existingAccount) {
                await this.prisma.account.create({
                    data: {
                        userId: user.id,
                        provider,
                        providerAccountId: oauthId
                    }
                });
            }
        }
        const tokens = await this.generateTokens(user.id, user.email);
        return {
            user: this.sanitizeUser(user),
            ...tokens
        };
    }
    async generateTokens(userId, email) {
        const payload = {
            sub: userId,
            email
        };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload),
            this.jwtService.signAsync(payload, {
                secret: this.config.jwtSecret,
                expiresIn: this.config.jwtRefreshExpiresIn
            })
        ]);
        return {
            accessToken,
            refreshToken
        };
    }
    sanitizeUser(user) {
        const { passwordHash, accounts, ...rest } = user;
        return rest;
    }
    constructor(prisma, jwtService, config, xpService){
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.config = config;
        this.xpService = xpService;
        this.logger = new _common.Logger(AuthService.name);
    }
};
AuthService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _prismaservice.PrismaService === "undefined" ? Object : _prismaservice.PrismaService,
        typeof _jwt.JwtService === "undefined" ? Object : _jwt.JwtService,
        typeof _configservice.AppConfigService === "undefined" ? Object : _configservice.AppConfigService,
        typeof _xpservice.XpService === "undefined" ? Object : _xpservice.XpService
    ])
], AuthService);

//# sourceMappingURL=auth.service.js.map