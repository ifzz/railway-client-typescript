"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var crypto = require("crypto");
var tough = require("tough-cookie");
var FileCookieStore = /** @class */ (function (_super) {
    __extends(FileCookieStore, _super);
    function FileCookieStore(filePath, option) {
        var _this = _super.call(this) || this;
        _this.idx = {}; // idx is memory cache
        _this.filePath = filePath;
        option = option || {};
        option.encrypt = !(option.encrypt === false);
        if (option.encrypt) {
            option.algorithm = option.algorithm || 'aes-256-cbc';
            option.password = option.password || 'tough-cookie-store';
        }
        var self = _this;
        _this.loadFromFile(_this.filePath, option, function (dataJson) {
            if (dataJson)
                self.idx = dataJson;
        });
        return _this;
    }
    FileCookieStore.prototype.putCookie = function (cookie, cb) {
        if (!this.idx[cookie.domain]) {
            this.idx[cookie.domain] = {};
        }
        if (!this.idx[cookie.domain][cookie.path]) {
            this.idx[cookie.domain][cookie.path] = {};
        }
        this.idx[cookie.domain][cookie.path][cookie.key] = cookie;
        this.saveToFile(this.filePath, this.idx, this.option, function () {
            cb(null);
        });
    };
    FileCookieStore.prototype.removeCookie = function (domain, path, key, cb) {
        if (this.idx[domain] && this.idx[domain][path] && this.idx[domain][path][key]) {
            delete this.idx[domain][path][key];
        }
        this.saveToFile(this.filePath, this.idx, this.option, function () {
            cb(null);
        });
    };
    FileCookieStore.prototype.removeCookies = function (domain, path, cb) {
        if (this.idx[domain]) {
            if (path) {
                delete this.idx[domain][path];
            }
            else {
                delete this.idx[domain];
            }
        }
        this.saveToFile(this.filePath, this.idx, this.option, function () {
            return cb(null);
        });
    };
    FileCookieStore.prototype.getCookie = function (domain, path, key) {
        if (!this.idx[domain]) {
            return undefined;
        }
        if (!this.idx[domain][path]) {
            return undefined;
        }
        return this.idx[domain][path][key];
    };
    FileCookieStore.prototype.flush = function () {
        this.saveToFile(this.filePath, this.idx, this.option);
    };
    ;
    FileCookieStore.prototype.isEmpty = function () {
        return this.isEmptyObject(this.idx);
    };
    FileCookieStore.prototype.isEmptyObject = function (obj) {
        for (var key in obj) {
            if (hasOwnProperty.call(obj, key)) {
                return false;
            }
        }
        return true;
    };
    FileCookieStore.prototype.saveToFile = function (filePath, data, option, cb) {
        var dataJson = JSON.stringify(data);
        if (option.encrypt) {
            var cipher = crypto.createCipher(option.algorithm, option.password);
            dataJson = cipher.update(dataJson, 'utf8', 'hex');
            dataJson += cipher.final('hex');
        }
        fs.writeFileSync(filePath, dataJson);
        if (typeof cb === 'function')
            cb();
    };
    FileCookieStore.prototype.loadFromFile = function (filePath, option, cb) {
        var data = fs.readFileSync(filePath, { encoding: 'utf8', flag: 'a+' });
        if (option.encrypt && data) {
            var decipher = crypto.createDecipher(option.algorithm, option.password);
            data = decipher.update(data, 'hex', 'utf8');
            data += decipher.final('utf8');
        }
        var dataJson = data ? JSON.parse(data) : null;
        for (var domainName in dataJson) {
            for (var pathName in dataJson[domainName]) {
                for (var cookieName in dataJson[domainName][pathName]) {
                    dataJson[domainName][pathName][cookieName] = tough.fromJSON(JSON.stringify(dataJson[domainName][pathName][cookieName]));
                }
            }
        }
        cb(dataJson);
    };
    return FileCookieStore;
}(tough.MemoryCookieStore));
exports.FileCookieStore = FileCookieStore;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9GaWxlQ29va2llU3RvcmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQ0EsdUJBQTBCO0FBQzFCLCtCQUFrQztBQUNsQyxvQ0FBdUM7QUFFdkM7SUFBcUMsbUNBQXVCO0lBSTFELHlCQUFZLFFBQWdCLEVBQUUsTUFBK0Q7UUFBN0YsWUFDRSxpQkFBTyxTQWVSO1FBYkMsS0FBSSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsQ0FBQyxzQkFBc0I7UUFDckMsS0FBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFDekIsTUFBTSxHQUFHLE1BQU0sSUFBSSxFQUFFLENBQUM7UUFDdEIsTUFBTSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sS0FBSyxLQUFLLENBQUMsQ0FBQztRQUM3QyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUNqQixNQUFNLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxTQUFTLElBQUksYUFBYSxDQUFDO1lBQ3JELE1BQU0sQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLFFBQVEsSUFBSSxvQkFBb0IsQ0FBQztRQUM5RCxDQUFDO1FBQ0QsSUFBSSxJQUFJLEdBQUcsS0FBSSxDQUFDO1FBQ2hCLEtBQUksQ0FBQyxZQUFZLENBQUMsS0FBSSxDQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUUsVUFBVSxRQUFhO1lBQzVELEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQztnQkFDVCxJQUFJLENBQUMsR0FBRyxHQUFHLFFBQVEsQ0FBQztRQUM1QixDQUFDLENBQUMsQ0FBQzs7SUFDTCxDQUFDO0lBRU0sbUNBQVMsR0FBaEIsVUFBaUIsTUFBb0IsRUFBRSxFQUFVO1FBQzdDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzNCLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUNqQyxDQUFDO1FBQ0QsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3hDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDOUMsQ0FBQztRQUNELElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDO1FBRTFELElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDbEQsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2IsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRU0sc0NBQVksR0FBbkIsVUFBb0IsTUFBTSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsRUFBRTtRQUNyQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDNUUsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3ZDLENBQUM7UUFDRCxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ2xELEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNiLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVNLHVDQUFhLEdBQXBCLFVBQXFCLE1BQU0sRUFBRSxJQUFJLEVBQUUsRUFBRTtRQUNqQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNQLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNsQyxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzVCLENBQUM7UUFDTCxDQUFDO1FBQ0QsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNsRCxNQUFNLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3BCLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVNLG1DQUFTLEdBQWhCLFVBQWlCLE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBRztRQUM5QixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BCLE1BQU0sQ0FBQyxTQUFTLENBQUM7UUFDckIsQ0FBQztRQUNELEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDMUIsTUFBTSxDQUFDLFNBQVMsQ0FBQztRQUNyQixDQUFDO1FBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQUVNLCtCQUFLLEdBQVo7UUFDSSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDMUQsQ0FBQztJQUFBLENBQUM7SUFFSyxpQ0FBTyxHQUFkO1FBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3hDLENBQUM7SUFFTyx1Q0FBYSxHQUFyQixVQUFzQixHQUFHO1FBQ3JCLEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDbEIsRUFBRSxDQUFDLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNoQyxNQUFNLENBQUMsS0FBSyxDQUFDO1lBQ2pCLENBQUM7UUFDTCxDQUFDO1FBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRU8sb0NBQVUsR0FBbEIsVUFBbUIsUUFBUSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsRUFBRTtRQUN6QyxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3BDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ2pCLElBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDcEUsUUFBUSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztZQUNsRCxRQUFRLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNwQyxDQUFDO1FBQ0QsRUFBRSxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDckMsRUFBRSxDQUFDLENBQUMsT0FBTyxFQUFFLEtBQUssVUFBVSxDQUFDO1lBQUMsRUFBRSxFQUFFLENBQUM7SUFDdkMsQ0FBQztJQUVPLHNDQUFZLEdBQXBCLFVBQXFCLFFBQWdCLEVBQUUsTUFBYyxFQUFFLEVBQVU7UUFDN0QsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsRUFBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO1FBQ3JFLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztZQUN6QixJQUFJLFFBQVEsR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3hFLElBQUksR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDNUMsSUFBSSxJQUFJLFFBQVEsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDbkMsQ0FBQztRQUNELElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1FBQzlDLEdBQUcsQ0FBQyxDQUFDLElBQUksVUFBVSxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDOUIsR0FBRyxDQUFDLENBQUMsSUFBSSxRQUFRLElBQUksUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDeEMsR0FBRyxDQUFDLENBQUMsSUFBSSxVQUFVLElBQUksUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDcEQsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM1SCxDQUFDO1lBQ0wsQ0FBQztRQUNMLENBQUM7UUFDRCxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDakIsQ0FBQztJQUNILHNCQUFDO0FBQUQsQ0FqSEEsQUFpSEMsQ0FqSG9DLEtBQUssQ0FBQyxpQkFBaUIsR0FpSDNEO0FBakhZLDBDQUFlIiwiZmlsZSI6InNyYy9GaWxlQ29va2llU3RvcmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdXRpbCA9IHJlcXVpcmUoJ3V0aWwnKTtcclxuaW1wb3J0IGZzID0gcmVxdWlyZSgnZnMnKTtcclxuaW1wb3J0IGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpO1xyXG5pbXBvcnQgdG91Z2ggPSByZXF1aXJlKCd0b3VnaC1jb29raWUnKTtcclxuXHJcbmV4cG9ydCBjbGFzcyBGaWxlQ29va2llU3RvcmUgZXh0ZW5kcyB0b3VnaC5NZW1vcnlDb29raWVTdG9yZSB7XHJcbiAgcHVibGljIGlkeDogb2JqZWN0O1xyXG4gIHB1YmxpYyBmaWxlUGF0aDogc3RyaW5nO1xyXG5cclxuICBjb25zdHJ1Y3RvcihmaWxlUGF0aDogc3RyaW5nLCBvcHRpb246IHtlbmNyeXB0OiBib29sZWFuLCBhbGdvcml0aG06IHN0cmluZywgcGFzc3dvcmQ6IHN0cmluZ30pIHtcclxuICAgIHN1cGVyKCk7XHJcblxyXG4gICAgdGhpcy5pZHggPSB7fTsgLy8gaWR4IGlzIG1lbW9yeSBjYWNoZVxyXG4gICAgdGhpcy5maWxlUGF0aCA9IGZpbGVQYXRoO1xyXG4gICAgb3B0aW9uID0gb3B0aW9uIHx8IHt9O1xyXG4gICAgb3B0aW9uLmVuY3J5cHQgPSAhKG9wdGlvbi5lbmNyeXB0ID09PSBmYWxzZSk7XHJcbiAgICBpZiAob3B0aW9uLmVuY3J5cHQpIHtcclxuICAgICAgICBvcHRpb24uYWxnb3JpdGhtID0gb3B0aW9uLmFsZ29yaXRobSB8fCAnYWVzLTI1Ni1jYmMnO1xyXG4gICAgICAgIG9wdGlvbi5wYXNzd29yZCA9IG9wdGlvbi5wYXNzd29yZCB8fCAndG91Z2gtY29va2llLXN0b3JlJztcclxuICAgIH1cclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIHRoaXMubG9hZEZyb21GaWxlKHRoaXMuZmlsZVBhdGgsIG9wdGlvbiwgZnVuY3Rpb24gKGRhdGFKc29uOiBhbnkpIHtcclxuICAgICAgICBpZiAoZGF0YUpzb24pXHJcbiAgICAgICAgICAgIHNlbGYuaWR4ID0gZGF0YUpzb247XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBwdXRDb29raWUoY29va2llOiB0b3VnaC5Db29raWUsIGNiOiBvYmplY3QpOiB2b2lkIHtcclxuICAgICAgaWYgKCF0aGlzLmlkeFtjb29raWUuZG9tYWluXSkge1xyXG4gICAgICAgICAgdGhpcy5pZHhbY29va2llLmRvbWFpbl0gPSB7fTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoIXRoaXMuaWR4W2Nvb2tpZS5kb21haW5dW2Nvb2tpZS5wYXRoXSkge1xyXG4gICAgICAgICAgdGhpcy5pZHhbY29va2llLmRvbWFpbl1bY29va2llLnBhdGhdID0ge307XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5pZHhbY29va2llLmRvbWFpbl1bY29va2llLnBhdGhdW2Nvb2tpZS5rZXldID0gY29va2llO1xyXG5cclxuICAgICAgdGhpcy5zYXZlVG9GaWxlKHRoaXMuZmlsZVBhdGgsIHRoaXMuaWR4LCB0aGlzLm9wdGlvbiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgY2IobnVsbCk7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHJlbW92ZUNvb2tpZShkb21haW4sIHBhdGgsIGtleSwgY2IpOiB2b2lkIHtcclxuICAgICAgaWYgKHRoaXMuaWR4W2RvbWFpbl0gJiYgdGhpcy5pZHhbZG9tYWluXVtwYXRoXSAmJiB0aGlzLmlkeFtkb21haW5dW3BhdGhdW2tleV0pIHtcclxuICAgICAgICAgIGRlbGV0ZSB0aGlzLmlkeFtkb21haW5dW3BhdGhdW2tleV07XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5zYXZlVG9GaWxlKHRoaXMuZmlsZVBhdGgsIHRoaXMuaWR4LCB0aGlzLm9wdGlvbiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgY2IobnVsbCk7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHJlbW92ZUNvb2tpZXMoZG9tYWluLCBwYXRoLCBjYikge1xyXG4gICAgICBpZiAodGhpcy5pZHhbZG9tYWluXSkge1xyXG4gICAgICAgICAgaWYgKHBhdGgpIHtcclxuICAgICAgICAgICAgICBkZWxldGUgdGhpcy5pZHhbZG9tYWluXVtwYXRoXTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuaWR4W2RvbWFpbl07XHJcbiAgICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5zYXZlVG9GaWxlKHRoaXMuZmlsZVBhdGgsIHRoaXMuaWR4LCB0aGlzLm9wdGlvbiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgcmV0dXJuIGNiKG51bGwpO1xyXG4gICAgICB9KTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBnZXRDb29raWUoZG9tYWluLCBwYXRoLCBrZXkpIHtcclxuICAgICAgaWYgKCF0aGlzLmlkeFtkb21haW5dKSB7XHJcbiAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICghdGhpcy5pZHhbZG9tYWluXVtwYXRoXSkge1xyXG4gICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gdGhpcy5pZHhbZG9tYWluXVtwYXRoXVtrZXldO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGZsdXNoKCkge1xyXG4gICAgICB0aGlzLnNhdmVUb0ZpbGUodGhpcy5maWxlUGF0aCwgdGhpcy5pZHgsIHRoaXMub3B0aW9uKTtcclxuICB9O1xyXG5cclxuICBwdWJsaWMgaXNFbXB0eSgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuaXNFbXB0eU9iamVjdCh0aGlzLmlkeCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGlzRW1wdHlPYmplY3Qob2JqKSB7XHJcbiAgICAgIGZvciAodmFyIGtleSBpbiBvYmopIHtcclxuICAgICAgICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkge1xyXG4gICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgc2F2ZVRvRmlsZShmaWxlUGF0aCwgZGF0YSwgb3B0aW9uLCBjYik6IHZvaWQge1xyXG4gICAgICB2YXIgZGF0YUpzb24gPSBKU09OLnN0cmluZ2lmeShkYXRhKTtcclxuICAgICAgaWYgKG9wdGlvbi5lbmNyeXB0KSB7XHJcbiAgICAgICAgICB2YXIgY2lwaGVyID0gY3J5cHRvLmNyZWF0ZUNpcGhlcihvcHRpb24uYWxnb3JpdGhtLCBvcHRpb24ucGFzc3dvcmQpO1xyXG4gICAgICAgICAgZGF0YUpzb24gPSBjaXBoZXIudXBkYXRlKGRhdGFKc29uLCAndXRmOCcsICdoZXgnKTtcclxuICAgICAgICAgIGRhdGFKc29uICs9IGNpcGhlci5maW5hbCgnaGV4Jyk7XHJcbiAgICAgIH1cclxuICAgICAgZnMud3JpdGVGaWxlU3luYyhmaWxlUGF0aCwgZGF0YUpzb24pO1xyXG4gICAgICBpZiAodHlwZW9mIGNiID09PSAnZnVuY3Rpb24nKSBjYigpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBsb2FkRnJvbUZpbGUoZmlsZVBhdGg6IHN0cmluZywgb3B0aW9uOiBvYmplY3QsIGNiOiBvYmplY3QpOiB2b2lkIHtcclxuICAgICAgdmFyIGRhdGEgPSBmcy5yZWFkRmlsZVN5bmMoZmlsZVBhdGgsIHtlbmNvZGluZzogJ3V0ZjgnLCBmbGFnOiAnYSsnfSk7XHJcbiAgICAgIGlmIChvcHRpb24uZW5jcnlwdCAmJiBkYXRhKSB7XHJcbiAgICAgICAgICB2YXIgZGVjaXBoZXIgPSBjcnlwdG8uY3JlYXRlRGVjaXBoZXIob3B0aW9uLmFsZ29yaXRobSwgb3B0aW9uLnBhc3N3b3JkKTtcclxuICAgICAgICAgIGRhdGEgPSBkZWNpcGhlci51cGRhdGUoZGF0YSwgJ2hleCcsICd1dGY4Jyk7XHJcbiAgICAgICAgICBkYXRhICs9IGRlY2lwaGVyLmZpbmFsKCd1dGY4Jyk7XHJcbiAgICAgIH1cclxuICAgICAgdmFyIGRhdGFKc29uID0gZGF0YSA/IEpTT04ucGFyc2UoZGF0YSkgOiBudWxsO1xyXG4gICAgICBmb3IgKHZhciBkb21haW5OYW1lIGluIGRhdGFKc29uKSB7XHJcbiAgICAgICAgICBmb3IgKHZhciBwYXRoTmFtZSBpbiBkYXRhSnNvbltkb21haW5OYW1lXSkge1xyXG4gICAgICAgICAgICAgIGZvciAodmFyIGNvb2tpZU5hbWUgaW4gZGF0YUpzb25bZG9tYWluTmFtZV1bcGF0aE5hbWVdKSB7XHJcbiAgICAgICAgICAgICAgICAgIGRhdGFKc29uW2RvbWFpbk5hbWVdW3BhdGhOYW1lXVtjb29raWVOYW1lXSA9IHRvdWdoLmZyb21KU09OKEpTT04uc3RyaW5naWZ5KGRhdGFKc29uW2RvbWFpbk5hbWVdW3BhdGhOYW1lXVtjb29raWVOYW1lXSkpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBjYihkYXRhSnNvbik7XHJcbiAgfVxyXG59XHJcbiJdfQ==
