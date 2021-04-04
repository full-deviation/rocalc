///////////////////////////////////////////////////////////
// RO製造計算機 - ブラックスミス系列
///////////////////////////////////////////////////////////

/** 更新停止 */
var isSuspending = false;

/** COOKIEキー */
var cookieName = 'ROBlacksmith';

/** COOKIE設定 */
var cookieSettings = {
	expires:	3650,
	domain:		'magipota.gozaru.jp',
	path:		'/rocreation/',
};

/** COOKIE区切り文字 */
var cookieItemDelimiter = ';';

/** ツールチップ(材料一覧)アイテム間の区切り文字 */
var tooltipDelimiter = ' + ';

/** パラメータ一覧 */
var params = {
	// レベル
	p_JobLv:	60,
	p_Job:		 3,	// 1:ブラックスミス, 2:ホワイトスミス, 3:メカニック

	// ステータス
	p_BaseDEX:	1,	p_AddDEX:	5,
	p_BaseLUK:	1,	p_AddLUK:	6,

	// スキル
	p_IronTemperingLv:			 5,	// 鉄製造
	p_SteelTemperingLv:			 5,	// 鋼鉄製造
	p_EnchantedStoneCraftLv:	 5,	// 属性石製造
	p_WeaponryResearchLv:		10,	// 武器研究
	p_Anvil:					10,	// 金敷
	p_SmithDaggerLv:			 3,	// 短剣製作
	p_SmithSwordLv:				 3,	// 剣製作
	p_SmithTwoHandedSwordLv:	 3,	// 両手剣製作
	p_SmithSpearLv:				 3,	// 槍製作
	p_SmithBrassKnuckleLv:		 3,	// ナックル製作
	p_SmithMaceLv:				 3,	// メイス製作
	p_SmithAxeLv:				 3,	// 斧製作

	// ワールド
	p_World:	15, // 15:Noatun

	// 原価/価格
	p_Cost_0:	150,	p_Cost_1:	1000,
	p_Cost_2:	3000,	p_Cost_3:	5000,
	p_Cost_4:	775,	p_Cost_5:	500,
	p_Cost_6:	5000,	p_Cost_7:	2200,
	p_Cost_8:	500,	p_Cost_9:	3449,
	p_Cost_10:	1000,	p_Cost_11:	3500,
	p_Cost_12:	600,	p_Cost_13:	3500,
	p_Cost_14:	500,	p_Cost_15:	3700,
	p_Cost_16:	890,	p_Cost_17:	4800,
	p_Cost_18:	16700,	p_Cost_19:	100,
	p_Cost_20:	10,		p_Cost_21:	100,
	p_Cost_22:	35,		p_Cost_23:	3000,
	p_Cost_24:	136,	p_Cost_25:	25000,
	p_Cost_26:	3720,	p_Cost_27:	30,
	p_Cost_28:	4560,	p_Cost_29:	10000,
	p_Cost_30:	4560,	p_Cost_31:	10000,
	p_Cost_32:	200,	p_Cost_33:	500,
	p_Cost_34:	7600,	p_Cost_35:	4560,
	p_Cost_36:	10000,	p_Cost_37:	126,
	p_Cost_38:	900,	p_Cost_39:	4560,
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
			if ((i < contentSplit.length) && contentSplit[i].match(/\d+/)) {
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
	initializeOreTemperingControls();
	initializeSmithControls();
	initializeCostControls();
}

/**
 * 読み込みが終わった後で初期化を行う。
 */
$(function() {
	var isOfficialSite;
	var canCookie;
	var i;

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
	for (i = 0; i < IronTemperingCostItems.length; i++) {
		$('#p_IronTemperingItemName_' + i).prop('title', IronTemperingCostItems[i].replace(/,/g, tooltipDelimiter));
	}
	for (i = 0; i < SteelTemperingCostItems.length; i++) {
		$('#p_SteelTemperingItemName_' + i).prop('title', SteelTemperingCostItems[i].replace(/,/g, tooltipDelimiter));
	}
	for (i = 0; i < EnchantedStoneCraftCostItems.length; i++) {
		$('#p_EnchantedStoneCraftItemName_' + i).prop('title', EnchantedStoneCraftCostItems[i].replace(/,/g, tooltipDelimiter));
	}
	for (i = 0; i < SmithItemInfos.length; i++) {
		var opIndex, opName;
		$.each(['OP0', 'OP1', 'OP2', 'OP3'], function(opIndex, opName) {
			$('#p_SmithItemName_' + opName + '_' + i).prop('title', SmithItemInfos[i]['costItems'].replace(/,/g, tooltipDelimiter));
		});
	}
	$(document).tooltip();

	// タブ
	$('#mainTabs').tabs();

	// 各タブの初期化
	initializeParamControls(true);
	initializeOreTemperingControls(true);
	initializeSmithControls(true);
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
		$('#p_JobLv').spinner({ min: 1, max:  70, change: function() { recalculateControls(); } });
		$('#p_Job').selectmenu({ change: function() { recalculateControls(); } });

		// ステータス
		$('#p_BaseDEX').spinner({ min: 1, max: 999, change: function() { recalculateControls(); } });
		$('#p_AddDEX' ).spinner({ min: 0, max: 999, change: function() { recalculateControls(); } });

		$('#p_BaseLUK').spinner({ min: 1, max: 999, change: function() { recalculateControls(); } });
		$('#p_AddLUK' ).spinner({ min: 0, max: 999, change: function() { recalculateControls(); } });

		// 鉱石製造系
		$('#p_IronTemperingLv'      ).spinner({ min: 0, max:  5, change: function() { recalculateControls(); } });	// 鉄製造
		$('#p_SteelTemperingLv'     ).spinner({ min: 0, max:  5, change: function() { recalculateControls(); } });	// 鋼鉄製造
		$('#p_EnchantedStoneCraftLv').spinner({ min: 0, max:  5, change: function() { recalculateControls(); } });	// 属性石製造

		// 武器製作系
		$('#p_WeaponryResearchLv'   ).spinner({ min: 0, max: 10, change: function() { recalculateControls(); } });	// 武器研究
		$('#p_Anvil'                ).selectmenu({ change: function() { recalculateControls(); }});					// 金敷
		$('#p_SmithDaggerLv'        ).spinner({ min: 0, max:  3, change: function() { recalculateControls(); } });	// 短剣製作
		$('#p_SmithSwordLv'         ).spinner({ min: 0, max:  3, change: function() { recalculateControls(); } });	// 剣製作
		$('#p_SmithTwoHandedSwordLv').spinner({ min: 0, max:  3, change: function() { recalculateControls(); } });	// 両手剣製作
		$('#p_SmithSpearLv'         ).spinner({ min: 0, max:  3, change: function() { recalculateControls(); } });	// 槍製作
		$('#p_SmithAxeLv'           ).spinner({ min: 0, max:  3, change: function() { recalculateControls(); } });	// 斧製作
		$('#p_SmithBrassKnuckleLv'  ).spinner({ min: 0, max:  3, change: function() { recalculateControls(); } });	// ナックル製作
		$('#p_SmithMaceLv'          ).spinner({ min: 0, max:  3, change: function() { recalculateControls(); } });	// メイス製作

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
// 鉱石製造系
///////////////////////////////////////////////////////////

/** 鉄製造 総数 */
var IronTemperingItemCount = 1;

/** 鉄製造 原価材料一覧 */
var IronTemperingCostItems = [
	'携帯用溶鉱炉*1,鉄鉱石*1',
];

/** 鋼鉄製造 総数 */
var SteelTemperingItemCount = 1;

/** 鋼鉄製造 原価材料一覧 */
var SteelTemperingCostItems = [
	'携帯用溶鉱炉*1,鉄*5,石炭*1',
];

/** 属性石製造 総数 */
var EnchantedStoneCraftItemCount = 5;

/** 属性石製造 原価材料一覧 */
var EnchantedStoneCraftCostItems = [
	'携帯用溶鉱炉*1,レッドブラッド*10',
	'携帯用溶鉱炉*1,クリスタルブルー*10',
	'携帯用溶鉱炉*1,ウィンドオブヴェルデュール*10',
	'携帯用溶鉱炉*1,イエローライブ*10',
	'携帯用溶鉱炉*1,星の粉*10',
];

/**
 * 鉱石製造系 タブのコントロールを初期化する。
 * @param {boolean} initial 初回の場合はtrue。それ以外の場合はfalse。
 */
function initializeOreTemperingControls(initial = false) {
	var i, baseBrewingRate, itemBrewingRate;

	// 鉄製造成功率 = [45 + (鉄製造Lv * 5) + (JobLv * 0.2) (DEX * 0.1) + (LUK * 0.1)]%
	baseBrewingRate = 45
	                + params['p_IronTemperingLv'] * 5
	                + params['p_JobLv'] * 0.2
	                + (params['p_BaseDEX'] + params['p_AddDEX']) * 0.1
	                + (params['p_BaseLUK'] + params['p_AddLUK']) * 0.1
	                ;
	itemBrewingRate = bindValue(baseBrewingRate / 100.0, 0.00, 1.00);

	// アイテム一覧
	for (i = 0; i < IronTemperingItemCount; i++) {
		$('#p_IronTemperingBrewingRate_' + i).text(formatRate(itemBrewingRate));
		$('#p_IronTemperingCost_' + i).text(calculateCost(IronTemperingCostItems[i], itemBrewingRate));
	}

	// 鋼鉄製造成功率 = [35 + (鋼鉄製造Lv * 5) + (JobLv * 0.2) (DEX * 0.1) + (LUK * 0.1)]%
	baseBrewingRate = 35
	                + params['p_SteelTemperingLv'] * 5
	                + params['p_JobLv'] * 0.2
	                + (params['p_BaseDEX'] + params['p_AddDEX']) * 0.1
	                + (params['p_BaseLUK'] + params['p_AddLUK']) * 0.1
	                ;
	itemBrewingRate = bindValue(baseBrewingRate / 100.0, 0.00, 1.00);

	// アイテム一覧
	for (i = 0; i < SteelTemperingItemCount; i++) {
		$('#p_SteelTemperingBrewingRate_' + i).text(formatRate(itemBrewingRate));
		$('#p_SteelTemperingCost_' + i).text(calculateCost(SteelTemperingCostItems[i], itemBrewingRate));
	}

	// 属性石製造成功率 = [15 + (属性石製造Lv * 5) + (JobLv * 0.2) (DEX * 0.1) + (LUK * 0.1)]%
	baseBrewingRate = 15
	                + params['p_EnchantedStoneCraftLv'] * 5
	                + params['p_JobLv'] * 0.2
	                + (params['p_BaseDEX'] + params['p_AddDEX']) * 0.1
	                + (params['p_BaseLUK'] + params['p_AddLUK']) * 0.1
	                ;
	itemBrewingRate = bindValue(baseBrewingRate / 100.0, 0.00, 1.00);

	// アイテム一覧
	for (i = 0; i < EnchantedStoneCraftItemCount; i++) {
		$('#p_EnchantedStoneCraftBrewingRate_' + i).text(formatRate(itemBrewingRate));
		$('#p_EnchantedStoneCraftCost_' + i).text(calculateCost(EnchantedStoneCraftCostItems[i], itemBrewingRate));
	}
}

///////////////////////////////////////////////////////////
// 武器製作
///////////////////////////////////////////////////////////

/** 武器製作 情報一覧 */
var SmithItemInfos = [
	// 短剣
	{ itemID: 1201,	itemName: 'ナイフ',					itemType: 'Dagger',			itemLevel: 1,	costItems: '鋼鉄の金槌*1,鉄*1,ゼロピー*10' },
	{ itemID: 1204,	itemName: 'カッター',				itemType: 'Dagger',			itemLevel: 1,	costItems: '鋼鉄の金槌*1,鉄*25' },
	{ itemID: 1207,	itemName: 'マインゴーシュ',			itemType: 'Dagger',			itemLevel: 1,	costItems: '鋼鉄の金槌*1,鉄*50' },
	{ itemID: 1210,	itemName: 'ダーク',					itemType: 'Dagger',			itemLevel: 2,	costItems: '黄金の金槌*1,鋼鉄*17' },
	{ itemID: 1213,	itemName: 'ダガー',					itemType: 'Dagger',			itemLevel: 2,	costItems: '黄金の金槌*1,鋼鉄*30' },
	{ itemID: 1216,	itemName: 'スティレット',			itemType: 'Dagger',			itemLevel: 2,	costItems: '黄金の金槌*1,鋼鉄*40' },
	{ itemID: 1219,	itemName: 'グラディウス',			itemType: 'Dagger',			itemLevel: 3,	costItems: 'オリデオコンの金槌*1,オリデオコン*4,鋼鉄*40,サファイア*1' },
	{ itemID: 1222,	itemName: 'ダマスカス',				itemType: 'Dagger',			itemLevel: 3,	costItems: 'オリデオコンの金槌*1,オリデオコン*4,鋼鉄*60,ジルコン*1' },

	// 剣
	{ itemID: 1101,	itemName: 'ソード',					itemType: 'Sword',			itemLevel: 1,	costItems: '鋼鉄の金槌*1,鉄*2' },
	{ itemID: 1104,	itemName: 'ファルシオン',			itemType: 'Sword',			itemLevel: 1,	costItems: '鋼鉄の金槌*1,鉄*30' },
	{ itemID: 1107,	itemName: 'ブレイド',				itemType: 'Sword',			itemLevel: 1,	costItems: '鋼鉄の金槌*1,鉄*45,こうもりの牙*25' },
	{ itemID: 1112,	itemName: 'レイピア',				itemType: 'Sword',			itemLevel: 2,	costItems: '黄金の金槌*1,鋼鉄*20' },
	{ itemID: 1113,	itemName: 'シミター',				itemType: 'Sword',			itemLevel: 2,	costItems: '黄金の金槌*1,鋼鉄*35' },
	{ itemID: 1122,	itemName: '環頭太刀',				itemType: 'Sword',			itemLevel: 2,	costItems: '黄金の金槌*1,鋼鉄*40,狼の爪*50' },
	{ itemID: 1126,	itemName: 'サーベル',				itemType: 'Sword',			itemLevel: 3,	costItems: 'オリデオコンの金槌*1,オリデオコン*8,鋼鉄*5,オパール*1' },
	{ itemID: 1123,	itemName: '海東剣',					itemType: 'Sword',			itemLevel: 3,	costItems: 'オリデオコンの金槌*1,オリデオコン*8,鋼鉄*10,トパーズ*1' },
	{ itemID: 1119,	itemName: 'ツルギ',					itemType: 'Sword',			itemLevel: 3,	costItems: 'オリデオコンの金槌*1,オリデオコン*8,鋼鉄*15,ガーネット*1' },
	{ itemID: 1129,	itemName: 'フランベルジェ',			itemType: 'Sword',			itemLevel: 3,	costItems: 'オリデオコンの金槌*1,オリデオコン*16,呪われたルビー*1' },

	// 両手剣
	{ itemID: 1116,	itemName: 'カタナ',					itemType: 'TwoHandedSword',	itemLevel: 1,	costItems: '鋼鉄の金槌*1,鉄*35,亡者の牙*15' },
	{ itemID: 1151,	itemName: 'スレイヤー',				itemType: 'TwoHandedSword',	itemLevel: 2,	costItems: '黄金の金槌*1,鋼鉄*25,亡者の爪*20' },
	{ itemID: 1154,	itemName: 'バスタードソード',		itemType: 'TwoHandedSword',	itemLevel: 2,	costItems: '黄金の金槌*1,鋼鉄*45' },
	{ itemID: 1157,	itemName: 'ツーハンドソード',		itemType: 'TwoHandedSword',	itemLevel: 3,	costItems: 'オリデオコンの金槌*1,オリデオコン*12,鋼鉄*10' },
	{ itemID: 1160,	itemName: 'ブロードソード',			itemType: 'TwoHandedSword',	itemLevel: 3,	costItems: 'オリデオコンの金槌*1,オリデオコン*12,鋼鉄*20' },
	{ itemID: 1163,	itemName: 'クレイモア',				itemType: 'TwoHandedSword',	itemLevel: 3,	costItems: 'オリデオコンの金槌*1,オリデオコン*16,鋼鉄*20,損傷したダイヤモンド*1' },

	// 槍
	{ itemID: 1401,	itemName: 'ジャベリン',				itemType: 'Spear',			itemLevel: 1,	costItems: '鋼鉄の金槌*1,鉄*3' },
	{ itemID: 1404,	itemName: 'スピアー',				itemType: 'Spear',			itemLevel: 1,	costItems: '鋼鉄の金槌*1,鉄*35' },
	{ itemID: 1407,	itemName: 'パイク',					itemType: 'Spear',			itemLevel: 1,	costItems: '鋼鉄の金槌*1,鉄*70' },
	{ itemID: 1451,	itemName: 'ギザルム',				itemType: 'Spear',			itemLevel: 2,	costItems: '黄金の金槌*1,鋼鉄*25' },
	{ itemID: 1454,	itemName: 'グレイヴ',				itemType: 'Spear',			itemLevel: 2,	costItems: '黄金の金槌*1,鋼鉄*40' },
	{ itemID: 1457,	itemName: 'パルチザン',				itemType: 'Spear',			itemLevel: 2,	costItems: '黄金の金槌*1,鋼鉄*55' },
	{ itemID: 1460,	itemName: 'トライデント',			itemType: 'Spear',			itemLevel: 3,	costItems: 'オリデオコンの金槌*1,オリデオコン*8,鋼鉄*10,アクアマリン*5' },
	{ itemID: 1463,	itemName: 'ハルバード',				itemType: 'Spear',			itemLevel: 3,	costItems: 'オリデオコンの金槌*1,オリデオコン*12,鋼鉄*10' },
	{ itemID: 1410,	itemName: 'ランス',					itemType: 'Spear',			itemLevel: 3,	costItems: 'オリデオコンの金槌*1,オリデオコン*12,ルビー*3,悪魔の角*2' },

	// 斧
	{ itemID: 1301,	itemName: 'アックス',				itemType: 'Axe',			itemLevel: 1,	costItems: '鋼鉄の金槌*1,鉄*10' },
	{ itemID: 1351,	itemName: 'バトルアックス',			itemType: 'Axe',			itemLevel: 1,	costItems: '鋼鉄の金槌*1,鉄*110' },
	{ itemID: 1354,	itemName: 'ハンマー',				itemType: 'Axe',			itemLevel: 2,	costItems: '黄金の金槌*1,鋼鉄*30' },
	{ itemID: 1357,	itemName: 'バスター',				itemType: 'Axe',			itemLevel: 3,	costItems: 'オリデオコンの金槌*1,オリデオコン*4,鋼鉄*20,オークの牙*30' },
	{ itemID: 1360,	itemName: 'ツーハンドアックス',		itemType: 'Axe',			itemLevel: 3,	costItems: 'オリデオコンの金槌*1,オリデオコン*8,鋼鉄*10,アメジスト*1' },

	// ナックル
	{ itemID: 1801,	itemName: 'バグナウ',				itemType: 'BrassKnuckle',	itemLevel: 1,	costItems: '鋼鉄の金槌*1,鉄*160,真珠*1' },
	{ itemID: 1803,	itemName: 'ナックルダスター',		itemType: 'BrassKnuckle',	itemLevel: 2,	costItems: '黄金の金槌*1,鋼鉄*50' },
	{ itemID: 1805,	itemName: 'ホラ',					itemType: 'BrassKnuckle',	itemLevel: 2,	costItems: '黄金の金槌*1,鋼鉄*65' },
	{ itemID: 1807,	itemName: 'フィスト',				itemType: 'BrassKnuckle',	itemLevel: 3,	costItems: 'オリデオコンの金槌*1,オリデオコン*4,ルビー*10' },
	{ itemID: 1809,	itemName: 'クロー',					itemType: 'BrassKnuckle',	itemLevel: 3,	costItems: 'オリデオコンの金槌*1,オリデオコン*8,トパーズ*10' },
	{ itemID: 1811,	itemName: 'フィンガー',				itemType: 'BrassKnuckle',	itemLevel: 3,	costItems: 'オリデオコンの金槌*1,オリデオコン*4,オパール*10' },

	// メイス
	{ itemID: 1501,	itemName: 'クラブ',					itemType: 'Mace',			itemLevel: 1,	costItems: '鋼鉄の金槌*1,鉄*3' },
	{ itemID: 1504,	itemName: 'メイス',					itemType: 'Mace',			itemLevel: 1,	costItems: '鋼鉄の金槌*1,鉄*30' },
	{ itemID: 1507,	itemName: 'スマッシャー',			itemType: 'Mace',			itemLevel: 2,	costItems: '黄金の金槌*1,鋼鉄*20' },
	{ itemID: 1510,	itemName: 'フレイル',				itemType: 'Mace',			itemLevel: 2,	costItems: '黄金の金槌*1,鋼鉄*33' },
	{ itemID: 1519,	itemName: 'チェイン',				itemType: 'Mace',			itemLevel: 2,	costItems: '黄金の金槌*1,鋼鉄*45' },
	{ itemID: 1513,	itemName: 'モーニングスター',		itemType: 'Mace',			itemLevel: 3,	costItems: 'オリデオコンの金槌*1,鋼鉄*85,ダイヤモンド1カラット*1' },
	{ itemID: 1516,	itemName: 'ソードメイス',			itemType: 'Mace',			itemLevel: 3,	costItems: 'オリデオコンの金槌*1,鋼鉄*100,鋭い鱗*20' },
	{ itemID: 1522,	itemName: 'スタナー',				itemType: 'Mace',			itemLevel: 3,	costItems: 'オリデオコンの金槌*1,鋼鉄*120,オーク勇者の証*1' },
];

/** 武器製作 アイテム種別一覧 */
var SmithItemTypes = [
	'Dagger',
	'Sword',
	'TwoHandedSword',
	'Spear',
	'Axe',
	'BrassKnuckle',
	'Mace',
];

/** 武器製作 組み合わせ一覧 */
var SmithCombinations = [
	// OP0
	{ combiRate:   0,	combiItems: '' },
	// OP1
	{ combiRate: -25,	combiItems: ',フレイムハート*1' },
	{ combiRate: -25,	combiItems: ',ミスティックフローズン*1' },
	{ combiRate: -25,	combiItems: ',ラフウィンド*1' },
	{ combiRate: -25,	combiItems: ',グレイトネイチャ*1' },
	{ combiRate: -15,	combiItems: ',星のかけら*1' },
	// OP2
	{ combiRate: -40,	combiItems: ',フレイムハート*1,星のかけら*1' },
	{ combiRate: -40,	combiItems: ',ミスティックフローズン*1,星のかけら*1' },
	{ combiRate: -40,	combiItems: ',ラフウィンド*1,星のかけら*1' },
	{ combiRate: -40,	combiItems: ',グレイトネイチャ*1,星のかけら*1' },
	{ combiRate: -30,	combiItems: ',星のかけら*2' },
	// OP3
	{ combiRate: -55,	combiItems: ',フレイムハート*1,星のかけら*2' },
	{ combiRate: -55,	combiItems: ',ミスティックフローズン*1,星のかけら*2' },
	{ combiRate: -55,	combiItems: ',ラフウィンド*1,星のかけら*2' },
	{ combiRate: -55,	combiItems: ',グレイトネイチャ*1,星のかけら*2' },
	{ combiRate: -45,	combiItems: ',星のかけら*3' },
];

/**
 * 武器製作 タブのコントロールを初期化する。
 * @param {boolean} initial 初回の場合はtrue。それ以外の場合はfalse。
 */
function initializeSmithControls(initial = false) {
	var i, c, r;
	var baseBrewingRate, combiBrewingRate, totalBrewingRate;
	var itemInfo, combiInfo, baseKey, combiKey, rateLogs = {};

	// 初回の場合、コントロールを構築
	if (initial) {
		var itemIndex, itemType;
		$.each(SmithItemTypes, function(itemIndex, itemType) {
			$('#smith' + itemType + 'Tabs').tabs();
		});
	}

	for (i = 0; i < SmithItemInfos.length; i++) {
		itemInfo = SmithItemInfos[i];
		baseKey = itemInfo['itemType'] + "-" + itemInfo['itemLevel'];

		// 計算済みの場合は取り出す
		if (baseKey in rateLogs) {
			baseBrewingRate = rateLogs[baseKey];
		} else {
			// 基本成功率 = [45 + (製作Lv * 5) + (武器研究Lv) + (金敷補正) + (メカニックボーナス 4) + (JobLv * 0.2) + (DEX * 0.1) + (LUK * 0.1) + (15 - 武器Lv * 15)]%
			baseBrewingRate = 45
							+ params['p_Smith' + itemInfo['itemType'] + 'Lv'] * 5
							+ params['p_WeaponryResearchLv']
							+ params['p_Anvil']
							+ (params['p_Job'] == 3 ? 4 : 0)
							+ params['p_JobLv'] * 0.2
							+ (params['p_BaseDEX'] + params['p_AddDEX']) * 0.1
							+ (params['p_BaseLUK'] + params['p_AddLUK']) * 0.1
							+ (15 - itemInfo['itemLevel'] * 15)
							;
			// 計算済みとして追加
			rateLogs[baseKey] = baseBrewingRate;
		}

		// 組み合わせの計算
		for (c = 0; c < SmithCombinations.length; c++) {
			combiInfo = SmithCombinations[c];
			combiKey = baseKey + "-C" + c;

			// 計算済みの場合は取り出す
			if (combiKey in rateLogs) {
				combiBrewingRate = rateLogs[combiKey];
			} else {
				// 組み合わせ成功率 = 基本成功率 + [- (属性石個数 * 25) - (星のかけら個数 * 15)]%
				combiBrewingRate = baseBrewingRate + combiInfo['combiRate'];

				// 乱数込み成功率 = 組み合わせ成功率 + [Random[-5,5]]%
				totalBrewingRate = 0;
				for (r = -5; r <= 5; r++) {
					totalBrewingRate += Math.min(100.00, combiBrewingRate + r) / 11;
				}
				combiBrewingRate = totalBrewingRate;
				// 計算済みとして追加
				rateLogs[combiKey] = combiBrewingRate;
			}

			// 表示
			totalBrewingRate = bindValue(combiBrewingRate / 100.00, 0.00, 1.00)
			$('#p_SmithBrewingRate_C' + c + '_' + i).text('' + formatRate(totalBrewingRate));
			$('#p_SmithItemCost_C' + c + '_' + i).text('' + calculateCost(itemInfo['costItems'] + combiInfo['combiItems'], totalBrewingRate));
		}
	}
}

///////////////////////////////////////////////////////////
// 原価
///////////////////////////////////////////////////////////

/** 原価アイテム名一覧 */
var CostItemNames = [
	// 0x
	'携帯用溶鉱炉', '鋼鉄の金槌', '黄金の金槌', 'オリデオコンの金槌', '鉄鉱石',
	'鉄', '鋼鉄', '石炭', 'レッドブラッド', 'フレイムハート',
	// 1x
	'クリスタルブルー', 'ミスティックフローズン', 'ウィンドオブヴェルデュール', 'ラフウィンド', 'イエローライブ',
	'グレイトネイチャ', '星の粉', '星のかけら', 'オリデオコン', 'アクアマリン',
	// 2x
	'悪魔の角', 'アメジスト', '狼の爪', 'オパール', 'オークの牙',
	'オーク勇者の証', 'ガーネット', 'こうもりの牙', 'サファイア', '真珠',
	// 3x
	'ジルコン', '鋭い鱗', 'ゼロピー', '損傷したダイヤモンド', 'ダイヤモンド1カラット',
	'トパーズ', '呪われたルビー', '亡者の牙', '亡者の爪', 'ルビー',
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
					initializeCreateDeadlyPoisonControls();
					initializeCreateNewPoisonControls();
				}
			});
		}
	}
}
