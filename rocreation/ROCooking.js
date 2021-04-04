///////////////////////////////////////////////////////////
// RO製造計算機 - 料理 - まじぽたさんすう
///////////////////////////////////////////////////////////

/** 更新停止 */
var isSuspending = false;

/** COOKIEキー */
var cookieName = 'ROCooking';

/** COOKIE設定 */
var cookieSettings = {
	expires:	3650,
	domain:		'magipota.gozaru.jp',
	path:		'/rocreation/',
};

/** COOKIE区切り文字 */
var cookieItemDelimiter = ';';

/** パラメータ一覧 */
var params = {
	// レベル
	p_BaseLv:	 175,

	// ステータス
	p_BaseDEX:	1,	p_AddDEX:	0,
	p_BaseLUK:	1,	p_AddLUK:	0,

	// スキル
	p_CookingMastery:	200,

	// ワールド
	p_World:	15, // 15:Noatun

	// 料理作成/調理器具
	p_CookingKit_0:		0,	p_CookingKit_1:		0,	p_CookingKit_2:		0,	p_CookingKit_3:		0,	p_CookingKit_4:		0,
	p_CookingKit_5:		0,	p_CookingKit_6:		0,	p_CookingKit_7:		0,	p_CookingKit_8:		0,	p_CookingKit_9:		0,
	p_CookingKit_10:	0,	p_CookingKit_11:	0,	p_CookingKit_12:	0,	p_CookingKit_13:	0,	p_CookingKit_14:	0,
	p_CookingKit_15:	0,	p_CookingKit_16:	0,	p_CookingKit_17:	0,	p_CookingKit_18:	0,	p_CookingKit_19:	0,
	p_CookingKit_20:	0,	p_CookingKit_21:	0,	p_CookingKit_22:	0,	p_CookingKit_23:	0,	p_CookingKit_24:	0,
	p_CookingKit_25:	0,	p_CookingKit_26:	0,	p_CookingKit_27:	0,	p_CookingKit_28:	0,	p_CookingKit_29:	0,
	p_CookingKit_30:	0,	p_CookingKit_31:	0,	p_CookingKit_32:	0,	p_CookingKit_33:	0,	p_CookingKit_34:	0,
	p_CookingKit_35:	0,	p_CookingKit_36:	0,	p_CookingKit_37:	0,	p_CookingKit_38:	0,	p_CookingKit_39:	0,
	p_CookingKit_40:	0,	p_CookingKit_41:	0,	p_CookingKit_42:	0,	p_CookingKit_43:	0,	p_CookingKit_44:	0,
	p_CookingKit_45:	0,	p_CookingKit_46:	0,	p_CookingKit_47:	0,	p_CookingKit_48:	0,	p_CookingKit_49:	0,
	p_CookingKit_50:	0,	p_CookingKit_51:	0,	p_CookingKit_52:	0,	p_CookingKit_53:	0,	p_CookingKit_54:	0,
	p_CookingKit_55:	0,	p_CookingKit_56:	0,	p_CookingKit_57:	0,	p_CookingKit_58:	0,	p_CookingKit_59:	0,

	// 原価/価格
	p_Cost_0:	500,	p_Cost_1:	1000,		p_Cost_2:	12,		p_Cost_3:	3,		p_Cost_4:	6200,
	p_Cost_5:	1300,	p_Cost_6:	3800,		p_Cost_7:	760,	p_Cost_8:	104,	p_Cost_9:	10,
	p_Cost_10:	38,		p_Cost_11:	1600,		p_Cost_12:	532,	p_Cost_13:	15000,	p_Cost_14:	50000,
	p_Cost_15:	500,	p_Cost_16:	100,		p_Cost_17:	6000,	p_Cost_18:	30000,	p_Cost_19:	3040,
	p_Cost_20:	60000,	p_Cost_21:	1000,		p_Cost_22:	2500,	p_Cost_23:	121,	p_Cost_24:	11,
	p_Cost_25:	10001,	p_Cost_26:	2,			p_Cost_27:	380,	p_Cost_28:	190,	p_Cost_29:	1,
	p_Cost_30:	378,	p_Cost_31:	300,		p_Cost_32:	5000,	p_Cost_33:	97,		p_Cost_34:	2,
	p_Cost_35:	86,		p_Cost_36:	50,			p_Cost_37:	288,	p_Cost_38:	2501,	p_Cost_39:	44,
	p_Cost_40:	284,	p_Cost_41:	532,		p_Cost_42:	760,	p_Cost_43:	500,	p_Cost_44:	403,
	p_Cost_45:	300,	p_Cost_46:	180,		p_Cost_47:	418,	p_Cost_48:	10,		p_Cost_49:	2,
	p_Cost_50:	12,		p_Cost_51:	300,		p_Cost_52:	50000,	p_Cost_53:	152,	p_Cost_54:	620,
	p_Cost_55:	1,		p_Cost_56:	437,		p_Cost_57:	1100,	p_Cost_58:	70,		p_Cost_59:	456,
	p_Cost_60:	250,	p_Cost_61:	300,		p_Cost_62:	380,	p_Cost_63:	30,		p_Cost_64:	760,
	p_Cost_65:	500,	p_Cost_66:	608,		p_Cost_67:	499,	p_Cost_68:	2200,	p_Cost_69:	1,
	p_Cost_70:	65,		p_Cost_71:	532,		p_Cost_72:	347,	p_Cost_73:	110,	p_Cost_74:	1,
	p_Cost_75:	1200,	p_Cost_76:	248,		p_Cost_77:	1000,	p_Cost_78:	300,	p_Cost_79:	1100,
	p_Cost_80:	10,		p_Cost_81:	1000000,	p_Cost_82:	152,	p_Cost_83:	38,		p_Cost_84:	16500,
	p_Cost_85:	300,	p_Cost_86:	11,			p_Cost_87:	650,	p_Cost_88:	12500,	p_Cost_89:	3700,
	p_Cost_90:	2,		p_Cost_91:	333,		p_Cost_92:	30000,	p_Cost_93:	44,		p_Cost_94:	11,
	p_Cost_95:	160,	p_Cost_96:	114,		p_Cost_97:	2,		p_Cost_98:	350,	p_Cost_99:	490,
	p_Cost_100:	409,	p_Cost_101:	10000,		p_Cost_102:	121,	p_Cost_103:	500,	p_Cost_104:	2500,
	p_Cost_105:	12,		p_Cost_106:	760,		p_Cost_107:	151,	p_Cost_108:	1800,	p_Cost_109:	6460,
	p_Cost_110:	60000,	p_Cost_111:	5,			p_Cost_112:	1200,	p_Cost_113:	19,		p_Cost_114:	750,
	p_Cost_115:	10000,	p_Cost_116:	248,		p_Cost_117:	40000,	p_Cost_118:	11,		p_Cost_119:	1000,
	p_Cost_120:	12,		p_Cost_121:	1000,		p_Cost_122:	4600,	p_Cost_123:	700,
};

/**
 * 値を範囲制限する。
 * @param {number} val 範囲制限する値。
 * @param {number} minValue 最小値。
 * @param {number} maxValue 最大値。
 * @returns {number} minValue ～ maxValue 間に収まる形に修正された val 。
 */
function bindValue(val, minValue, maxValue) {

	// 最小値以下の場合、最小値
	if (val <= minValue) {
		return minValue;
	}

	// 最大値以上の場合、最大値
	if (val >= maxValue) {
		return maxValue;
	}

	return val;
}

/**
 * 確率を書式化する。
 * @param {number} val 確率値。(0～1)
 * @returns {string} 0.00 ～ 100.00 の値を表す文字列。NaNの場合は'(計算失敗)'。
 */
function formatRate(val) {

	// 非数の場合は計算失敗
	if (isNaN(val)) {
		return '(計算失敗)';
	}

	// 値の範囲制限
	val = bindValue(val, 0.00, 1.00)

	var formattedRate = '' + (Math.floor(val * 10000) / 100);
	// 小数点が存在しない場合、末尾に追加
	if (formattedRate.indexOf('.') == -1) {
		formattedRate += '.';
	}
	while (formattedRate.length - formattedRate.indexOf('.') < 3) {
		formattedRate += '0';
	}
	return formattedRate;
}

/**
 * 原価材料の価格を計算する。
 * @param {string} costItems 原価材料の一覧を表す文字列。(例: 'アイテム名A*1,アイテム名B*2')
 * @param {number} rate 成功率(0.00～1.00)、または原価材料1セット分での作成個数。
 * @param {object} replaceList 置換を行うアイテムの一覧。
 * @returns {string} 原価を表す 0.00 形式の文字列。アイテム名に対応する原価材料が不明、またはNaNの場合は'(計算不能)'。
 */
function calculateCost(costItems, rate, replaceList = {}) {
	var ratio = 1 / rate, baseCost = 0;
	var itemSplit, itemName, itemCount, itemCost, costIndex;

	// 倍率が計算不能の場合
	if (!isFinite(ratio)) {
		return '(計算不能)';
	}

	// アイテム名*個数 単位に分割
	$.each(costItems.split(','), function(itemIndex, itemPair) {
		// アイテム名と個数を分割
		itemSplit = itemPair.split('*');
		itemName = itemSplit[0];
		itemCount = parseInt(itemSplit[1]);

		// 置換対象のアイテムの場合、置換を行う
		if (itemName in replaceList) {
			itemName = replaceList[itemName];
		}

		// アイテム名から原価材料を特定、存在しない場合は計算不能
		costIndex = CostItemNames.indexOf(itemName);
		if (costIndex == -1) {
			return '(計算不能)';
		}

		// 原価計算
		itemCost = params['p_Cost_' + costIndex] * itemCount;
		baseCost += itemCost;
	});

	// 基本原価に倍率を掛けた結果を原価として書式化(0.00 形式)
	var formattedCost = '' + (Math.floor(baseCost * ratio * 100) / 100);
	// 小数点が存在しない場合、末尾に追加
	if (formattedCost.indexOf('.') == -1) {
		formattedCost += '.';
	}
	while (formattedCost.length - formattedCost.indexOf('.') < 3) {
		formattedCost += '0';
	}
	return formattedCost;
}

/**
 * 入力内容をCOOKIEに保存する。
 */
function saveCookie() {
	var contentConcat;

	// 区切り文字で繋げる
	contentConcat = '';
	$.each(params, function(name, value) {
		if (contentConcat != '') {
			contentConcat += cookieItemDelimiter;
		}
		contentConcat += $('#' + name).val();
	});

	$.cookie(cookieName, contentConcat, cookieSettings);
}

/**
 * COOKIEから入力内容を構築する。
 */
function loadCookie() {
	var i, content, contentSplit, v;

	// COOKIEの取得し、空でない場合のみパラメータ一覧に反映
	content = $.cookie(cookieName);
	if (content !== undefined) {
		// 区切り文字で分割して格納
		contentSplit = content.split(cookieItemDelimiter);
		i = 0;
		$.each(params, function(name, value) {
			if ((i < contentSplit.length) && contentSplit[i].match(/\d+(\.\d+)?/)) {
				v = parseInt(contentSplit[i], 10);
				params[name] = v;
			}
			i++;
		});
	}

	// パラメータ一覧をコントロールに反映
	paramsToControls();

	// 再計算
	recalculateControls();
}

/**
 * COOKIEを削除し入力内容をリセットする。
 */
function resetCookie() {

	// COOKIEを削除
	$.removeCookie(cookieName);

	// リロード
	location.reload(true);
}

/**
 * パラメータの内容をコントロールに反映する。
 */
function paramsToControls() {

	// 再計算の一時停止
	isSuspending = true;
	try {
		// パラメータと同名のコントロールに値を設定
		$.each(params, function(name, value) {
			$('#' + name).val(value);
		});

		// selectmenuをリフレッシュ
		$('SELECT').selectmenu('refresh');
	}
	finally {
		isSuspending = false;
	}
}

/**
 * コントロールの内容をパラメータに反映する。
 */
function controlsToParams() {

	// パラメータと同名のコントロールから値を取得
	$.each(params, function(name, value) {
		params[name] = parseInt($('#' + name).val());
	});
}

/**
 * 各タブの再計算を行う。
 */
function recalculateControls() {

	// サスペンド状態の場合は中断
	if (isSuspending) {
		return;
	}

	// パラメータの取得
	controlsToParams();

	// 各タブ
	initializeTorihikiLinks();
	initializeCookingControls();
	initializeCostControls();
}

/**
 * 読み込みが終わった後で初期化を行う。
 */
$(function() {
	var isOfficialSite;
	var canCookie;
	var i, tooltipDelimiter = ' + ';

	// トップに戻るは本サイト上でのみ表示し、作者情報は本サイト以外で表示する
	isOfficialSite = (location.hostname === cookieSettings['domain']);
	$('#to-Top'      ).css('display', isOfficialSite ? 'inline' : 'none' );
	$('#about-Author').css('display', isOfficialSite ? 'none'   : 'block');

	// ジャンプメニューは表示
	$('#jumpMenu').selectmenu({
		change: function() {
			location.href = location.href.replace(/\/.+?$/g, '') + $(this).val();
		}
	});

	// 保存ボタンとリセットボタンはCOOKIEの仕様上、プロトコルがhttp(s)の場合のみ表示する
	canCookie = (location.protocol.match(/^https?/));
	$('#saveButton' ).button().on('click', function() { saveCookie();  }).css('display', canCookie ? 'block' : 'none');
	$('#resetButton').button().on('click', function() { resetCookie(); }).css('display', canCookie ? 'block' : 'none');

	// ツールチップで材料を表示する
	for (i = 0; i < CookingCostItems.length; i++) {
		$('#p_CookingItemName_' + i).prop('title', CookingCostItems[i].replace(/,/g, tooltipDelimiter));
	}
	$(document).tooltip();

	// タブ
	$('#mainTabs').tabs();

	// 各タブの初期化
	initializeParamControls(true);
	initializeCookingControls(true);
	initializeCostControls(true);

	// COOKIE値読み込み
	loadCookie();
});

///////////////////////////////////////////////////////////
// パラメータ
///////////////////////////////////////////////////////////

/**
 * パラメータ タブのコントロールを初期化する。
 * @param {boolean} initial 初回の場合はtrue。それ以外の場合はfalse。
 */
function initializeParamControls(initial = false) {
	var i;

	// 初回の場合、コントロールを構築
	if (initial) {
		// レベル
		$('#p_BaseLv' ).spinner({ min: 1, max:  70, change: function() { recalculateControls(); } });

		// ステータス
		$('#p_BaseDEX').spinner({ min: 1, max: 999, change: function() { recalculateControls(); } });
		$('#p_AddDEX' ).spinner({ min: 0, max: 999, change: function() { recalculateControls(); } });

		$('#p_BaseLUK').spinner({ min: 1, max: 999, change: function() { recalculateControls(); } });
		$('#p_AddLUK' ).spinner({ min: 0, max: 999, change: function() { recalculateControls(); } });

		// スキル
		$('#p_CookingMastery').spinner({ min: 0, max:  200, change: function() { recalculateControls(); } });	// 料理作成

		// ワールド
		$('#p_World').selectmenu({
			change: function() {
				controlsToParams();
				initializeTorihikiLinks();
			}
		});
	}
}

/**
 * 公式取引情報へのリンクを初期化する。
 * @param {boolean} initial 初回の場合はtrue。それ以外の場合はfalse。
 */
function initializeTorihikiLinks(initial = false) {
	var url;

	$('a').each(function(index, element) {
		url = $(this).attr('href');
		// アイテムへのリンクの場合のみ、末尾の&world=を書き換える
		if ((url !== undefined) && url.match(/^https:\/\/rotool\.gungho\.jp\/torihiki\/index\.php\?item=/g)) {
			url = url.replace(/&world=\d+/, '&world=' + params['p_World']);
			$(this).attr('href', url);
		}
	});
}

///////////////////////////////////////////////////////////
// 料理作成
///////////////////////////////////////////////////////////

/** 料理作成 アイテム補正 */
var CookingItemRates = [
	+ 4.5,	- 5.0,	-14.5,	-24.0,	-22.5,	-26.5,	-36.0,	-40.0,	-49.5,	-59.0,	// STR料理
	+ 4.5,	- 5.0,	- 9.0,	-18.5,	-22.5,	-21.0,	-36.0,	-40.0,	-49.5,	-59.0,	// AGI料理
	+ 4.5,	- 5.0,	- 9.0,	-18.5,	-22.5,	-26.5,	-36.0,	-40.0,	-49.5,	-59.0,	// VIT料理
	+10.0,	+ 0.5,	- 3.5,	-18.5,	-22.5,	-26.5,	-30.5,	-40.0,	-49.5,	-59.0,	// INT料理
	+ 4.5,	- 5.0,	-14.5,	-24.0,	-28.0,	-32.0,	-36.0,	-45.5,	-49.5,	-59.0,	// DEX料理
	+ 4.5,	- 5.0,	- 9.0,	-18.5,	-22.5,	-26.5,	-36.0,	-40.0,	-49.5,	-59.0,	// LUK料理
];

/** 料理作成 原価材料一覧 */
var CookingCostItems = [
	// STR料理
	'調理器具*1,バッタの足*5,古いフライパン*1,食用油*1',
	'調理器具*1,べとべと水かき*20,緑ハーブ*10,黄ハーブ*10,淡白なソース*1',
	'調理器具*1,にく*4,古いフライパン*1,緑ハーブ*10,レッドチリ*5,辛口ソース*1',
	'調理器具*1,にく*5,赤ハーブ*3,黄ハーブ*2,緑ハーブ*3,甘口ソース*1,レモン*1',
	'調理器具*1,いも*10,ハチ蜜*2,食用油*1,ニンジン*3,穀物*1',
	'調理器具*1,にく*10,ハチ蜜*2,黄ハーブ*1,マステラの実*1,輝く鱗*20',
	'調理器具*1,にく*10,火種*1,石炭*2,辛口ソース*1,木屑*15,白ハーブ*10',
	'調理器具*1,くまの足の裏*20,ニンジン*10,カボチャの頭*10,アロエの葉*2,ヒナレの葉*1,淡白なソース*1',
	'調理器具*1,血管*40,鍋*1,チーズ*10,辛口ソース*1,石炭*2,緑ハーブ*30,墨汁*10',
	'調理器具*1,長く細い舌*20,鍋*1,アルコール*1,アロエベラ*2,辛口ソース*1,ローヤルゼリー*5,イグドラシルの葉*10,青ポーション*2',

	// AGI料理
	'調理器具*1,穀物*1,かえるの卵*10,墨汁*1',
	'調理器具*1,穀物*1,淡白なソース*1,カボチャの頭*5,ニンジン*3',
	'調理器具*1,触手*10,チーズ*10,おいしい焼きいも*5,甘口ソース*1',
	'調理器具*1,穀物*3,辛口ソース*1,氷片*10,ニンジン*10,カボチャの頭*10',
	'調理器具*1,赤いコウモリの翼*20,カボチャの頭*20,鍋*1,ヒナレの葉*10,赤ハーブ*10',
	'調理器具*1,レッドチリ*20,エビ*20,甘口ソース*1,レモン*20',
	'調理器具*1,アノリアンの皮膚*10,カボチャの頭*10,ニンジン*10,アロエの葉*10,黄ハーブ*10,黄色い香辛料*1',
	'調理器具*1,アロエベラ*1,辛口ソース*1,にく*10,ヒナレの葉*10,カボチャの頭*10,ニンジン*10',
	'調理器具*1,にく*10,ローヤルゼリー*5,若芽*20,淡白なソース*4,黄ハーブ*5,白ハーブ*10,赤ハーブ*5',
	'調理器具*1,サソリの尻尾*20,さそりニッパ*20,アロエベラ*2,イグドラシルの葉*3,とても苦い草*3,ローヤルゼリー*10,辛口ソース*1,鍋*1',

	// VIT料理
	'調理器具*1,かにニッパ*10,緑ハーブ*10,黄ポーション*1',
	'調理器具*1,貝のむきみ*10,トゲがついているエラ*5,背びれ*5,おいしい魚*1',
	'調理器具*1,貝のむきみ*20,貝*10,ハチ蜜*1,甘口ソース*1',
	'調理器具*1,触手*30,白ハーブ*10,軟らかい草の葉*10,古いフライパン*1,墨汁*20',
	'調理器具*1,小包子*20,黄ハーブ*10,辛口ソース*1,赤い香辛料*1,緑ハーブ*20',
	'調理器具*1,茶色い根*20,食人植物の根*10,きのこの胞子*20,食用キノコ*1,ハチ蜜*2',
	'調理器具*1,魚の尻尾*10,アロエの葉*5,いのししのたてがみ*10,おいしい魚*2,ペットフード*10,甘口ソース*1',
	'調理器具*1,葉っぱの服*20,にく*20,虹色ニンジン*5,カボチャの頭*10,淡白なソース*1,穀物*2',
	'調理器具*1,ドラゴンの皮*10,ドラゴンの尻尾*20,イグドラシルの葉*3,ローヤルゼリー*6,辛口ソース*1,赤い香辛料*1,太っているミミズ*1',
	'調理器具*1,止まらない心臓*20,死者の遺品*10,イグドラシルの種*1,アンティペインメント*2,人魚の心臓*10,辛口ソース*2,返魂のお札*10,とても苦い草*2',

	// INT料理
	'調理器具*1,ブドウ*3,赤ポーション*2',
	'調理器具*1,赤ハーブ*10,黄ハーブ*10,青ハーブ*5',
	'調理器具*1,白ハーブ*10,ハチ蜜*2,黄色い香辛料*1',
	'調理器具*1,イチゴ*10,オレンジ*10,ブドウ*5,レモン*4,アルコール*2',
	'調理器具*1,マステラの実*4,アルコール*2,レモン*2,黄色い香辛料*1,青ポーション*1',
	'調理器具*1,きのこの胞子*20,食用キノコ*3,ブドウジュース*3,アルコール*1,赤い香辛料*1',
	'調理器具*1,ヒナレの葉*10,白ハーブ*5,ローヤルゼリー*4,ハチ蜜*2,黄色い香辛料*1',
	'調理器具*1,ヒナレの葉*10,アロエの葉*10,ローヤルゼリー*6,トゲの実*4,イグドラシルの葉*3,黄色い香辛料*1',
	'調理器具*1,イグドラシルの葉*10,アロエの葉*10,オレンジ*10,アルコール*5,ローヤルゼリー*4,青ポーション*2,黄色い香辛料*1',
	'調理器具*1,食人植物の根*10,青ハーブ*10,ローヤルゼリー*5,アロエの葉*5,トゲの実*5,レモン*5,イグドラシルの実*1,歌う草*1',

	// DEX料理
	'調理器具*1,ブドウ*2,ハチ蜜*1,赤ポーション*1',
	'調理器具*1,カカオ*10,ひとくちケーキ*1,ミルク*1,白い皿*1',
	'調理器具*1,オレンジ*5,リンゴ*5,バナナ*5,イチゴ*5,黄色い香辛料*1',
	'調理器具*1,ミルク*15,チーズ*10,黄ハーブ*10,パン*5,甘口ソース*1,にく*1',
	'調理器具*1,鋭い葉っぱ*10,大きな葉*6,アロエの葉*3,ヒナレの葉*2,甘口ソース*1,黄色い香辛料*1',
	'調理器具*1,とてもかたい桃*20,ひとくちケーキ*10,チーズ*10,ミルク*10,オレンジジュース*5,甘口ソース*1',
	'調理器具*1,パン*10,マステラの実*5,返魂のお札*5,メント*5,まだ熟してないリンゴ*2,甘口ソース*1',
	'調理器具*1,イチゴ*10,チーズ*10,パン*10,にく*5,ローヤルゼリー*2,辛口ソース*1,甘口ソース*1',
	'調理器具*1,オレンジ*10,イチゴ*10,まだ熟してないリンゴ*5,ブドウジュース*5,アルコール*2,赤い香辛料*1,熱帯のバナナ*1',
	'調理器具*1,氷片*10,菌糸*10,アルコール*5,ローヤルゼリー*4,スピードアップポーション*3,トゲの実*2,イグドラシルの実*1,幻想の花*1',

	// LUK料理
	'調理器具*1,サルのしっぽ*5,古いフライパン*1,食用油*1',
	'調理器具*1,リンゴジュース*3,ニンジンジュース*2,オレンジジュース*2,ブドウジュース*1',
	'調理器具*1,おいしい焼きいも*10,いも*10,甘口ソース*1,焼きいも*1',
	'調理器具*1,タヌキ木の葉*10,古代魚の唇*10,白ハーブ*10,おいしい魚*5,甘口ソース*2',
	'調理器具*1,サソリの尻尾*20,大きな葉*10,短い足*10,古いフライパン*2,食用油*1',
	'調理器具*1,魔女の星の砂*10,クローバー*10,爬虫類の舌*5,長く細い舌*5,アロエ*1',
	'調理器具*1,軟らかい草の葉*10,鱗のかけら*10,食用キノコ*10,貝のむきみ*10,トゲがついているエラ*5,にく*5',
	'調理器具*1,葉っぱの服*10,イチゴ*10,穀物*5,赤い香辛料*2,黄色い香辛料*1,淡白なソース*1',
	'調理器具*1,リンゴジュース*10,ローヤルゼリー*6,アンティペインメント*2,アロエベラ*2,アルコール*2,赤い香辛料*1,家畜の血*1',
	'調理器具*1,食人植物の根*10,鋭い葉っぱ*10,狐の尻尾*10,イグドラシルの葉*4,四葉のクローバー*2,イジドル*2,淡白なソース*1,黄色い香辛料*1',
];

/**
 * 料理 タブのコントロールを初期化する。
 * @param {boolean} initial 初回の場合はtrue。それ以外の場合はfalse。
 */
function initializeCookingControls(initial = false) {
	var i;
	var baseBrewingRate, itemBrewingRate, totalBrewingRate;
	var cookingKit;

	// 初回の場合、コントロールを構築
	if (initial) {
		for (i = 0; i < CookingItemRates.length; i++) {
			// アイテム補正
			$('#p_CookingItemRates_' + i).text('' + CookingItemRates[i]);

			// 調理器具
			$('#p_CookingKit_' + i).selectmenu({ change: function(event, data) { recalculateControls(); } });
		}
	}

	// 基本成功率 = [(料理経験 * 0.1) ＋ (BaseLv * 0.2) ＋ (DEX * 0.2) ＋ (LUK * 0.1)]%
	baseBrewingRate = bindValue(params['p_CookingMastery'] * 0.1, 0.0, 20.0)
	                + params['p_BaseLv'] * 0.2
	                + (params['p_BaseDEX'] + params['p_AddDEX']) * 0.2
	                + (params['p_BaseLUK'] + params['p_AddLUK']) * 0.1
	                ;

	for (i = 0; i < CookingItemRates.length; i++) {
		// 変動成功率 = 基本成功率 + [アイテム補正 ＋ 調理器具補正]%
		itemBrewingRate = baseBrewingRate
		                + CookingItemRates[i]
		                + (params['p_CookingKit_' + i] * 0.1)
		                ;
		totalBrewingRate = bindValue(itemBrewingRate / 100.00, 0.01, 1.00)
		$('#p_CookingBrewingRate_' + i).text('' + formatRate(totalBrewingRate));
		// 原価
		cookingKit = $('#p_CookingKit_' + i + ' option:selected').text();
		$('#p_CookingCost_' + i).text('' + calculateCost(CookingCostItems[i], totalBrewingRate, {
			調理器具: cookingKit
		}));
	}
}

///////////////////////////////////////////////////////////
// 原価
///////////////////////////////////////////////////////////

/** 原価アイテム名一覧 */
var CostItemNames = [
	// 00x
	'野外用調理器具', '家庭用調理器具', '高級調理器具', '宮廷用調理器具', '幻の調理器具',
	'青ハーブ', '青ポーション', '赤い香辛料', '赤いコウモリの翼', '赤ハーブ',
	// 01x
	'赤ポーション', 'アノリアンの皮膚', '甘口ソース', 'アルコール', 'アロエ',
	'アロエの葉', 'アロエベラ', 'アンティペインメント', 'イグドラシルの種', 'イグドラシルの葉',
	// 02x
	'イグドラシルの実', 'イジドル', 'イチゴ', 'いのししのたてがみ', 'いも',
	'歌う草', '鱗のかけら', 'エビ', 'おいしい魚', 'おいしい焼きいも',
	// 03x
	'大きな葉', 'オレンジ', 'オレンジジュース', '貝', '貝のむきみ',
	'かえるの卵', 'カカオ', '輝く鱗', '家畜の血', 'かにニッパ',
	// 04x
	'カボチャの頭', '辛口ソース', '黄色い香辛料', '木屑', '狐の尻尾',
	'きのこの胞子', '黄ハーブ', '黄ポーション', '菌糸', 'くまの足の裏',
	// 05x
	'クローバー', '血管', '幻想の花', '穀物', '古代魚の唇',
	'魚の尻尾', 'さそりニッパ', 'サソリの尻尾', 'サルのしっぽ', '死者の遺品',
	// 06x
	'触手', '食人植物の根', '食用油', '食用キノコ', '白い皿',
	'白ハーブ', 'スピードアップポーション', '鋭い葉っぱ', '石炭', '背びれ',
	// 07x
	'タヌキ木の葉', '淡白なソース', '茶色い根', 'チーズ', 'トゲがついているエラ',
	'トゲの実', 'とてもかたい桃', 'とても苦い草', '止まらない心臓', 'ドラゴンの皮',
	// 08x
	'ドラゴンの尻尾', '長く細い舌', '鍋', 'にく', '虹色ニンジン',
	'人魚の心臓', 'ニンジン', 'ニンジンジュース', '熱帯のバナナ', 'ハチ蜜',
	// 09x
	'爬虫類の舌', '葉っぱの服', '返魂のお札', 'バッタの足', 'バナナ',
	'小包子', 'パン', '火種', 'ひとくちケーキ', 'ヒナレの葉',
	// 10x
	'氷片', '太っているミミズ', '古いフライパン', 'ブドウ', 'ブドウジュース',
	'べとべと水かき', 'ペットフード', '墨汁', '魔女の星の砂', 'マステラの実',
	// 11x
	'まだ熟してないリンゴ', '短い足', '緑ハーブ', 'ミルク', 'メント',
	'焼きいも', '軟らかい草の葉', '四葉のクローバー', 'リンゴ', 'リンゴジュース',
	// 12x
	'レッドチリ', 'レモン', 'ローヤルゼリー', '若芽',
];

/**
 * 原価 タブのコントロールを初期化する。
 * @param {boolean} initial 初回の場合はtrue。それ以外の場合はfalse。
 */
function initializeCostControls(initial = false) {
	var i;

	// 初回の場合、コントロールを構築
	if (initial) {
		for (i = 0; i < CostItemNames.length; i++) {
			$('#p_Cost_' + i).spinner({
				min:       0,
				max: 1000000,
				change: function() {
					controlsToParams();
					initializeCookingControls();
				}
			});
		}
	}
}
