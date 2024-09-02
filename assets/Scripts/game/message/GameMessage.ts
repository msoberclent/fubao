import { BaseObject } from "../../../Piter.Framework/BaseKit/Constant/BaseObject";
import { config_slo_subgame } from "../../config/config_slo_subgame";

export interface SecondIconItem {
  gameType: string
  productCode: string
  productType: number
  sortIndex: number
  status: number;
  prex: string
}


export interface GameIconItem {
  displayType: number
  gameId: number
  gameType: string
  jumpUrl: string
  name: string;
  platName: string //不要
  productCode: string
  sortIndex: number
  status: number
  prex: string
  iconUrl: string
  display_name: string
}

/**
 * SLOTS游戏大厅节点数据
 */
export interface SlotMainIconItem {
  /**
   * 游戏图标(1大 2小)
   */
  iconType: number;
  /**
   * 游戏ID
   */
  gameId: number;
  /**
   * 排序
   */
  sortIndex: number;
  /**
   * 维护 火热 新 等 状态
   */
  status: number;
  /**
   * VIP进入等级
   */
  vipLevel: number;
  /**
   * 玩家等级进入(预留)
   */
  openLevel: number;

  /**
   * 游戏静态配置
   */
  config: config_slo_subgame;
}


export interface GameListItem {
  serverData: GameIconItem,
  config: config_slo_subgame
}



export interface PlatPlayer {
  code?: string;
  bigJackpot?: number;
  simpleUser?: SimpleUser;
  gold?: number;
  diamond?: number;
  rewardLock?: number;
  rewardUnlock?: number;
  parentId?: string; //上级代理
  parentCode?: string;
  safety?: number;
  phone?: string;
  fanyongBi?: boolean;
  kuishunFanyongbi?: boolean;
  gameListVo?: any;
  payPwdSeted?: boolean
  vipInfo?: PlayerVipInfo;
  collectJackpotIconNum?: number;
  allowPlaygame?: number;
  realName?: string;
  loginName?: string;
  regDate?: string;
  vip?: string;
  qrCodeUrl?: string;
  inviteCode?: string;
}

export interface PlayerVipInfo {
  curExp: number
  medalId: number
  upExp: number
  vipLevel: number
}

export interface SimpleUser {
  uid: string;
  nick: string;
  sex: number;
  headImg: string;
  id: string
}

/**
 * 房间信息
 * 所有游戏数据 都加入其中 标明
 */
export interface RoomInfo {

  eliminateSet: any[]

  gameBaseInfo: GameBaseInfo

  gameId: number;

  gameConfig: any;

  maxPlayer: number
  now: string;
  //  "1684850425942"
  offlineSet: any[];
  roomId: string
  roomStatus: number
  roomTimes: number
  watcherHasPosSet: any[];

  //客户端自定义数据
  players: BaseObject<GamePlayerInfo>;

  sofaMap: BaseObject<GamePlayerInfo>;

}


/**
 * 玩家内游戏数据
 */
export interface GamePlayerInfo {
  gold: number
  pos: number;
  simpleUser: SimpleUser;
}

/**
 * 游戏内计时器
 */
export interface GameCountDown {
  end: number,
  type: string
}


export interface GameBaseInfo {
  // { goldCarry: '1000000', totalTimes: 1, leftTimes: 0, state: 1, type: 0 }
  bankerData: any;
  betMap: any;
  betTimer: number;
  gameConfigExt: any;
  gold: number
  playerCount: number;
  readySet: any[];
  selfBetMap: any
  simpleUser: SimpleUser;
  sofaBetMap: any;
  pos: number;
  recordList: any[];
  bankerDataList: any[]
  bankerCardList: any;
  xianCardList: number[]
  xianCardListMap: any;
  watcherEntityList: any[];
  lukeyMan: string;
  countDown: GameCountDown

  qiangzhuangData: any
  yazhuData: any;
  shows: any;
  liangpaiData: any
}

/**
 * 提现方式
 */
export interface WithdrawMethodItem {
  accountAddr: string
  createStamp: string
  del: number
  id: number
  isdefault: number
  notes: string
  provider: string
  realName: string
  type: number
  uid: number
}



/**
 * 充值方式
 */
export interface RechargeMethodItem {
  active: number;
  addTime: string;
  id: number
  modeKey: string
  modeName: string
  notes: string
  sortIndex: number
  picUrl?: string
  remark?: string
}



export interface PokerCardMessage {

  color: number;

  id: number;

  num: number;

}

/*--------------------------------------------------------------------
 * slot部分
*/

export interface SlotSpinePointResult {
  id: number;
  column: number;
  row: number;
  iconID: number;
}

export interface SlotAccountData {
  bet: string;
  uid: number;
  freeSpins: number;
  chipin: number;
  id: number;
  normalId: number;
  slotId: number;
}

export interface SlotUserAccountData {
  gold: string;
  uid: number;
  diamond: string;
  safety: string;
}