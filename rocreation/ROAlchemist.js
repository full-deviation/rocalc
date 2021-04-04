///////////////////////////////////////////////////////////
// RO製造計算機 - アルケミスト系列 - まじぽたさんすう
///////////////////////////////////////////////////////////

/** 更新停止 */
var isSuspending = false;

/** COOKIEキー */
var cookieName = 'ROAlchemist';

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
	p_BaseLv:	175,
	p_JobLv:	 60,

	// ステータス
	p_BaseINT:	 1,	p_AddINT:	12,
	p_BaseDEX:	 1,	p_AddDEX:	 8,
	p_BaseLUK:	 1,	p_AddLUK:	 2,

	// スキル
	p_LearningPotionLv:		10,
	p_PharmacyLv:			10,
	p_SpecialPharmacyLv:	10,
	p_FullChemicalChargeLv:	 5,
	p_ChangeInstructionLv:	 5,
	p_MixedCookingLv:		 2,
	p_BombCreationLv:		 2,

	// ワールド
	p_World:	15, // 15:Noatun

	// スペシャルファーマシー/アイテム補正
	p_SpecialPharmacyItemRates_0:	0,	p_SpecialPharmacyItemRates_1:	0,
	p_SpecialPharmacyItemRates_2:	0,	p_SpecialPharmacyItemRates_3:	0,
	p_SpecialPharmacyItemRates_4:	0,	p_SpecialPharmacyItemRates_5:	0,
	p_SpecialPharmacyItemRates_6:	0,	p_SpecialPharmacyItemRates_7:	0,
	p_SpecialPharmacyItemRates_8:	0,	p_SpecialPharmacyItemRates_9:	0,
	p_SpecialPharmacyItemRates_10:	0,	p_SpecialPharmacyItemRates_11:	0,
	p_SpecialPharmacyItemRates_12:	0,

	// ミックスクッキング/アイテム補正
	p_MixedCookingItemRates_0:	0,	p_MixedCookingItemRates_1:	0,
	p_MixedCookingItemRates_2:	0,	p_MixedCookingItemRates_3:	0,
	p_MixedCookingItemRates_4:	0,	p_MixedCookingItemRates_5:	0,

	// 爆弾製造/アイテム補正
	p_BombCreationItemRates_0:	0,	p_BombCreationItemRates_1:	0,
	p_BombCreationItemRates_2:	0,	p_BombCreationItemRates_3:	0,
	p_BombCreationItemRates_4:	0,

	// 原価/価格
	p_Cost_0:	1300,	p_Cost_1:	10,
	p_Cost_2:	38,		p_Cost_3:	250,
	p_Cost_4:	13000,	p_Cost_5:	50000,
	p_Cost_6:	990,	p_Cost_7:	15200,
	p_Cost_8:	3040,	p_Cost_9:	10000,
	p_Cost_10:	380,	p_Cost_11:	1000,
	p_Cost_12:	600,	p_Cost_13:	2,
	p_Cost_14:	7,		p_Cost_15:	900,
	p_Cost_16:	300,	p_Cost_17:	300,
	p_Cost_18:	418,	p_Cost_19:	30000,
	p_Cost_20:	300,	p_Cost_21:	12500,
	p_Cost_22:	27500,	p_Cost_23:	228,
	p_Cost_24:	0,		p_Cost_25:	456,
	p_Cost_26:	22500,	p_Cost_27:	1700,
	p_Cost_28:	3800,	p_Cost_29:	300,
	p_Cost_30:	500,	p_Cost_31:	500,
	p_Cost_32:	500,	p_Cost_33:	912,
	p_Cost_34:	608,	p_Cost_35:	950,
	p_Cost_36:	45600,	p_Cost_37:	300,
	p_Cost_38:	121,	p_Cost_39:	380,
	p_Cost_40:	10000,	p_Cost_41:	304,
	p_Cost_42:	305,	p_Cost_43:	395,
	p_Cost_44:	1500,	p_Cost_45:	500,
	p_Cost_46:	1200,	p_Cost_47:	300,
	p_Cost_48:	10000,	p_Cost_49:	608,
	p_Cost_50:	8,		p_Cost_51:	300,
	p_Cost_52:	1140,	p_Cost_53:	700,
	p_Cost_54:	45,		p_Cost_55:	3500,
	p_Cost_56:	11,		p_Cost_57:	380,
	p_Cost_58:	8000,	p_Cost_59:	500,
	p_Cost_60:	456,	p_Cost_61:	300,
	p_Cost_62:	1800,	p_Cost_63:	6460,
	p_Cost_64:	1200,	p_Cost_65:	700,
	p_Cost_66:	500,	p_Cost_67:	10,
	p_Cost_68:	500,	p_Cost_69:	228,
	p_Cost_70:	11,		p_Cost_71:	580,
	p_Cost_72:	1000,	p_Cost_73:	4600,
	p_Cost_74:	532,	p_Cost_75:	532,
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
	initializePharmacyControls();
	initializeSpecialPharmacyControls();
	initializeMixedCookingControls();
	initializeBombCreationControls();
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
	for (i = 0; i < PharmacyCostItems.length; i++) {
		$('#p_PharmacyItemName_' + i).prop('title', PharmacyCostItems[i].replace(/,/g, tooltipDelimiter));
	}
	for (i = 0; i < SpecialPharmacyCostItems.length; i++) {
		$('#p_SpecialPharmacyItemName_' + i).prop('title', SpecialPharmacyCostItems[i].replace(/,/g, tooltipDelimiter));
	}
	for (i = 0; i < MixedCookingCostItems.length; i++) {
		$('#p_MixedCookingItemName_' + i).prop('title', MixedCookingCostItems[i].replace(/,/g, tooltipDelimiter));
	}
	for (i = 0; i < BombCreationCostItems.length; i++) {
		$('#p_BombCreationItemName_' + i).prop('title', BombCreationCostItems[i].replace(/,/g, tooltipDelimiter));
	}
	$(document).tooltip();

	// タブ
	$('#mainTabs').tabs();

	// 各タブの初期化
	initializeParamControls(true);
	initializePharmacyControls(true);
	initializeSpecialPharmacyControls(true);
	initializeMixedCookingControls(true);
	initializeBombCreationControls(true);
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
		$('#p_BaseLv').spinner({ min: 1, max: 185, change: function() { recalculateControls(); } });
		$('#p_JobLv' ).spinner({ min: 1, max:  70, change: function() { recalculateControls(); } });

		// ステータス
		$('#p_BaseINT').spinner({ min: 1, max: 999, change: function() { recalculateControls(); } });
		$('#p_AddINT' ).spinner({ min: 0, max: 999, change: function() { recalculateControls(); } });

		$('#p_BaseDEX').spinner({ min: 1, max: 999, change: function() { recalculateControls(); } });
		$('#p_AddDEX' ).spinner({ min: 0, max: 999, change: function() { recalculateControls(); } });

		$('#p_BaseLUK').spinner({ min: 1, max: 999, change: function() { recalculateControls(); } });
		$('#p_AddLUK' ).spinner({ min: 0, max: 999, change: function() { recalculateControls(); } });

		// スキル
		$('#p_LearningPotionLv'    ).spinner({ min: 0, max: 10, change: function() { recalculateControls(); } });	// ラーニングポーション
		$('#p_PharmacyLv'          ).spinner({ min: 0, max: 10, change: function() { recalculateControls(); } });	// ファーマシー
		$('#p_SpecialPharmacyLv'   ).spinner({ min: 0, max: 10, change: function() { recalculateControls(); } });	// スペシャルファーマシー
		$('#p_FullChemicalChargeLv').spinner({ min: 0, max:  5, change: function() { recalculateControls(); } });	// フルケミカルチャージ
		$('#p_ChangeInstructionLv' ).spinner({ min: 0, max:  5, change: function() { recalculateControls(); } });	// チェンジインストラクション
		$('#p_MixedCookingLv'      ).spinner({ min: 0, max:  2, change: function() { recalculateControls(); } });	// ミックスクッキング
		$('#p_BombCreationLv'      ).spinner({ min: 0, max:  2, change: function() { recalculateControls(); } });	// 爆弾製造

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
// ファーマシー
///////////////////////////////////////////////////////////

/** ファーマシー アイテム補正一覧 */
var PharmacyItemRates = [
	+20,	// [ 0] 赤ポーション
	+20,	// [ 1] 黄ポーション
	+20,	// [ 2] 白ポーション
	- 5,	// [ 3] 青ポーション
	- 5,	// [ 4] アンティペインメイン
	- 5,	// [ 5] アロエベラ
	- 5,	// [ 6] エンブリオ
	- 5,	// [ 7] レッドスリムポーション
	- 7.5,	// [ 8] イエロースリムポーション
	-10,	// [ 9] ホワイトスリムポーション
	+10,	// [10] アルコール
	+ 0,	// [11] ファイアーボトル
	+ 0,	// [12] アシッドボトル
	+ 0,	// [13] プラントボトル
	+ 0,	// [14] マインボトル
	-10,	// [15] コーティング薬
	- 5,	// [16] レジストファイアポーション
	- 5,	// [17] レジストコールドポーション
	- 5,	// [18] レジストウィンドポーション
	- 5,	// [19] レジストアースポーション
];

/** ファーマシー 原価材料一覧 */
var PharmacyCostItems = [
	'乳鉢*1,空のポーション瓶*1,赤ハーブ*1',
	'乳鉢*1,空のポーション瓶*1,黄ハーブ*1',
	'乳鉢*1,空のポーション瓶*1,白ハーブ*1',
	'乳鉢*1,空のポーション瓶*1,青ハーブ*1,セルー*1',
	'乳鉢*1,空きビン*1,メント*1,アルコール*1',
	'乳鉢*1,空きビン*1,アロエ*1,ハチ蜜*1',
	'乳鉢*1,飼育ポット*1,イグドラシルの露*1,生命の種*1',
	'乳鉢*1,空の試験管*1,赤ポーション*1,サボテンの針*1',
	'乳鉢*1,空の試験管*1,黄ポーション*1,土竜のひげ*1',
	'乳鉢*1,空の試験管*1,白ポーション*1,魔女の星の砂*1',
	'乳鉢*1,空きビン*1,空の試験管*1,毒キノコの胞子*5,植物の茎*5',
	'乳鉢*1,空きビン*1,アルコール*1,透明な布*1',
	'乳鉢*1,空きビン*1,止まらない心臓*1',
	'乳鉢*1,空きビン*1,食人植物の花*2',
	'乳鉢*1,空きビン*1,雷管*1,血管*1',
	'乳鉢*1,空きビン*1,アルコール*1,人魚の心臓*1,ゼノークの歯*1',
	'乳鉢*1,空のポーション瓶*1,トカゲの襟巻*2,レッドジェムストーン*1',
	'乳鉢*1,空のポーション瓶*1,人魚の心臓*3,ブルージェムストーン*1',
	'乳鉢*1,空のポーション瓶*1,蛾の羽粉*3,ブルージェムストーン*1',
	'乳鉢*1,空のポーション瓶*1,でっかいゼロピー*2,イエロージェムストーン*1',
];

/**
 * ファーマシー タブのコントロールを初期化する。
 * @param {boolean} initial 初回の場合はtrue。それ以外の場合はfalse。
 */
function initializePharmacyControls(initial = false) {
	var i, baseBrewingRate, itemBrewingRate;

	// 初回の場合、コントロールを構築
	if (initial) {
		// アイテム一覧
		for (i = 0; i < PharmacyItemRates.length; i++) {
			$('#p_PharmacyItemRates_' + i).text('' + PharmacyItemRates[i]);
		}
	}

	// 成功率 = [(ファーマシーLv * 3) + ラーニングポーションLv + チェンジインストラクションLv
	//        + (JobLv * 0.2) + (DEX * 0.1) + (LUK * 0.1) + (INT * 0.05) + アイテム補正 - 5]%
	baseBrewingRate = params['p_PharmacyLv'] * 3
	                + params['p_LearningPotionLv']
	                + params['p_ChangeInstructionLv']
	                + params['p_JobLv'] * 0.2
	                + (params['p_BaseDEX'] + params['p_AddDEX']) * 0.1
	                + (params['p_BaseLUK'] + params['p_AddLUK']) * 0.1
	                + (params['p_BaseINT'] + params['p_AddINT']) * 0.05
	                - 5
	                ;

	// アイテム一覧
	for (i = 0; i < PharmacyItemRates.length; i++) {
		itemBrewingRate = bindValue((baseBrewingRate + PharmacyItemRates[i]) / 100.0, 0.00, 1.00);
		$('#p_PharmacyBrewingRate_' + i).text(formatRate(itemBrewingRate));
		$('#p_PharmacyCost_' + i).text(calculateCost(PharmacyCostItems[i], itemBrewingRate));
	}
}

///////////////////////////////////////////////////////////
// スペシャルファーマシー
///////////////////////////////////////////////////////////

/** スペシャルファーマシー 総数 */
var SpecialPharmacyItemCount = 13;

/** スペシャルファーマシー 原価材料一覧 */
var SpecialPharmacyCostItems = [
	'トゲの実*10',
	'食人植物の根*10',
	'きのこの胞子*10,毒キノコの胞子*5,ガンパウダー*2',
	'空の試験管*10,白ポーション*20,白ハーブ*10,アルコール*1',
	'空の試験管*10,ブドウ*10,ハチ蜜*10,青ハーブ*10',
	'空の試験管*10,ハイスピードポーション*5,スピードアップポーション*5,辛口ソース*5',
	'空の試験管*10,万能薬*5,緑ハーブ*20,マステラの実*1,イグドラシルの葉*1',
	'空きビン*10,化け物のエサ*5,白ハーブ*10,辛口ソース*1',
	'空きビン*10,白ハーブ*10,黄ハーブ*10,辛口ソース*1',
	'空きビン*10,白ハーブ*15,マステラの実*3,聖水*1,辛口ソース*1',
	'空きビン*10,レモン*10,ブドウ*10,甘口ソース*1',
	'空きビン*10,ハチ蜜*10,青ハーブ*10,甘口ソース*1',
	'空きビン*10,ローヤルゼリー*10,青ハーブ*15,甘口ソース*1',
];

/**
 * スペシャルファーマシー タブのコントロールを初期化する。
 * @param {boolean} initial 初回の場合はtrue。それ以外の場合はfalse。
 */
function initializeSpecialPharmacyControls(initial = false) {
	var i, r1, r2, rate, rates, rateCount, rateAverage;
	var baseBrewingCount, baseBrewingRate, itemBrewingRate, totalBrewingRate;

	// 初回の場合、コントロールを構築
	if (initial) {
		for (i = 0; i < SpecialPharmacyItemCount; i++) {
			$('#p_SpecialPharmacyItemRates_' + i).spinner({
				min: -999,
				max:  999,
				change: function() {
					controlsToParams();
					initializeSpecialPharmacyControls();
				}
			});
		}
	}

	// 最低保証個数 = Floor[1 + (スペシャルファーマシーLv * 0.5)]
	baseBrewingCount = Math.floor(1 + params['p_SpecialPharmacyLv'] * 0.5);

	// 個数一覧
	$('#p_SpecialPharmacy_Plus6_Header').text((baseBrewingCount + 6) + '個(%)');
	$('#p_SpecialPharmacy_Plus3_Header').text((baseBrewingCount + 3) + '個(%)');
	$('#p_SpecialPharmacy_Plus2_Header').text((baseBrewingCount + 2) + '個(%)');
	$('#p_SpecialPharmacy_Plus1_Header').text((baseBrewingCount + 1) + '個(%)');
	$('#p_SpecialPharmacy_Plus0_Header').text((baseBrewingCount + 0) + '個(%)');

	// 基本成功値 = INT + (DEX / 2) + LUK + JobLv + (BaseLv - 100) 
	//            + (ラーニングポーションLv * 5)
	//            - 620 + (スペシャルファーマシーLv × 20)
	baseBrewingRate = (params['p_BaseDEX'] + params['p_AddDEX']) * 0.5
	                + (params['p_BaseLUK'] + params['p_AddLUK']) * 1
	                + (params['p_BaseINT'] + params['p_AddINT']) * 1
	                + params['p_LearningPotionLv']
	                + params['p_JobLv']
	                + (params['p_BaseLv'] - 100)
	                - 620
	                + (params['p_SpecialPharmacyLv'] * 20)
	                ;


	// アイテム補正と変動値を基に計算
	// 基本成功値 + Random[30,150] + (フルケミカルチャージLv * Random[4,10]) - アイテム補正
	for (i = 0; i < SpecialPharmacyItemCount; i++) {
		rates = {Plus6: 0, Plus3: 0, Plus2: 0, Plus1: 0, Plus0: 0};
		rateCount = 0;
		itemBrewingRate = $('#p_SpecialPharmacyItemRates_' + i).val();

		// 計算
		for (r1 = 30; r1 <= 150; r1++) {
			for (r2 = 4; r2 <= 10; r2++) {
				totalBrewingRate = baseBrewingRate + r1
				                 + (params['p_FullChemicalChargeLv'] * r2)
				                 - itemBrewingRate;

				// 振り分け
				     if (totalBrewingRate > 400) rates['Plus6']++;
				else if (totalBrewingRate > 300) rates['Plus3']++;
				else if (totalBrewingRate > 100) rates['Plus2']++;
				else if (totalBrewingRate >   1) rates['Plus1']++;
				else                             rates['Plus0']++;

				rateCount++;
			}
		}

		// 表示 name: Plus*, value: rate
		$.each(rates, function(name, value) {
			rate = value * 1.0 / rateCount;
			$('#p_SpecialPharmacyBrewingRate_' + name + '_' + i).text('' + formatRate(rate));
		});

		// 平均
		rateAverage = (baseBrewingCount + 6) * (rates['Plus6'] * 1.0 / rateCount)
		            + (baseBrewingCount + 3) * (rates['Plus3'] * 1.0 / rateCount)
		            + (baseBrewingCount + 2) * (rates['Plus2'] * 1.0 / rateCount)
		            + (baseBrewingCount + 1) * (rates['Plus1'] * 1.0 / rateCount)
		            + (baseBrewingCount + 0) * (rates['Plus0'] * 1.0 / rateCount)
		            ;

		// 原価
		$('#p_SpecialPharmacyBrewingRate_Average_' + i).text('' + formatRate(rateAverage / 100));
		$('#p_SpecialPharmacyCost_' + i).text('' + calculateCost(SpecialPharmacyCostItems[i], rateAverage));
	}
}

///////////////////////////////////////////////////////////
// ミックスクッキング
///////////////////////////////////////////////////////////

/** ミックスクッキング 総数 */
var MixedCookingItemCount = 6;

/** ミックスクッキング 原価材料一覧 */
var MixedCookingCostItems = [
	'ごった煮の壺*1,サベージの肉*1,料理用鉄串*1,黒炭*1',
	'ごった煮の壺*1,大きい鍋*1,ドロセラの触手*3,赤ハーブ*3,白ハーブ*3,青ハーブ*3',
	'ごった煮の壺*1,大きい鍋*1,牛カルビ*2',
	'ごった煮の壺*1,狼の血*3,冷たい氷*2',
	'ごった煮の壺*1,氷の破片*3,氷の結晶*2,トロピカルフルーツ*1',
	'ごった煮の壺*1,プティットの尻尾*2,素麺*1,冷たい出汁*1',
];

/**
 * ミックスクッキング タブのコントロールを初期化する。
 * @param {boolean} initial 初回の場合はtrue。それ以外の場合はfalse。
 */
function initializeMixedCookingControls(initial = false) {
	var i, r, rate, rates, rateCount, rateAverage;
	var baseBrewingRate, itemBrewingRate, totalBrewingRate;

	// 初回の場合、コントロールを構築
	if (initial) {
		for (i = 0; i < MixedCookingItemCount; i++) {
			$('#p_MixedCookingItemRates_' + i).spinner({
				min: -999,
				max:  999,
				change: function() {
					controlsToParams();
					initializeMixedCookingControls();
				}
			});
		}
	}

	// 基本成功値 = (JobLv / 4) + (DEX / 3) + (LUK / 2)
	baseBrewingRate = params['p_JobLv'] / 4
	                + (params['p_BaseDEX'] + params['p_AddDEX']) / 4
	                + (params['p_BaseLUK'] + params['p_AddLUK']) / 2
	                ;

	// アイテム補正と変動値を基に計算
	// 基本成功値 - Random[30,150] - アイテム補正
	for (i = 0; i < MixedCookingItemCount; i++) {
		rates = {Count11: 0, Count10: 0, Count8: 0, Count5: 0, Count1: 0, Count0: 0};
		rateCount = 0;
		itemBrewingRate = $('#p_MixedCookingItemRates_' + i).val();

		// 計算
		for (r = 30; r <= 150; r++) {
			totalBrewingRate = baseBrewingRate
			                 - r
			                 - itemBrewingRate;

			// 振り分け
			switch (params['p_MixedCookingLv']) {
				case 1: // Lv1
					if (totalBrewingRate > 0) rates['Count1']++;
					else                      rates['Count0']++;
					break;

				case 2: // Lv2
					     if (totalBrewingRate >   30) rates['Count11']++;
					else if (totalBrewingRate >   10) rates['Count10']++;
					else if (totalBrewingRate >= -10) rates['Count8']++;
					else if (totalBrewingRate >  -30) rates['Count5']++;
					else                              rates['Count0']++;
					break;
			}

			rateCount++;
		}

		// 表示 name: Count*, value: rate
		$.each(rates, function(name, value) {
			rate = value * 1.0 / rateCount;
			$('#p_MixedCookingBrewingRate_' + name + '_' + i).text('' + formatRate(rate));
		});

		// 平均
		rateAverage = 11 * (rates['Count11'] * 1.0 / rateCount)
		            + 10 * (rates['Count10'] * 1.0 / rateCount)
		            +  8 * (rates['Count8']  * 1.0 / rateCount)
		            +  5 * (rates['Count5']  * 1.0 / rateCount)
		            +  1 * (rates['Count1']  * 1.0 / rateCount)
		            ;
		$('#p_MixedCookingBrewingRate_Average_' + i).text('' + formatRate(rateAverage / 100));

		// 原価
		switch (params['p_MixedCookingLv']) {
			case 1: // Lv1
				$('#p_MixedCookingCost_' + i).text('' + calculateCost(MixedCookingCostItems[i], rateAverage));
				break;

			case 2: // Lv2 … 消費材料は10個分のため平均を10で割る
				$('#p_MixedCookingCost_' + i).text('' + calculateCost(MixedCookingCostItems[i], rateAverage / 10));
				break;
		}
	}
}

///////////////////////////////////////////////////////////
// 爆弾製造
///////////////////////////////////////////////////////////

/** 爆弾製造 総数 */
var BombCreationItemCount = 5;

/** 爆弾製造 原価材料一覧 */
var BombCreationCostItems = [
	'雷管*1,ガンパウダー*1,リンゴ*1,セルー*1',
	'雷管*1,ガンパウダー*4,バナナ*1,カビの粉*1',
	'雷管*1,ガンパウダー*2,メロン*1,べとべとする液体*1',
	'雷管*1,ガンパウダー*3,パイナップル*1,サボテンの針*1',
	'雷管*1,ガンパウダー*2,ココナッツの実*1',
];

/**
 * 爆弾製造 タブのコントロールを初期化する。
 * @param {boolean} initial 初回の場合はtrue。それ以外の場合はfalse。
 */
function initializeBombCreationControls(initial = false) {
	var i, r, rate, rates, rateCount, rateAverage;
	var baseBrewingRate, itemBrewingRate, totalBrewingRate;

	// 初回の場合、コントロールを構築
	if (initial) {
		for (i = 0; i < BombCreationItemCount; i++) {
			$('#p_BombCreationItemRates_' + i).spinner({
				min: -999,
				max:  999,
				change: function() {
					controlsToParams();
					initializeBombCreationControls();
				}
			});
		}
	}

	// 基本成功値 = (JobLv / 4) + (DEX / 3) + (LUK / 2)
	baseBrewingRate = params['p_JobLv'] / 4
	                + (params['p_BaseDEX'] + params['p_AddDEX']) / 4
	                + (params['p_BaseLUK'] + params['p_AddLUK']) / 2
	                ;

	// アイテム補正と変動値を基に計算
	// 基本成功値 - Random[30,150] - アイテム補正
	for (i = 0; i < BombCreationItemCount; i++) {
		rates = {Count11: 0, Count10: 0, Count8: 0, Count5: 0, Count1: 0, Count0: 0};
		rateCount = 0;
		itemBrewingRate = $('#p_BombCreationItemRates_' + i).val();

		// 計算
		for (r = 30; r <= 150; r++) {
			totalBrewingRate = baseBrewingRate
			                 - r
			                 - itemBrewingRate;

			// 振り分け
			switch (params['p_BombCreationLv']) {
				case 1: // Lv1
					if (totalBrewingRate > 0) rates['Count1']++;
					else                      rates['Count0']++;
					break;

				case 2: // Lv2
					     if (totalBrewingRate >   30) rates['Count11']++;
					else if (totalBrewingRate >   10) rates['Count10']++;
					else if (totalBrewingRate >= -10) rates['Count8']++;
					else if (totalBrewingRate >  -30) rates['Count5']++;
					else                              rates['Count0']++;
					break;
			}

			rateCount++;
		}

		// 表示 name: Count*, value: rate
		$.each(rates, function(name, value) {
			rate = value * 1.0 / rateCount;
			$('#p_BombCreationBrewingRate_' + name + '_' + i).text('' + formatRate(rate));
		});

		// 平均
		rateAverage = 11 * (rates['Count11'] * 1.0 / rateCount)
		            + 10 * (rates['Count10'] * 1.0 / rateCount)
		            +  8 * (rates['Count8']  * 1.0 / rateCount)
		            +  5 * (rates['Count5']  * 1.0 / rateCount)
		            +  1 * (rates['Count1']  * 1.0 / rateCount)
		            ;
		$('#p_BombCreationBrewingRate_Average_' + i).text('' + formatRate(rateAverage / 100));

		// 原価
		switch (params['p_BombCreationLv']) {
			case 1: // Lv1
				$('#p_BombCreationCost_' + i).text('' + calculateCost(BombCreationCostItems[i], rateAverage));
				break;

			case 2: // Lv2 … 消費材料は10個分のため平均を10で割る
				$('#p_BombCreationCost_' + i).text('' + calculateCost(BombCreationCostItems[i], rateAverage / 10));
				break;
		}

	}
}

///////////////////////////////////////////////////////////
// 原価
///////////////////////////////////////////////////////////

/** 原価アイテム名一覧 */
var CostItemNames = [
	// 0x
	'青ハーブ', '赤ハーブ', '赤ポーション', '空きビン', 'アルコール',
	'アロエ', 'イエロージェムストーン', 'イグドラシルの露', 'イグドラシルの葉', '狼の血',
	// 1x
	'大きい鍋', '蛾の羽粉', 'カビの粉', '空の試験管', '空のポーション瓶',
	'ガンパウダー', 'きのこの胞子', '黄ハーブ', '黄ポーション', '牛カルビ',
	// 2x
	'血管', '氷の結晶', '氷の破片', '黒炭', 'ココナッツの実',
	'ごった煮の壺', 'サベージの肉', 'サボテンの針', '飼育ポット', '食人植物の根',
	// 3x
	'食人植物の花', '植物の茎', '白ハーブ', '白ポーション', 'スピードアップポーション',
	'聖水', '生命の種', 'ゼノークの歯', 'セルー', '素麺',
	// 4x
	'冷たい氷', '冷たい出汁', 'でっかいゼロピー', '透明な布', 'トカゲの襟巻',
	'毒キノコの胞子', 'トゲの実', '止まらない心臓', 'ドロセラの触手', 'トロピカルフルーツ',
	// 5x
	'乳鉢', '人魚の心臓', 'ハイスピードポーション', 'パイナップル', '化け物のエサ',
	'ハチ蜜', 'バナナ', '万能薬', 'プティットの尻尾', 'ブドウ',
	// 6x
	'ブルージェムストーン', 'べとべとする液体', '魔女の星の砂', 'マステラの実', '緑ハーブ',
	'メロン', 'メント', '土竜のひげ', '雷管', '料理用鉄串',
	// 7x
	'リンゴ', 'レッドジェムストーン', 'レモン', 'ローヤルゼリー','甘口ソース',
	'辛口ソース',
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
					initializePharmacyControls();
					initializeSpecialPharmacyControls();
					initializeMixedCookingControls();
					initializeBombCreationControls();
				}
			});
		}
	}
}
