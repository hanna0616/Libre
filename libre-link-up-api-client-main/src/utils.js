"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapData = exports.trendMap = void 0;
exports.trendMap = [
  "NotComputable",
  "SingleDown",
  "FortyFiveDown",
  "Flat",
  "FortyFiveUp",
  "SingleUp",
  "NotComputable",
];
var getTrend = function (trend, defaultTrend) {
  if (defaultTrend === void 0) {
    defaultTrend = "Flat";
  }
  return trend && exports.trendMap[trend]
    ? exports.trendMap[trend]
    : defaultTrend;
};
var toDate = function (dateString) {
  return new Date(dateString);
};
var mapData = function (_a) {
  if (!_a) {
    return "no value available";
  } else {
    var Value = _a.Value,
      isHigh = _a.isHigh,
      isLow = _a.isLow,
      TrendArrow = _a.TrendArrow,
      FactoryTimestamp = _a.FactoryTimestamp;
  }

  return {
    value: Value,
    isHigh: isHigh,
    isLow: isLow,
    trend: getTrend(TrendArrow),
    date: toDate("".concat(FactoryTimestamp, " UTC")),
  };
};
exports.mapData = mapData;
