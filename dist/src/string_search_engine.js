"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dataset_json_1 = __importDefault(require("./dataset.json"));
var searchTerm = "Human Analyst";
var sortField = "name";
var pageNumber = 1;
var pageSze = 20;
var SEARCH_PARAM;
(function (SEARCH_PARAM) {
    SEARCH_PARAM["NAME"] = "name";
    SEARCH_PARAM["IMAGE"] = "image";
    SEARCH_PARAM["DESCRIPTION"] = "description";
})(SEARCH_PARAM || (SEARCH_PARAM = {}));
var SORT_PARAM;
(function (SORT_PARAM) {
    SORT_PARAM["NAME"] = "name";
    SORT_PARAM["DATELASTEDITED"] = "dateLastEdited";
})(SORT_PARAM || (SORT_PARAM = {}));
var StringDatastore = /** @class */ (function () {
    function StringDatastore(dataset, search_param) {
        this.hashMap = {};
        this.data = [];
        this.data = this.parseJson();
        this.loadData(dataset, search_param);
    }
    StringDatastore.prototype.loadData = function (dataset, searchParams) {
        var _this = this;
        try {
            var index_1 = 0;
            dataset.forEach(function (obj) {
                searchParams.forEach(function (eachParam) {
                    var sanitizedString = obj[eachParam].replace(/\s+/g, " ").trim();
                    var text = sanitizedString.split(" ");
                    text.forEach(function (t) {
                        t = t.replace(/[&\/\\#, +()$~%.'":*?<>{}]/g, "");
                        _this.setValue(t, index_1);
                    });
                });
                index_1++;
            });
        }
        catch (error) { }
    };
    StringDatastore.prototype.parseJson = function () {
        var arr = [];
        dataset_json_1.default.map(function (item) {
            var data = {
                name: item.name,
                image: item.image,
                description: item.description,
                dateLastEdited: new Date(item.dateLastEdited),
            };
            arr.push(data);
        });
        return arr;
    };
    StringDatastore.prototype.setValue = function (key, id) {
        var _a;
        var _b;
        try {
            key = key.toLowerCase();
            (_a = (_b = this.hashMap)[key]) !== null && _a !== void 0 ? _a : (_b[key] = []);
            if (this.hashMap[key][this.hashMap[key].length - 1] !== id) {
                this.hashMap[key].push(id);
            }
        }
        catch (error) {
            // Handle Error
        }
    };
    StringDatastore.prototype.getValue = function (key) {
        try {
            return this.hashMap[key];
        }
        catch (error) {
            // Handle Errors
        }
    };
    return StringDatastore;
}());
var StringSearchEngine = /** @class */ (function (_super) {
    __extends(StringSearchEngine, _super);
    function StringSearchEngine(dataset, search_param) {
        return _super.call(this, dataset, search_param) || this;
    }
    StringSearchEngine.prototype.search = function (key) {
        var _this = this;
        try {
            var sanitized_string = key.replace(/\s+/g, " ").trim();
            var text = sanitized_string.split(" ");
            var result = [];
            var isExactMatch = key.startsWith('"') && key.endsWith('"');
            console.log(key);
            var count = 0;
            for (var _i = 0, _a = text; _i < _a.length; _i++) {
                var t = _a[_i];
                t = t.replace(/[&\/\\#, +()$~%.'":*?<>{}]/g, "");
                t = t.toLowerCase();
                if (count == 0 && this.getValue(t) != undefined)
                    result = this.getValue(t);
                {
                    count++;
                }
                result = this.intersection(result, this.getValue(t));
            }
            if (isExactMatch)
                result = this.exactSearch(key.toLowerCase().trim(), result);
            var post = result.map(function (item) {
                return _this.data[item];
            });
            if (sanitized_string == "") {
                post = this.data;
            }
            return this.sort(post, pageNumber, pageSze, sortField);
        }
        catch (error) { }
    };
    StringSearchEngine.prototype.exactSearch = function (key, arr) {
        try {
            var result = [];
            key = key.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, "");
            for (var _i = 0, _a = arr || []; _i < _a.length; _i++) {
                var item = _a[_i];
                for (var _b = 0, _c = Object.values(SEARCH_PARAM); _b < _c.length; _b++) {
                    var param = _c[_b];
                    var text = this.data[item][param];
                    if (text.toLowerCase().includes(key)) {
                        result.push(item);
                    }
                }
            }
            return result;
        }
        catch (err) {
            // Handle error
        }
    };
    StringSearchEngine.prototype.intersection = function (arr1, arr2) {
        try {
            var i = 0;
            var j = 0;
            var intersectionArray = [];
            while (i < arr1.length && j < arr2.length) {
                if (i > 0 && arr1[i] === arr1[i - 1]) {
                    i++;
                    continue;
                }
                if (arr1[i] < arr2[j]) {
                    i++;
                }
                else if (arr2[j] < arr1[i]) {
                    j++;
                }
                else {
                    intersectionArray.push(arr2[j]);
                    i++;
                    j++;
                }
            }
            return intersectionArray;
        }
        catch (error) {
            // Handle Errors
        }
    };
    StringSearchEngine.prototype.sort = function (filteredPosts, pageNumber, pageSize, sortField) {
        try {
            var sortedPosts = filteredPosts.sort(function (a, b) {
                switch (sortField) {
                    case SORT_PARAM.NAME:
                        return a.name.localeCompare(b.name);
                        break;
                    case SORT_PARAM.DATELASTEDITED:
                        return b.dateLastEdited.getTime() - a.dateLastEdited.getTime();
                        break;
                    default:
                        return 0;
                }
            });
            var paginatedPosts = this.paginateArray(sortedPosts, pageSize, pageNumber);
            return paginatedPosts;
        }
        catch (error) {
            // Handle Errors
        }
    };
    StringSearchEngine.prototype.paginateArray = function (array, pageSize, currentPage) {
        var totalItems = array.length;
        var totalPages = Math.ceil(totalItems / pageSize);
        var startIndex = (currentPage - 1) * pageSize;
        var endIndex = startIndex + pageSize;
        var paginatedData = array.slice(startIndex, endIndex);
        return {
            data: paginatedData,
            currentPage: currentPage,
            totalPages: totalPages,
        };
    };
    return StringSearchEngine;
}(StringDatastore));
function parseJson() {
    var arr = [];
    dataset_json_1.default.map(function (item) {
        var data = {
            name: item.name,
            image: item.image,
            description: item.description,
            dateLastEdited: new Date(item.dateLastEdited),
        };
        arr.push(data);
    });
    return arr;
}
var new_engine = new StringSearchEngine(parseJson(), [
    SEARCH_PARAM.NAME,
    SEARCH_PARAM.DESCRIPTION,
    SEARCH_PARAM.IMAGE,
]);
var arr = new_engine.search(searchTerm);
console.log(arr);
console.log("Total count: ".concat(arr.data.length));
