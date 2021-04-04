///////////////////////////////////////////////////////////
// RO製造計算機 - ナイト系列 - まじぽたさんすう
///////////////////////////////////////////////////////////

/** 更新停止 */
var isSuspending = false;

/** COOKIEキー */
var cookieName = 'ROKnight';

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
	p_JobLv:	 60,

	// ステータス
	p_BaseDEX:	1,	p_AddDEX:	8,
	p_BaseLUK:	1,	p_AddLUK:	4,

	// スキル
	p_RuneMasteryLv:	10,

	// ワールド
	p_World:	15, // 15:Noatun

	// ルーン製造/アイテム補正
	p_RuneCreationItemRates_0:	40,	p_RuneCreationItemRates_1:	30,
	p_RuneCreationItemRates_2:	35,	p_RuneCreationItemRates_3:	40,
	p_RuneCreationItemRates_4:	40,	p_RuneCreationItemRates_5:	30,
	p_RuneCreationItemRates_6:	40,	p_RuneCreationItemRates_7:	25,
	p_RuneCreationItemRates_8:	30,	p_RuneCreationItemRates_9:	25,

	// ルーン製造/ルーン原石
	p_RuneCreationRoughStone_0:	 5,	p_RuneCreationRoughStone_1:	5,
	p_RuneCreationRoughStone_2:	 5,	p_RuneCreationRoughStone_3:	5,
	p_RuneCreationRoughStone_4:	 5,	p_RuneCreationRoughStone_5:	5,
	p_RuneCreationRoughStone_6:	 5,	p_RuneCreationRoughStone_7:	5,
	p_RuneCreationRoughStone_8:	 5,	p_RuneCreationRoughStone_9:	5,

	// 原価/価格
	p_Cost_0:	1000,	p_Cost_1:	2500,
	p_Cost_2:	1000,	p_Cost_3:	1000,
	p_Cost_4:	6750,	p_Cost_5:	2000,
	p_Cost_6:	900,	p_Cost_7:	15000,
	p_Cost_8:	600,	p_Cost_9:	3500,
	p_Cost_10:	3500,	p_Cost_11:	825,
	p_Cost_12:	600,	p_Cost_13:	3500,
	p_Cost_14:	1100,	p_Cost_15:	800,
	p_Cost_16:	3700,	p_Cost_17:	2000,
	p_Cost_18:	1000,	p_Cost_19:	3000,
	p_Cost_20:	1000,	p_Cost_21:	589,
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
	initializeRuneCreationControls();
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
	for (i = 0; i < RuneCreationCostItems.length; i++) {
		$('#p_RuneCreationItemName_' + i).prop('title', RuneCreationCostItems[i].replace(/,/g, tooltipDelimiter));
	}
	$(document).tooltip();

	// タブ
	$('#mainTabs').tabs();

	// 各タブの初期化
	initializeParamControls(true);
	initializeRuneCreationControls(true);
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
		$('#p_JobLv' ).spinner({ min: 1, max:  70, change: function() { recalculateControls(); } });

		// ステータス
		$('#p_BaseDEX').spinner({ min: 1, max: 999, change: function() { recalculateControls(); } });
		$('#p_AddDEX' ).spinner({ min: 0, max: 999, change: function() { recalculateControls(); } });

		$('#p_BaseLUK').spinner({ min: 1, max: 999, change: function() { recalculateControls(); } });
		$('#p_AddLUK' ).spinner({ min: 0, max: 999, change: function() { recalculateControls(); } });

		// スキル
		$('#p_RuneMasteryLv').spinner({ min: 0, max:  2, change: function() { recalculateControls(); } });	// ルーン製造

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
// ルーン製造
///////////////////////////////////////////////////////////

/** ルーン製造 総数 */
var RuneCreationItemCount = 10;

/** ルーン製造 原価材料一覧 */
var RuneCreationCostItems = [
	'ルーン原石*1,エルダーの枝*1,砂漠狼の爪*1,コボルドの毛*1',
	'ルーン原石*1,エルダーの枝*1,燃えている心臓*2',
	'ルーン原石*1,エルダーの枝*1,光の粒*1,ドラゴンの牙*1,縛られた鎖*1',
	'ルーン原石*1,エルダーの枝*1,ドラゴンの皮*1,丸形の皮*1',
	'ルーン原石*1,エルダーの枝*1,光の粒*1,オーガの牙*1',
	'ルーン原石*1,エルダーの枝*1,蛇模様の髪*2,ハチ蜜*1',
	'ルーン原石*1,エルダーの枝*1,光の粒*1,レッドジェムストーン*1',
	'ルーン原石*1,エルダーの枝*1,光の粒*1,古い魔法陣*1,壊れた鎧*1',
	'ルーン原石*1,エルダーの枝*1,デュラハンの鎧の欠片*1',
	'ルーン原石*1,エルダーの枝*1,光の粒*3,エンペリウム*3',
];

/**
 * ルーン製造 タブのコントロールを初期化する。
 * @param {boolean} initial 初回の場合はtrue。それ以外の場合はfalse。
 */
function initializeRuneCreationControls(initial = false) {
	var i;
	var baseBrewingRate, itemBrewingRate, totalBrewingRate;
	var baseBrewingCount, itemBrewingCount;
	var roughStoneName;

	// 初回の場合、コントロールを構築
	if (initial) {
		for (i = 0; i < RuneCreationItemCount; i++) {
			// アイテム補正
			$('#p_RuneCreationItemRates_' + i).spinner({
				min: -999,
				max:  999,
				change: function() {
					controlsToParams();
					initializeRuneCreationControls();
				}
			});

			// ルーン原石
			$('#p_RuneCreationRoughStone_' + i).selectmenu({ change: function(event, data) { recalculateControls(); } });
		}
	}

	// 基本成功率 = [(ルーンマスタリーLv * 2) + (JobLv * 0.2) + (DEX * 0.05) + (LUK * 0.05)]%
	baseBrewingRate = params['p_RuneMasteryLv'] * 2
	                + params['p_JobLv'] * 0.2
	                + (params['p_BaseDEX'] + params['p_AddDEX']) * 0.05
	                + (params['p_BaseLUK'] + params['p_AddLUK']) * 0.05
	                ;

	// 個数 ＝ 1 ～ Floor[1.0 ＋ ルーンマスタリーLv × 0.2]
	baseBrewingCount = (1 + Math.floor(1.0 + params['p_RuneMasteryLv'] * 0.2)) / 2.0;

	for (i = 0; i < RuneCreationItemCount; i++) {
		// 変動成功率 = 基本成功率 + [アイテム補正 ＋ ルーン原石補正]%
		itemBrewingRate = baseBrewingRate
		                + params['p_RuneCreationItemRates_' + i]
		                + params['p_RuneCreationRoughStone_' + i]
		                ;
		totalBrewingRate = bindValue(itemBrewingRate / 100.00, 0.00, 1.00)
		$('#p_RuneCreationBrewingRate_' + i).text('' + formatRate(totalBrewingRate));
		// 平均
		itemBrewingCount = totalBrewingRate * baseBrewingCount;
		$('#p_RuneCreationAverageCount_' + i).text('' + formatRate(itemBrewingCount / 100.0));
		// 原価
		roughStoneName = $('#p_RuneCreationRoughStone_' + i + ' option:selected').text();
		$('#p_RuneCreationCost_' + i).text('' + calculateCost(RuneCreationCostItems[i], itemBrewingCount, {
			ルーン原石: roughStoneName
		}));
	}
}

///////////////////////////////////////////////////////////
// 原価
///////////////////////////////////////////////////////////

/** 原価アイテム名一覧 */
var CostItemNames = [
	// 0x
	'一般的なルーン原石', '高級なルーン原石', '稀少なルーン原石', '古代のルーン原石', '神秘のルーン原石',
	'エルダーの枝', '光の粒', 'エンペリウム', 'オーガの牙', 'コボルドの毛',
	// 1x
	'壊れた鎧', '砂漠狼の爪', '縛られた鎖', 'デュラハンの鎧の欠片', 'ドラゴンの皮',
	'ドラゴンの牙', 'ハチ蜜', '古い魔法陣', '蛇模様の髪', '丸形の皮',
	// 2x
	'燃えている心臓', 'レッドジェムストーン',
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
					initializeRuneCreationControls();
				}
			});
		}
	}
}
