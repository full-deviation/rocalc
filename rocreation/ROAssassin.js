///////////////////////////////////////////////////////////
// RO製造計算機 - アサシン系列
///////////////////////////////////////////////////////////

/** 更新停止 */
var isSuspending = false;

/** COOKIEキー */
var cookieName = 'ROAssassin';

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

	// ステータス
	p_BaseDEX:	1,	p_AddDEX:	7,
	p_BaseLUK:	1,	p_AddLUK:	2,

	// スキル
	p_CreateDeadlyPoisonLv:	 1,
	p_ResearhNewPoisonLv:	10,
	p_CreateNewPoisonLv:	 1,

	// ワールド
	p_World:	15, // 15:Noatun

	// 新毒製造/Random分解能(0.01%) … 廃止
	p_CreateNewPoisionRandomResolution: 100,

	// 原価/価格
	p_Cost_0:	1300,	p_Cost_1:	250,
	p_Cost_2:	1200,	p_Cost_3:	1000,
	p_Cost_4:	800,	p_Cost_5:	0,
	p_Cost_6:	1700,	p_Cost_7:	500,
	p_Cost_8:	500,	p_Cost_9:	5000,
	p_Cost_10:	100,	p_Cost_11:	2000,
	p_Cost_12:	2000,	p_Cost_13:	1000,
	p_Cost_14:	1000,	p_Cost_15:	1250,
	p_Cost_16:	1000,	p_Cost_17:	8,
	p_Cost_18:	300,	p_Cost_19:	1000,
	p_Cost_20:	2280,	p_Cost_21:	500,
	p_Cost_22:	1200,	p_Cost_23:	800,
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
	initializeCreateDeadlyPoisonControls();
	initializeCreateNewPoisonControls();
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
	for (i = 0; i < CreateDeadlyPoisonCostItems.length; i++) {
		$('#p_CreateDeadlyPoisonItemName_' + i).prop('title', CreateDeadlyPoisonCostItems[i].replace(/,/g, tooltipDelimiter));
	}
	for (i = 0; i < CreateNewPoisonCostItems.length; i++) {
		$('#p_CreateNewPoisonItemName_' + i).prop('title', CreateNewPoisonCostItems[i].replace(/,/g, tooltipDelimiter));
	}
	$(document).tooltip();

	// タブ
	$('#mainTabs').tabs();

	// 各タブの初期化
	initializeParamControls(true);
	initializeCreateDeadlyPoisonControls(true);
	initializeCreateNewPoisonControls(true);
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

	if (initial) {
		// レベル
		$('#p_JobLv').spinner({ min: 1, max:  70, change: function() { recalculateControls(); } });

		// ステータス
		$('#p_BaseDEX').spinner({ min: 1, max: 999, change: function() { recalculateControls(); } });
		$('#p_AddDEX' ).spinner({ min: 0, max: 999, change: function() { recalculateControls(); } });

		$('#p_BaseLUK').spinner({ min: 1, max: 999, change: function() { recalculateControls(); } });
		$('#p_AddLUK' ).spinner({ min: 0, max: 999, change: function() { recalculateControls(); } });

		// スキル
		$('#p_CreateDeadlyPoisonLv').spinner({ min: 0, max:  1, change: function() { recalculateControls(); } });	// クリエイトデッドリーポイズン
		$('#p_ResearhNewPoisonLv'  ).spinner({ min: 0, max: 10, change: function() { recalculateControls(); } });	// 新毒研究
		$('#p_CreateNewPoisonLv'   ).spinner({ min: 0, max:  1, change: function() { recalculateControls(); } });	// 新毒製造

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
// クリエイトデッドリーポイズン
///////////////////////////////////////////////////////////

/** クリエイトデッドリーポイズン 総数 */
var CreateDeadlyPoisonItemCount = 1;

/** クリエイトデッドリーポイズン 原価材料一覧 */
var CreateDeadlyPoisonCostItems = [
	'バーサークポーション*1,毒の牙*1,サボテンの針*1,ハチの針*1,毒キノコの胞子*1,空きビン*1,カルボーディル*1',	// 毒薬の瓶
];

/**
 * クリエイトデッドリーポイズン タブのコントロールを初期化する。
 * @param {boolean} initial 初回の場合はtrue。それ以外の場合はfalse。
 */
function initializeCreateDeadlyPoisonControls(initial = false) {
	var i, baseBrewingRate, itemBrewingRate;

	// 成功率 = [20 + (DEX * 0.4) + (LUK * 0.2)]%
	baseBrewingRate = 20
	                + (params['p_BaseDEX'] + params['p_AddDEX']) * 0.4
	                + (params['p_BaseLUK'] + params['p_AddLUK']) * 0.2
	                ;
	itemBrewingRate = bindValue(baseBrewingRate / 100.0, 0.00, 1.00);

	// アイテム一覧
	for (i = 0; i < CreateDeadlyPoisonItemCount; i++) {
		$('#p_CreateDeadlyPoisonBrewingRate_' + i).text(formatRate(itemBrewingRate));
		$('#p_CreateDeadlyPoisonCost_' + i).text(calculateCost(CreateDeadlyPoisonCostItems[i], itemBrewingRate));
	}
}

///////////////////////////////////////////////////////////
// 新毒製造
///////////////////////////////////////////////////////////

/** 新毒製造 総数 */
var CreateNewPoisonItemCount = 9;

/** 新毒製造 原価材料一覧 */
var CreateNewPoisonCostItems = [
	'ガマ蛙の皮*20,毒草アモエナ*1,毒製造キット*1,乳鉢*1',	// パラライズ
	'アノリアンの皮膚*20,毒草ランタナ*1,毒製造キット*1,乳鉢*1',	// パイクレシア
	'亡者の爪*25,毒草セラタム*1,毒製造キット*1,乳鉢*1',	// デスハート
	'毒草スコボリア*1,毒草ネリウム*1,毒製造キット*1,乳鉢*1',	// リーチエンド
	'青ハーブ*1,白ハーブ*1,緑ハーブ*2',	// 解毒剤
	'ベトベトな毒*10,イジドル*1,毒製造キット*1,乳鉢*1',	// ベナムブリード
	'毒キノコの胞子*10,毒草マキュラータ*1,毒製造キット*1,乳鉢*1',	// マジックマッシュルーム
	'ベトベトな毒*10,毒草ネリウム*1,毒製造キット*1,乳鉢*1',	// トキシン
	'人魚の心臓*10,イジドル*1,毒製造キット*1,乳鉢*1',	// オブリビオンカース
];

/**
 * 新毒製造 タブのコントロールを初期化する。
 * @param {boolean} initial 初回の場合はtrue。それ以外の場合はfalse。
 */
function initializeCreateNewPoisonControls(initial = false) {
	var i, r, rateTotal, rateCount;
	var baseBrewingRate, totalBrewingRate;
	var brewingCount;

	// 基本成功率 = [30 + (新毒研究Lv * 5) + (JobLv * 0.05) + (DEX * 0.05) + (LUK * 0.1)]%
	baseBrewingRate = 30
	                + params['p_ResearhNewPoisonLv'] * 5
	                + params['p_JobLv'] * 0.05
	                + (params['p_BaseDEX'] + params['p_AddDEX']) * 0.05
	                + (params['p_BaseLUK'] + params['p_AddLUK']) * 0.1
	                ;

	// 変動成功率 = 基本成功率 + Random[-5,5]%
	rateTotal = 0;
	rateCount = 0;
	for (r = -5; r <= 5; r++) {
		rateTotal += Math.min(100.00, baseBrewingRate + r) / 11;
	}
	totalBrewingRate = bindValue(rateTotal / 100.0, 0.00, 1.00);
	$('#p_CreateNewPoisonBrewingRate').text('' + formatRate(totalBrewingRate));

	// 個数 = (Floor[1.5 + 新毒研究Lv * 0.5] + Floor[4.0 + 新毒研究 * 0.5]) / 2
	brewingCount = (Math.floor(1.5 + params['p_ResearhNewPoisonLv'] * 0.5)
				 +  Math.floor(4.0 + params['p_ResearhNewPoisonLv'] * 0.5)) / 2.0;
	$('#p_CreateNewPoisonAverageCount').text('' + formatRate(brewingCount / 100.0));

	// 原価
	for (i = 0; i < CreateNewPoisonItemCount; i++) {
		$('#p_CreateNewPoisonCost_' + i).text('' + calculateCost(CreateNewPoisonCostItems[i], brewingCount * totalBrewingRate));
	}
}

///////////////////////////////////////////////////////////
// 原価
///////////////////////////////////////////////////////////

/** 原価アイテム名一覧 */
var CostItemNames = [
	// 0x
	'青ハーブ', '空きビン', 'アノリアンの皮膚', 'イジドル', 'カルボーディル',
	'ガマ蛙の皮', 'サボテンの針', '白ハーブ', '毒キノコの胞子', '毒製造キット',
	// 1x
	'毒草アモエナ', '毒草スコボリア', '毒草セラタム', '毒草ネリウム', '毒草マキュラータ',
	'毒草ランタナ', '毒の牙', '乳鉢', '人魚の心臓', 'ハチの針',
	// 2x
	'バーサークポーション', 'ベトベトな毒', '緑ハーブ', '亡者の爪',
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
