"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LibreLinkUpClient = void 0;
var axios_1 = require("axios");
var utils_1 = require("./utils");
var LIBRE_LINK_SERVER = 'https://api-us.libreview.io';
var urlMap = {
    login: '/llu/auth/login',
    connections: '/llu/connections',
    countries: '/llu/config/country?country=DE',
};
var LibreLinkUpClient = function (_a) {
    var username = _a.username, password = _a.password, connectionIdentifier = _a.connectionIdentifier;
    var jwtToken = null;
    var connectionId = null;
    var instance = axios_1.default.create({
        baseURL: LIBRE_LINK_SERVER,
        headers: {
            'accept-encoding': 'gzip',
            'cache-control': 'no-cache',
            connection: 'Keep-Alive',
            'content-type': 'application/json',
            product: 'llu.android',
            version: '4.7.0',
        },
    });
    instance.interceptors.request.use(function (config) {
        if (jwtToken && config.headers) {
            // eslint-disable-next-line no-param-reassign
            config.headers.authorization = "Bearer ".concat(jwtToken);
        }
        return config;
    }, function (e) { return e; }, { synchronous: true });
    var login = function () { return __awaiter(void 0, void 0, void 0, function () {
        var loginResponse, redirectResponse, countryNodes, targetRegion, regionDefinition;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, instance.post(urlMap.login, {
                        email: username,
                        password: password,
                    })];
                case 1:
                    loginResponse = _a.sent();
                    if (loginResponse.data.status === 2)
                        throw new Error('Bad credentials. Please ensure that you have entered the credentials of your LibreLinkUp account (and not of your LibreLink account).');
                    if (!loginResponse.data.data.redirect) return [3 /*break*/, 3];
                    redirectResponse = loginResponse.data;
                    return [4 /*yield*/, instance.get(urlMap.countries)];
                case 2:
                    countryNodes = _a.sent();
                    targetRegion = redirectResponse.data.region;
                    regionDefinition = countryNodes.data.data.regionalMap[targetRegion];
                    if (!regionDefinition) {
                        throw new Error("Unable to find region '".concat(redirectResponse.data.region, "'. \n          Available nodes are ").concat(Object.keys(countryNodes.data.data.regionalMap).join(', '), "."));
                    }
                    instance.defaults.baseURL = regionDefinition.lslApi;
                    return [2 /*return*/, login()];
                case 3:
                    jwtToken = loginResponse.data.data.authTicket.token;
                    return [2 /*return*/, loginResponse.data];
            }
        });
    }); };
    var loginWrapper = function (func) {
        return function () { return __awaiter(void 0, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 5]);
                        if (!!jwtToken) return [3 /*break*/, 2];
                        return [4 /*yield*/, login()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/, func()];
                    case 3:
                        e_1 = _a.sent();
                        return [4 /*yield*/, login()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, func()];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
    };
    var getConnections = loginWrapper(function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, instance.get(urlMap.connections)];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, response.data];
            }
        });
    }); });
    var getConnection = function (connections) {
        if (typeof connectionIdentifier === 'string') {
            var match = connections.find(function (_a) {
                var firstName = _a.firstName, lastName = _a.lastName;
                return "".concat(firstName, " ").concat(lastName).toLowerCase() ===
                    connectionIdentifier.toLowerCase();
            });
            if (!match) {
                throw new Error("Unable to identify connection by given name '".concat(connectionIdentifier, "'."));
            }
            return match.patientId;
        }
        if (typeof connectionIdentifier === 'function') {
            var match = connectionIdentifier.call(null, connections);
            if (!match) {
                throw new Error("Unable to identify connection by given name function");
            }
            return match;
        }
        return connections[0].patientId;
    };
    var readRaw = loginWrapper(function () { return __awaiter(void 0, void 0, void 0, function () {
        var connections, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!!connectionId) return [3 /*break*/, 2];
                    return [4 /*yield*/, getConnections()];
                case 1:
                    connections = _a.sent();
                    connectionId = getConnection(connections.data);
                    _a.label = 2;
                case 2: return [4 /*yield*/, instance.get("".concat(urlMap.connections, "/").concat(connectionId, "/graph"))];
                case 3:
                    response = _a.sent();
                    return [2 /*return*/, response.data.data];
            }
        });
    }); });
    var read = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, readRaw()];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, {
                            current: (0, utils_1.mapData)(response.connection.glucoseMeasurement),
                            history: response.graphData.map(utils_1.mapData),
                        }];
            }
        });
    }); };
    var observe = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/];
        });
    }); };
    var averageInterval;
    var readAveraged = function (amount, callback, interval) {
        if (interval === void 0) { interval = 15000; }
        return __awaiter(void 0, void 0, void 0, function () {
            var mem;
            return __generator(this, function (_a) {
                mem = new Map();
                averageInterval = setInterval(function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, current, history, memValues, averageValue, averageTrend;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, read()];
                            case 1:
                                _a = _b.sent(), current = _a.current, history = _a.history;
                                mem.set(current.date.toString(), current);
                                if (mem.size === amount) {
                                    memValues = Array.from(mem.values());
                                    averageValue = Math.round(memValues.reduce(function (acc, cur) { return acc + cur.value; }, 0) / amount);
                                    averageTrend = utils_1.trendMap[parseInt((Math.round((memValues.reduce(function (acc, cur) { return acc + utils_1.trendMap.indexOf(cur.trend); }, 0) /
                                        amount) *
                                        100) / 100).toFixed(0), 10)];
                                    mem = new Map();
                                    callback.apply(null, [
                                        {
                                            trend: averageTrend,
                                            value: averageValue,
                                            date: current.date,
                                            isHigh: current.isHigh,
                                            isLow: current.isLow,
                                        },
                                        memValues,
                                        history,
                                    ]);
                                }
                                return [2 /*return*/];
                        }
                    });
                }); }, interval);
                return [2 /*return*/, function () { return clearInterval(averageInterval); }];
            });
        });
    };
    return {
        observe: observe,
        readRaw: readRaw,
        read: read,
        readAveraged: readAveraged,
        login: login,
    };
};
exports.LibreLinkUpClient = LibreLinkUpClient;
