module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 14);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _querystring = __webpack_require__(3);

var _querystring2 = _interopRequireDefault(_querystring);

var _request = __webpack_require__(6);

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 获取直播间真实ID
function getRoomId(roomURL) {
  return _request2.default.get('http://live.bilibili.com/' + roomURL).then(function (res) {
    var room = { url: roomURL };
    var data = res;
    var reg = data.match(/ROOMID \= (.*?)\;/);
    if (reg && reg.length >= 2) room.id = reg[1];else room.id = roomURL;
    reg = data.match(/DANMU_RND \= (.*?)\;/);
    if (reg && reg.length >= 2) room.rnd = reg[1];else room.rnd = '';
    return room;
  });
}

// 直播间信息
function getRoomInfo(roomId) {
  return _request2.default.get('http://live.bilibili.com/live/getInfo', {
    params: {
      roomid: roomId
    }
  }).then(function (res) {
    var data = JSON.parse(res).data;
    var room = {};
    room.title = data['ROOMTITLE'];
    room.areaId = data['AREAID'];
    room.cover = data['COVER'];
    room.anchor = {
      id: data['MASTERID'],
      name: data['ANCHOR_NICK_NAME']
    };
    room.fans = data['FANS_COUNT'];
    room.isLive = !!(data['_status'] == 'on');
    return room;
  });
}

// 获取房间弹幕
function getRoomMessage(roomId) {
  return _request2.default.post('http://api.live.bilibili.com/ajax/msg', {
    body: _querystring2.default.stringify({
      roomid: roomId
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}

// 获取直播间房管列表
function getRoomAdmin(roomId) {
  return _request2.default.post('http://api.live.bilibili.com/liveact/ajaxGetAdminList', {
    body: _querystring2.default.stringify({
      roomid: roomId
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }).then(function (res) {
    var data = JSON.parse(res).data;
    return data.map(function (admin) {
      return {
        id: admin.id,
        ctime: admin.ctime,
        admin: {
          id: admin.userinfo.uid,
          name: admin.userinfo.uname
        }
      };
    });
  });
}

// 获取房间被禁言用户列表
function getRoomBlockList(cookie, roomId, page) {
  return _request2.default.post('http://api.live.bilibili.com/liveact/ajaxGetBlockList', {
    body: _querystring2.default.stringify({
      roomid: roomId,
      page: page
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': cookie
    }
  }).then(function (res) {
    var data = JSON.parse(res).data;
    return data.map(function (item) {
      return {
        id: item.id,
        user: {
          id: item.uid,
          name: item.uname
        },
        admin: {
          id: item.adminid,
          name: item.admin_uname
        },
        createTime: item.ctime,
        blockEndTime: item.block_end_time
      };
    });
  });
}

// 获取弹幕池地址
function getRoomChatServer(roomId) {
  return _request2.default.get('http://live.bilibili.com/api/player', {
    params: {
      id: 'cid:' + roomId
    }
  }).then(function (res) {
    var data = res;
    var reg = data.match(/<server>(.*?)<\/server>/);
    if (reg && reg.length >= 2) return reg[1];else return 'livecmt-1.bilibili.com';
  });
}

// 获取直播流地址
function getRoomLivePlaylist(roomId) {
  return _request2.default.get('http://api.live.bilibili.com/api/playurl', {
    params: {
      platform: 'h5',
      cid: roomId
    }
  }).then(function (res) {
    var data = JSON.parse(res);
    return data.data;
  });
}

// 获取用户粉丝信息
function getUserFans(uid, page) {
  return _request2.default.get('http://space.bilibili.com/ajax/friend/GetFansList', {
    params: {
      mid: uid,
      page: page,
      _: new Date().getTime()
    }
  }).then(function (res) {
    var data = JSON.parse(res);
    return {
      fans: data.data.list.map(function (fan) {
        return {
          id: fan.fid,
          name: fan.uname
        };
      }),
      total: data.data.results
    };
  });
}

// 检查cookie是否过期
function checkUserLogin(cookie) {
  return _request2.default.get('http://live.bilibili.com/user/getuserinfo', {
    headers: {
      'Cookie': cookie
    }
  }).then(function (res) {
    var data = JSON.parse(res);
    if (data.code == 'REPONSE_OK') {
      return {
        login: true
      };
    }
    return {
      login: false
    };
  });
}

// 获取用户直播信息
function getUserLiveInfo(cookie) {
  return _request2.default.get('http://api.live.bilibili.com/i/api/liveinfo', {
    headers: {
      'Cookie': cookie
    }
  }).then(function (res) {
    var data = JSON.parse(res).data;
    return {
      room: {
        id: data.roomid,
        level: data.master.level,
        current: data.master.current,
        next: data.master.next,
        san: data.san,
        liveTime: data.liveTime
      },
      user: {
        id: data.userInfo.uid,
        name: data.userInfo.uname,
        avatar: data.userInfo.face,
        archives: data.achieves,
        gold: data.userCoinIfo.gold,
        silver: data.userCoinIfo.silver,
        coins: data.userCoinIfo.coins,
        bcoins: data.userCoinIfo.bili_coins,
        vip: !!data.userCoinIfo.vip,
        svip: !!data.userCoinIfo.svip,
        level: data.userCoinIfo.user_level,
        levelRank: data.userCoinIfo.user_level_rank,
        current: data.userCoinIfo.user_intimacy,
        next: data.userCoinIfo.user_next_intimacy
      }
    };
  });
}

// 更改直播间状态
function toggleLiveRoom(cookie, status, roomId) {
  return _request2.default.post('http://api.live.bilibili.com/liveact/live_status_mng', {
    body: _querystring2.default.stringify({
      status: status,
      roomid: roomId
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': cookie
    }
  });
}

// 获取直播推流码
function getLiveRoomRTMP(cookie, roomId) {
  return _request2.default.post('http://api.live.bilibili.com/liveact/getrtmp', {
    body: _querystring2.default.stringify({
      roomid: roomId
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': cookie
    }
  }).then(function (res) {
    var data = JSON.parse(res);
    if (data.code < 0) return false;
    data = data.data;
    return {
      address: data.addr,
      code: data.code
    };
  });
}

// 发送弹幕
function sendMessage(cookie, data) {
  return _request2.default.post('http://live.bilibili.com/msg/send', {
    body: _querystring2.default.stringify(data),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': cookie
    }
  });
}

// 禁言用户
function blockUser(cookie, data) {
  return _request2.default.post('http://api.live.bilibili.com/liveact/room_block_user', {
    body: _querystring2.default.stringify(data),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': cookie
    }
  });
}

// 取消禁言
function deleteBlockUser(cookie, data) {
  return _request2.default.post('http://api.live.bilibili.com/liveact/del_room_block_user', {
    body: _querystring2.default.stringify(data),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': cookie
    }
  });
}

// 管理房管
function setAdmin(cookie, data) {
  return _request2.default.post('http://api.live.bilibili.com/liveact/admin', {
    body: _querystring2.default.stringify(data),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': cookie
    }
  });
}

// 发送在线心跳
function sendHeartbeat(cookie, room) {
  return _request2.default.post('http://api.live.bilibili.com/User/userOnlineHeart', {
    headers: {
      'Content-Type': 'text/html; charset=UTF-8',
      'Cookie': cookie,
      'Host': 'api.live.bilibili.com',
      'Origin': 'http://live.bilibili.com',
      'Referer': 'http://live.bilibili.com/' + room,
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
    }
  });
}

// 参与小电视抽奖
function joinSmallTV(cookie, data) {
  return _request2.default.get('http://api.live.bilibili.com/SmallTV/join', {
    params: data,
    headers: {
      'Cookie': cookie
    }
  }).then(function (res) {
    var data = JSON.parse(res);
    return data;
  });
}

// 查看小电视抽奖奖励
function getSmallTVReward(cookie, data) {
  return _request2.default.get('http://api.live.bilibili.com/SmallTV/getReward', {
    params: data,
    headers: {
      'Cookie': cookie
    }
  }).then(function (res) {
    var data = JSON.parse(res);
    return data;
  });
}

exports.default = {
  getRoomId: getRoomId,
  getRoomInfo: getRoomInfo,
  getRoomMessage: getRoomMessage,
  getRoomAdmin: getRoomAdmin,
  getRoomBlockList: getRoomBlockList,
  getRoomChatServer: getRoomChatServer,
  getRoomLivePlaylist: getRoomLivePlaylist,
  checkUserLogin: checkUserLogin,
  getUserLiveInfo: getUserLiveInfo,
  getUserFans: getUserFans,
  toggleLiveRoom: toggleLiveRoom,
  getLiveRoomRTMP: getLiveRoomRTMP,
  sendMessage: sendMessage,
  blockUser: blockUser,
  deleteBlockUser: deleteBlockUser,
  setAdmin: setAdmin,
  sendHeartbeat: sendHeartbeat,
  joinSmallTV: joinSmallTV,
  getSmallTVReward: getSmallTVReward
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var WS_OP_HEARTBEAT = 2;
var WS_OP_HEARTBEAT_REPLY = 3;
var WS_OP_MESSAGE = 5;
var WS_OP_USER_AUTHENTICATION = 7;
var WS_OP_CONNECT_SUCCESS = 8;
var GIFT_SYS_GIFT = 0;
var GIFT_SYS_LUCKY_MONEY = 1;
var GIFT_SYS_TV = 2;
var GIFT_SYS_ANNOUNCEMENT = 3;
var GIFT_SYS_GUARD = 4;
var GIFT_SYS_ACTIVITY_RED_PACKET = 6;
var WS_PACKAGE_OFFSET = 0;
var WS_HEADER_OFFSET = 4;
var WS_VERSION_OFFSET = 6;
var WS_OPERATION_OFFSET = 8;
var WS_SEQUENCE_OFFSET = 12;
var WS_PACKAGE_HEADER_TOTAL_LENGTH = 16;
var WS_HEADER_DEFAULT_VERSION = 1;
var WS_HEADER_DEFAULT_OPERATION = 1;
var WS_HEADER_DEFAULT_SEQUENCE = 1;

exports.default = {
    version: 1,
    magic: 16,
    magicParam: 1,
    headerLength: 16,
    actions: {
        heartbeat: 2,
        joinChannel: 7
    },
    WS_OP_HEARTBEAT: WS_OP_HEARTBEAT,
    WS_OP_HEARTBEAT_REPLY: WS_OP_HEARTBEAT_REPLY,
    WS_OP_MESSAGE: WS_OP_MESSAGE,
    WS_OP_USER_AUTHENTICATION: WS_OP_USER_AUTHENTICATION,
    WS_OP_CONNECT_SUCCESS: WS_OP_CONNECT_SUCCESS,
    WS_PACKAGE_OFFSET: WS_PACKAGE_OFFSET,
    WS_HEADER_OFFSET: WS_HEADER_OFFSET,
    WS_VERSION_OFFSET: WS_VERSION_OFFSET,
    WS_OPERATION_OFFSET: WS_OPERATION_OFFSET,
    WS_SEQUENCE_OFFSET: WS_SEQUENCE_OFFSET,
    WS_PACKAGE_HEADER_TOTAL_LENGTH: WS_PACKAGE_HEADER_TOTAL_LENGTH,
    WS_HEADER_DEFAULT_VERSION: WS_HEADER_DEFAULT_VERSION,
    WS_HEADER_DEFAULT_OPERATION: WS_HEADER_DEFAULT_OPERATION,
    WS_HEADER_DEFAULT_SEQUENCE: WS_HEADER_DEFAULT_SEQUENCE,
    dataStruct: [{
        name: "Header Length",
        key: "headerLen",
        bytes: 2,
        offset: WS_HEADER_OFFSET,
        value: WS_PACKAGE_HEADER_TOTAL_LENGTH
    }, {
        name: "Protocol Version",
        key: "ver",
        bytes: 2,
        offset: WS_VERSION_OFFSET,
        value: WS_HEADER_DEFAULT_VERSION
    }, {
        name: "Operation",
        key: "op",
        bytes: 4,
        offset: WS_OPERATION_OFFSET,
        value: WS_HEADER_DEFAULT_OPERATION
    }, {
        name: "Sequence Id",
        key: "seq",
        bytes: 4,
        offset: WS_SEQUENCE_OFFSET,
        value: WS_HEADER_DEFAULT_SEQUENCE
    }]
};

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("events");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("querystring");

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ws = __webpack_require__(13);

var _ws2 = _interopRequireDefault(_ws);

var _events = __webpack_require__(2);

var _events2 = _interopRequireDefault(_events);

var _lodash = __webpack_require__(10);

var _lodash2 = _interopRequireDefault(_lodash);

var _decoder = __webpack_require__(7);

var _decoder2 = _interopRequireDefault(_decoder);

var _encoder = __webpack_require__(8);

var _encoder2 = _interopRequireDefault(_encoder);

var _util = __webpack_require__(0);

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DMPROTOCOL = 'ws';
var DMSERVER = 'broadcastlv.chat.bilibili.com';
var DMPORT = 2244;
var DMPATH = 'sub';

var RECONNECT_DELAY = 3000;
var HEARTBEAT_DELAY = 30000;
var GIFT_END_DELAY = 3000;
var FETCH_FANS_DELAY = 5000;

var RoomService = function (_EventEmitter) {
  _inherits(RoomService, _EventEmitter);

  function RoomService() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, RoomService);

    var _this = _possibleConstructorReturn(this, (RoomService.__proto__ || Object.getPrototypeOf(RoomService)).call(this));

    _this.info = {
      id: config.roomId,
      url: config.roomId
    };
    _this.userId = config.userId || _this.randUid();
    _this.socket = null;

    _this.heartbeatService = null;
    _this.fansService = null;
    _this.reconnectService = null;

    _this.giftMap = new Map();
    _this.fansSet = new Set();
    return _this;
  }

  _createClass(RoomService, [{
    key: 'getInfo',
    value: function getInfo() {
      return this.info;
    }
  }, {
    key: 'getAdmin',
    value: function getAdmin() {
      return _util2.default.getRoomAdmin(this.info.id);
    }
  }, {
    key: 'init',
    value: function init() {
      var _this2 = this;

      return _util2.default.getRoomId(this.info.url).then(function (room) {
        _this2.info.id = room.id;
        return _util2.default.getRoomInfo(_this2.info.id);
      }).then(function (room) {
        _this2.info.title = room.title;
        _this2.info.anchor = room.anchor;
        _this2.connect();
        return _this2;
      });
    }
  }, {
    key: 'randUid',
    value: function randUid() {
      return 1E15 + Math.floor(2E15 * Math.random());
    }
  }, {
    key: 'connect',
    value: function connect() {
      this.socket = new _ws2.default(DMPROTOCOL + '://' + DMSERVER + ':' + DMPORT + '/' + DMPATH);
      this.handleEvents();
      this.fetchFans();
    }
  }, {
    key: 'disconnect',
    value: function disconnect() {
      clearTimeout(this.reconnectService);
      clearTimeout(this.heartbeatService);
      clearTimeout(this.fansService);
      this.socket.terminate();
    }
  }, {
    key: 'reconnect',
    value: function reconnect() {
      var _this3 = this;

      this.disconnect();
      this.reconnectService = setTimeout(function () {
        _this3.connect();
      }, RECONNECT_DELAY);
    }
  }, {
    key: 'handleEvents',
    value: function handleEvents() {
      var _this4 = this;

      this.socket.on('open', function () {
        _this4.sendJoinRoom();
        _this4.emit('connect');
      });

      this.socket.on('message', function (msg) {
        _decoder2.default.decodeData(msg).map(function (m) {
          if (m.type == 'connected') {
            _this4.sendHeartbeat();
          } else {
            if (m.type === 'gift') {
              _this4.packageGift(m);
            }
            _this4.emit('data', m);
          }
          _this4.emit(m.type, m);
        });
      });

      this.socket.on('close', function (code, reason) {
        _this4.emit('close', code, reason);
        _this4.reconnect();
      });

      this.socket.on('error', function (err) {
        _this4.emit('error', err);
        _this4.reconnect();
      });
    }
  }, {
    key: 'sendJoinRoom',
    value: function sendJoinRoom() {
      this.socket.send(_encoder2.default.encodeJoinRoom(this.info.id, this.userId));
    }
  }, {
    key: 'sendHeartbeat',
    value: function sendHeartbeat() {
      var _this5 = this;

      this.socket.send(_encoder2.default.encodeHeartbeat());
      this.heartbeatService = setTimeout(function () {
        _this5.sendHeartbeat();
      }, HEARTBEAT_DELAY);
    }
  }, {
    key: 'fetchFans',
    value: function fetchFans() {
      var _this6 = this;

      _util2.default.getUserFans(this.info.anchor.id, 1).then(function (res) {
        var newFans = [];
        if (_this6.fansSet.size) {
          newFans = res.fans.filter(function (fan) {
            if (_this6.fansSet.has(fan.id)) {
              return false;
            } else {
              _this6.fansSet.add(fan.id);
              return true;
            }
          });
        } else {
          res.fans.forEach(function (fan) {
            _this6.fansSet.add(fan.id);
          });
        }
        _this6.fansService = setTimeout(function () {
          _this6.fetchFans();
        }, FETCH_FANS_DELAY);
        var msg = {
          type: 'fans',
          ts: new Date().getTime(),
          total: res.total,
          newFans: newFans
        };
        _this6.emit('data', msg);
        _this6.emit('fans', msg);
      }).catch(function (res) {
        _this6.fansService = setTimeout(function () {
          _this6.fetchFans();
        }, FETCH_FANS_DELAY);
      });
    }
  }, {
    key: 'packageGift',
    value: function packageGift(msg) {
      var _this7 = this;

      var key = msg.user.id + '.' + msg.gift.id;
      var sameGiftEvent = this.giftMap.has(key);
      if (sameGiftEvent) {
        var giftEvent = this.giftMap.get(key);
        giftEvent.msg.gift.count = Number(giftEvent.msg.gift.count) + Number(msg.gift.count);
        giftEvent.event();
      } else {
        (function () {
          var giftEvent = {
            msg: _lodash2.default.merge({}, msg),
            event: _lodash2.default.debounce(function () {
              _this7.emit('giftBundle', giftEvent.msg);
              _this7.giftMap.delete(key);
            }, GIFT_END_DELAY)
          };
          giftEvent.event();
          _this7.giftMap.set(key, giftEvent);
        })();
      }
    }
  }]);

  return RoomService;
}(_events2.default);

exports.default = RoomService;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = __webpack_require__(2);

var _events2 = _interopRequireDefault(_events);

var _util = __webpack_require__(0);

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DANMAKU_COLOR = {
  'white': 0xffffff,
  'red': 0xff6868,
  'blue': 0x66ccff,
  'purple': 0xe33fff,
  'cyan': 0x00fffc,
  'green': 0x7eff00,
  'yellow': 0xffed4f,
  'orange': 0xff9800
};

var DANMAKU_MODE = {
  'scroll': 1,
  'top': 5
};

var MESSAGE_SEND_DELAY = 1500;
var HEARTBEAT_DELAY = 3e5;

var UserService = function (_EventEmitter) {
  _inherits(UserService, _EventEmitter);

  function UserService() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, UserService);

    var _this = _possibleConstructorReturn(this, (UserService.__proto__ || Object.getPrototypeOf(UserService)).call(this));

    _this.cookie = config.cookie || '';
    _this.danmakuColor = config.danmakuColor || 'white';
    _this.danmakuMode = config.danmakuMode || 'scroll';
    _this.danmakuLimit = config.danmakuLimit || 20;
    _this.room = '';
    _this.userRoom = {};
    _this.userInfo = {};
    _this.messageQueue = [];
    _this.sendingMessage = false;
    _this.onlineService = null;
    return _this;
  }

  _createClass(UserService, [{
    key: 'init',
    value: function init() {
      var _this2 = this;

      return this.checkLogin().then(function (login) {
        if (login) {
          return _this2.getInfo();
        }
        return false;
      });
    }
  }, {
    key: 'checkLogin',
    value: function checkLogin() {
      return _util2.default.checkUserLogin(this.cookie).then(function (res) {
        return res.login;
      });
    }
  }, {
    key: 'getInfo',
    value: function getInfo() {
      var _this3 = this;

      return _util2.default.getUserLiveInfo(this.cookie).then(function (res) {
        _this3.userInfo = res.user;
        _this3.userRoom = res.room;
        return _this3;
      });
    }
  }, {
    key: 'getUserInfo',
    value: function getUserInfo() {
      return this.userInfo;
    }
  }, {
    key: 'getUserRoom',
    value: function getUserRoom() {
      return this.userRoom;
    }
  }, {
    key: 'setCurrentRoom',
    value: function setCurrentRoom(roomId) {
      this.room = roomId;
    }
  }, {
    key: 'startOnlineService',
    value: function startOnlineService() {
      var _this4 = this;

      this.sendHeartbeat();
      this.emit('heartbeat');
      this.onlineService = setTimeout(function () {
        _this4.startOnlineService();
      }, HEARTBEAT_DELAY);
    }
  }, {
    key: 'stopOnlineService',
    value: function stopOnlineService() {
      clearTimeout(this.onlineService);
      this.onlineService = null;
    }
  }, {
    key: 'sendHeartbeat',
    value: function sendHeartbeat() {
      return _util2.default.sendHeartbeat(this.cookie, this.room);
    }
  }, {
    key: 'joinSmallTV',
    value: function joinSmallTV(roomId, tvId) {
      return _util2.default.joinSmallTV(this.cookie, {
        roomId: roomId,
        id: tvId,
        _: new Date().getTime()
      });
    }
  }, {
    key: 'getSmallTVReward',
    value: function getSmallTVReward(tvId) {
      return _util2.default.getSmallTVReward(this.cookie, {
        id: tvId,
        _: new Date().getTime()
      });
    }
  }, {
    key: 'sendMessage',
    value: function sendMessage(msg) {
      var message = '' + msg;
      while (message.length) {
        this.messageQueue.push({
          color: Number(Number(DANMAKU_COLOR[this.danmakuColor]).toString(10)),
          mode: DANMAKU_MODE[this.danmakuMode],
          msg: message.slice(0, this.danmakuLimit),
          rnd: Math.floor(new Date().getTime() / 1000),
          roomid: this.room
        });
        message = message.slice(this.danmakuLimit);
      }
      if (!this.sendingMessage) {
        this.sendMessageFromQueue();
      }
    }
  }, {
    key: 'sendMessageFromQueue',
    value: function sendMessageFromQueue() {
      var _this5 = this;

      if (this.messageQueue.length) {
        this.sendingMessage = true;
        _util2.default.sendMessage(this.cookie, this.messageQueue.shift()).then(function (res) {
          setTimeout(function () {
            _this5.sendMessageFromQueue();
          }, MESSAGE_SEND_DELAY);
        }, function (res) {
          _this5.sendingMessage = false;
        });
      } else {
        this.sendingMessage = false;
      }
    }
  }, {
    key: 'startLiving',
    value: function startLiving() {
      if (!this.userRoom.id) return false;
      return _util2.default.toggleLiveRoom(this.cookie, 1, this.userRoom.id);
    }
  }, {
    key: 'getRTMP',
    value: function getRTMP() {
      if (!this.userRoom.id) return false;
      return _util2.default.getLiveRoomRTMP(this.cookie, this.userRoom.id);
    }
  }, {
    key: 'endLiving',
    value: function endLiving() {
      if (!this.userRoom.id) return false;
      return _util2.default.toggleLiveRoom(this.cookie, 0, this.userRoom.id);
    }
  }, {
    key: 'getBlockList',
    value: function getBlockList(page) {
      if (!this.userRoom.id) return false;
      return _util2.default.getRoomBlockList(this.cookie, this.userRoom.id, page);
    }
  }, {
    key: 'blockUser',
    value: function blockUser(userId, hour) {
      return _util2.default.blockUser(this.cookie, {
        roomid: this.room,
        content: userId,
        type: 1,
        hour: hour
      });
    }
  }, {
    key: 'deleteBlockUser',
    value: function deleteBlockUser(blockId) {
      return _util2.default.deleteBlockUser(this.cookie, {
        roomid: this.room,
        id: blockId
      });
    }
  }, {
    key: 'addAdmin',
    value: function addAdmin(userId) {
      return _util2.default.setAdmin(this.cookie, {
        content: userId,
        roomid: this.room,
        type: 'add'
      });
    }
  }, {
    key: 'deleteAdmin',
    value: function deleteAdmin(userId) {
      return _util2.default.setAdmin(this.cookie, {
        content: userId,
        roomid: this.room,
        type: 'del'
      });
    }
  }]);

  return UserService;
}(_events2.default);

exports.default = UserService;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _http = __webpack_require__(9);

var _http2 = _interopRequireDefault(_http);

var _url = __webpack_require__(12);

var _url2 = _interopRequireDefault(_url);

var _querystring = __webpack_require__(3);

var _querystring2 = _interopRequireDefault(_querystring);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function get(requestUrl) {
  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var parsed = _url2.default.parse(requestUrl);
  var options = {
    hostname: parsed.hostname,
    port: parsed.port,
    path: parsed.pathname,
    method: 'GET'
  };
  var params = _querystring2.default.stringify(config.params);
  if (params) {
    options.path += '?' + params;
  }
  if (config.headers) {
    options.headers = config.headers;
  }
  return dispatchRequest(options);
}

function post(requestUrl) {
  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var postData = typeof config.body == 'string' ? config.body : JSON.stringify(config.body || {});
  var parsed = _url2.default.parse(requestUrl);
  var options = {
    hostname: parsed.hostname,
    port: parsed.port,
    path: parsed.path,
    method: 'POST',
    headers: Object.assign({}, {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }, config.headers)
  };
  return dispatchRequest(options, postData);
}

function dispatchRequest(options, postData) {
  return new Promise(function (resolve, reject) {
    var req = _http2.default.request(options, function (res) {
      var statusCode = res.statusCode;
      if (statusCode !== 200) {
        reject(new Error('Request failed with status code ' + statusCode));
      }
      res.setEncoding('utf8');
      var rawData = '';
      res.on('error', function (e) {
        return reject(e);
      });
      res.on('data', function (chunk) {
        return rawData += chunk;
      });
      res.on('end', function () {
        resolve(rawData);
      });
    });
    req.on('error', function (e) {
      reject(e);
    });
    if (options.method === 'POST') {
      req.write(postData);
    }
    req.end();
  });
}

exports.default = {
  get: get,
  post: post
};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _consts = __webpack_require__(1);

var _consts2 = _interopRequireDefault(_consts);

var _string_decoder = __webpack_require__(11);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var textDecoder = new _string_decoder.StringDecoder('utf8');

function decodeBuffer(buff) {
  var data = {};
  data.packetLen = buff.readInt32BE(_consts2.default.WS_PACKAGE_OFFSET);
  _consts2.default.dataStruct.forEach(function (struct) {
    if (struct.bytes === 4) {
      data[struct.key] = buff.readInt32BE(struct.offset);
    } else if (struct.bytes === 2) {
      data[struct.key] = buff.readInt16BE(struct.offset);
    }
  });
  if (data.op && data.op === _consts2.default.WS_OP_MESSAGE) {
    data.body = [];
    var packetLen = data.packetLen;
    var headerLen = 0;
    for (var offset = _consts2.default.WS_PACKAGE_OFFSET; offset < buff.byteLength; offset += packetLen) {
      packetLen = buff.readInt32BE(offset);
      headerLen = buff.readInt16BE(offset + _consts2.default.WS_HEADER_OFFSET);
      try {
        var body = JSON.parse(textDecoder.write(buff.slice(offset + headerLen, offset + packetLen)));
        data.body.push(body);
      } catch (e) {
        console.log("decode body error:", textDecoder.write(buff.slice(offset + headerLen, offset + packetLen)), data);
      }
    }
  } else if (data.op && data.op === _consts2.default.WS_OP_HEARTBEAT_REPLY) {
    data.body = {
      number: buff.readInt32BE(_consts2.default.WS_PACKAGE_HEADER_TOTAL_LENGTH)
    };
  }
  return data;
}

function parseMessage(msg) {
  switch (msg.op) {
    case _consts2.default.WS_OP_HEARTBEAT_REPLY:
      msg.body.type = 'online';
      msg.body.ts = new Date().getTime();
      return msg.body;
    case _consts2.default.WS_OP_MESSAGE:
      return msg.body.map(function (m) {
        return transformMessage(m);
      });
    case _consts2.default.WS_OP_CONNECT_SUCCESS:
      return {
        type: 'connected',
        ts: new Date().getTime()
      };
  }
}

function transformMessage(msg) {
  var message = {};
  switch (msg.cmd) {
    case 'LIVE':
      message.type = 'live';
      message.roomId = msg.roomid;
      break;
    case 'PREPARING':
      message.type = 'preparing';
      message.roomId = msg.roomid;
      break;
    case 'DANMU_MSG':
      message.type = 'comment';
      message.comment = msg.info[1];
      message.user = {
        id: msg.info[2][0],
        name: msg.info[2][1],
        isAdmin: !!msg.info[2][2],
        isVIP: !!msg.info[2][3],
        isSVIP: !!msg.info[2][4],
        guard: msg.info[7]
      };
      if (msg.info[3].length) {
        message.user.badge = {
          level: msg.info[3][0],
          title: msg.info[3][1],
          anchor: msg.info[3][2],
          roomURL: msg.info[3][3]
        };
      }
      if (msg.info[4].length) {
        message.user.level = msg.info[4][0];
      }
      break;
    case 'WELCOME':
      message.type = 'welcome';
      message.user = {
        id: msg.data.uid,
        name: msg.data.uname,
        isAdmin: !!msg.data.isadmin,
        isVIP: !!msg.data.vip,
        isSVIP: !!msg.data.svip
      };
      break;
    case 'WELCOME_GUARD':
      message.type = 'welcomeGuard';
      message.user = {
        id: msg.data.uid,
        name: msg.data.username,
        guard: msg.data.guard_level
      };
      break;
    case 'GUARD_BUY':
      message.type = 'guardBuy';
      message.user = {
        id: msg.data.uid,
        name: msg.data.username
      };
      message.level = msg.data.guard_level;
      message.count = msg.data.num;
      break;
    case 'SEND_GIFT':
      message.type = 'gift';
      message.gift = {
        id: msg.data.giftId,
        type: msg.data.giftType,
        name: msg.data.giftName,
        count: msg.data.num,
        price: msg.data.price
      };
      message.user = {
        id: msg.data.uid,
        name: msg.data.uname
      };
      break;
    case 'ROOM_BLOCK_MSG':
      message.type = 'block';
      message.user = {
        id: msg.uid,
        name: msg.uname
      };
      break;
    default:
      message = msg;
      message.type = msg.cmd;
  }
  message.ts = new Date().getTime();
  return message;
}

function decodeData(buff) {
  var messages = [];
  try {
    var data = parseMessage(decodeBuffer(buff));
    if (data instanceof Array) {
      data.forEach(function (m) {
        messages.push(m);
      });
    } else if (data instanceof Object) {
      messages.push(data);
    }
  } catch (e) {
    console.log("Socket message error", buff, e);
  }
  return messages;
}

exports.default = {
  decodeData: decodeData
};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _consts = __webpack_require__(1);

var _consts2 = _interopRequireDefault(_consts);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getPacketLength(payload) {
  return Buffer.byteLength(payload) + _consts2.default.headerLength;
}

function writePacketLength(buff, packetLength) {
  buff.writeInt32BE(packetLength, 0);
}

function writeConsts(buff) {
  buff.writeInt16BE(_consts2.default.magic, 4);
  buff.writeInt16BE(_consts2.default.version, 6);
  buff.writeInt32BE(_consts2.default.magicParam, 12);
}

function writeAction(buff, action) {
  buff.writeInt32BE(action, 8);
}

function writePayload(buff, payload) {
  buff.write(payload, _consts2.default.headerLength);
}

function generatePacket(action, payload) {
  payload = payload || '';
  var packetLength = getPacketLength(payload);
  var buff = new Buffer(packetLength);

  writePacketLength(buff, packetLength);
  writeConsts(buff);
  writeAction(buff, action);
  writePayload(buff, payload);

  return buff;
}

function encodeHeartbeat() {
  return generatePacket(_consts2.default.actions.heartbeat);
}

function encodeJoinRoom(rid, uid) {
  var userId = Number(uid);
  var roomId = Number(rid);
  var packet = JSON.stringify({ uid: userId, roomid: roomId });
  return generatePacket(_consts2.default.actions.joinChannel, packet);
}

exports.default = {
  encodeJoinRoom: encodeJoinRoom,
  encodeHeartbeat: encodeHeartbeat
};

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("lodash");

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("string_decoder");

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = require("url");

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = require("ws");

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Util = exports.initUser = exports.initRoom = undefined;

var _room = __webpack_require__(4);

var _room2 = _interopRequireDefault(_room);

var _user = __webpack_require__(5);

var _user2 = _interopRequireDefault(_user);

var _util = __webpack_require__(0);

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function initRoom(config) {
  return new _room2.default(config).init();
}

function initUser(config) {
  return new _user2.default(config).init();
}

exports.initRoom = initRoom;
exports.initUser = initUser;
exports.Util = _util2.default;
exports.default = {
  initRoom: initRoom,
  initUser: initUser,
  Util: _util2.default
};

/***/ })
/******/ ]);