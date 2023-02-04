///////////////////////////////////////////////////////////
// ROツール - 周回精錬 - まじぽたさんすう
///////////////////////////////////////////////////////////

/** 更新停止 */
var isSuspending = false;

/** COOKIE設定 */
var cookieSettings = {
	expires:	3650,
	domain:		'magipota.gozaru.jp',
	path:		'/rocreation/',
};

/** ローカルストレージキー */
var localStorageKey = "RORefine";

/** 入力パラメータ */
var params = {
	rate5:	78,
	rate6:	50,
	rate7:	48,
	rate8:	23,
	rate9:	22,
	rate10:	10,
};

/** 入力パラメータ未入力の場合 */
var defaultParams = {
	rate5:	78,
	rate6:	50,
	rate7:	48,
	rate8:	23,
	rate9:	22,
	rate10:	10,
};

/** 記録する最小精錬値成功率 */
var minLevel = 5;

/** 記録する最大精錬値成功率 */
var maxLevel = 10;

/** 安全な精錬値 */
var safeLevel = 4;

/** ミラクル精錬の成功率 */
var miracleSuccessRates = [1, 1, 1, 1, 1, 0.55, 0.35, 0.1052, 0.075, 0.0325, 0.01625, 0];

/** 改行コード */
var nl = "\r\n";

/**
 * ローカルストレージが使用可能かどうかを返す。
 * @returns {boolean} ローカルストレージが使用可能な場合はtrue。使用不可の場合はfalse。
 */
function localStorageAvailable() {
	try {
		// 使用可能かテスト
		var storage = window['localStorage'];
		var testKey = 'local_storage_test_for_use';
		storage.setItem(testKey, 'yes');
		storage.removeItem(testKey);
		return true;
	}
	catch(e) {
		return (e instanceof DOMException) &&
		       (e.code ===   22 ||
		        e.code === 1014 ||
		        e.name === 'QuotaExceededError' ||
		        e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
		       (storage.length !== 0);
	}
}

/**
 * 入力内容をローカルストレージに保存する。
 */
function saveLocalStorage() {

	// ローカルストレージが有効の場合、JSON形式で保存
	if (localStorageAvailable()) {
		// 精錬値別の成功率
		for (i = minLevel; i <= maxLevel; i++) {
			params['rate' + i] = $('#p_Rate' + i).val();
		}

		localStorage.setItem(localStorageKey, JSON.stringify(params));
	}
}

/**
 * ローカルストレージから入力内容を構築する。
 */
function loadLocalStorage() {

	// ローカルストレージが有効でキーが存在する場合、JSON形式から戻す
	if (localStorageAvailable() && (localStorage.getItem(localStorageKey) != null)) {
		params = JSON.parse(localStorage.getItem(localStorageKey));
		
		// 精錬値別の成功率
		for (i = minLevel; i <= maxLevel; i++) {
			$('#p_Rate' + i).val(params['rate' + i]);
		}
	}
	// 上記以外はデフォルト値を提示
	else {
		// 精錬値別の成功率
		for (i = minLevel; i <= maxLevel; i++) {
			$('#p_Rate' + i).val(defaultParams['rate' + i]);
		}
	}
}

/**
 * ローカルストレージから入力内容を削除する。
 */
function resetLocalStorage() {

	// ローカルストレージが有効でキーが存在する場合、キーを削除
	if (localStorageAvailable() && (localStorage.getItem(localStorageKey) != null)) {
		localStorage.removeItem(localStorageKey);
	}

	// リロード
	location.reload(true);
}

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
 * 年月日をYYYYMMDD形式にしたものを返す。
 * @returns {string} YYYYMMDD形式の年月日。
 */
function getYYYYMMDD() {
	var now = new Date();
	return '' + now.getFullYear() +
	       ('0' + (now.getMonth() + 1)).slice(-2) +
	       ('0' + (now.getDate()     )).slice(-2);
}

/**
 * 読み込みが終わった後で初期化を行う。
 */
$(function() {
	var isOfficialSite, canSave;

	// トップに戻るは本サイト上でのみ表示し、作者情報は本サイト以外で表示する
	isOfficialSite = (location.hostname === cookieSettings['domain']);
	$('#to-Top'      ).css('display', isOfficialSite ? 'inline' : 'none' );
	$('#about-Author').css('display', isOfficialSite ? 'none'   : 'block');

	// ローカルストレージが使用できない場合、保存不可のメッセージを表示し
	canSave = localStorageAvailable();
	$('#not-Supported').css('display', canSave ? 'none' : 'block');
	$('#saveButton' ).button().on('click', function() { saveLocalStorage();  }).css('display', canSave ? 'block' : 'none');
	$('#resetButton').button().on('click', function() { resetLocalStorage(); }).css('display', canSave ? 'block' : 'none');

	// タブ
	$('#mainTabs').tabs();

	// コントロールの初期化
	initializeInputControls(true);

	// 保存した入力内容があれば復元する
	loadLocalStorage();
});

///////////////////////////////////////////////////////////
// 入力
///////////////////////////////////////////////////////////

/**
 * 入力 タブのコントロールを初期化する。
 * @param {boolean} initial 初回の場合はtrue。それ以外の場合はfalse。
 */
function initializeInputControls(initial = false) {

	// 初回の場合、コントロールを初期化
	if (initial) {

		// 精錬値別の成功率
		for (i = minLevel; i <= maxLevel; i++) {
			$('#p_Rate' + i).spinner({
				min: 0,
				max: 100});
		}

		// 精錬値
		$('#p_StartLevel').selectmenu();
		$('#p_EndLevel').selectmenu();

		// 方式
		$('#p_RefineType').selectmenu();

		// 回数
		$('#p_TryCount').spinner({ min: 1, max: 99999});

		// 開始ボタン
		$('#startButton').button().on('click', function() {
			executeRefine();
		});

		// クリアボタン
		$('#clearButton').button().on('click', function() {
			$('#p_ResultBody').find('tr').remove();
		});
	}
}

///////////////////////////////////////////////////////////
// 精錬値表
///////////////////////////////////////////////////////////

/**
 * 精錬を実行します。
 */
function executeRefine() {

	// 結果をクリア
	var tbody = $('#p_ResultBody');
	tbody.find('tr').remove();

	// パラメータ
	var startLevel = parseInt($('#p_StartLevel').val());
	var endLevel = parseInt($('#p_EndLevel').val());
	var refineType = $('#p_RefineType').val(); // Improved: 改良濃縮, Ultimate: 究極, Miracle: ミラクル
	var tryCount = parseInt($('#p_TryCount').val());
	var onlyLast = $('#p_OnlyLast').prop('checked');

	// 成功率: 計算方式の関係上+11まで箱を用意する
	var successRates = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0];

	// ミラクル精錬のみ入力値の影響を受けない
	if (refineType == 'Miracle') {
		successRates = miracleSuccessRates;
	}
	else {
		for (i = minLevel; i <= maxLevel; i++) {
			successRates[i] = $('#p_Rate' + i).val() / 100.0;
		}
	}

	// 選択結果のデバッグ表示
	console.debug(refineType + ': +' + startLevel + ' -> +' + endLevel + ' ' + tryCount + ' times');
	for (i = minLevel; i <= maxLevel; i++) {
		console.debug('+' + i + ' success rate: ' + successRates[i]);
	}

	// 初期状態
	var currentRates = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	currentRates[startLevel] = 1;

	// 計算開始
	for (tryCurrent = 1; tryCurrent <= tryCount; tryCurrent++) {
		// 計算
		var nextRates = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		switch (refineType) {
			case 'Improved': // 改良濃縮精錬
				nextRates[safeLevel] = 1;
				for (level = minLevel; level <= maxLevel; level++) {

					// 終了精錬値-1未満: 前回の精錬値-1 * 精錬値+0への成功率 + 前回の精錬値+1 * (100% - 精錬値+2への成功率)
					if (level < endLevel - 1) {
						nextRates[level] = currentRates[level - 1] * successRates[level]
										+ currentRates[level + 1] * (1 - successRates[level + 2]);
					}
					// 終了精錬値-1: 前回の精錬値-1 * 精錬値+0への成功率 ※終了精錬値から降りてこないので
					else if (level == endLevel - 1) {
						nextRates[level] = currentRates[level - 1] * successRates[level];
					}
					// 終了精錬値: 前回の精錬値-1 * 精錬値への成功率 + 前回の精錬値+0
					else if (level == endLevel) {
						nextRates[level] = currentRates[level - 1] * successRates[level]
										+ currentRates[level];
					}
					// 上記以外: 0%
					else {
						nextRates[level] = 0;
					}
					nextRates[safeLevel] -= nextRates[level];
				}
				break;

			case 'Ultimate': // 究極精錬
				nextRates[safeLevel] = 1;
				for (level = minLevel; level <= maxLevel; level++) {
					// 開始精錬値未満: 0%
					if (level < startLevel) {
						nextRates[level] = 0;
					}
					// 終了精錬値未満: 前回の精錬値-1 * 精錬値+0への成功率 + 前回の精錬値+0 * (100% - 精錬値+1への成功率)
					else if (level < endLevel) {
						nextRates[level] = currentRates[level - 1] * successRates[level]
										 + currentRates[level] * (1 - successRates[level + 1]);
					}
					// 終了精錬値: 前回の精錬値-1 * 精錬値への成功率 + 前回の精錬値+0
					else if (level == endLevel) {
						nextRates[level] = currentRates[level - 1] * successRates[level]
										 + currentRates[level];
					}
					// 上記以外: 0%
					else {
						nextRates[level] = 0;
					}
					// 安全圏から引く
					nextRates[safeLevel] -= nextRates[level];
				}
				break;

			case 'Miracle': // ミラクル精錬
				nextRates[safeLevel] = 1;
				for (level = minLevel; level <= maxLevel; level++) {
					// 終了精錬値未満: 前回の精錬値-1 * 精錬値+0への成功率
					if (level < endLevel) {
						nextRates[level] = currentRates[level - 1] * successRates[level];
					}
					// 終了精錬値: 前回の精錬値-1 * 精錬値+0への成功率 + 前回の精錬値+0
					else if (level == endLevel) {
						nextRates[level] = currentRates[level - 1] * successRates[level]
										 + currentRates[level];
					}
					// 上記以外: 0%
					else {
						nextRates[level] = 0;
					}
					// 安全圏から引く
					nextRates[safeLevel] -= nextRates[level];
				}
				break;
		}

		// 誤差による0%未満を0%へ
		for (level = safeLevel; level <= maxLevel; level++) {
			if (nextRates[level] < 0) nextRates[level] = 0;
		}

		if ((!onlyLast) || (tryCurrent == tryCount)) {
			// 行を構築
			var rowData = '<tr>';

			// 回数
			rowData += '<th class="identify">' + tryCurrent + '回目</th>';

			// 確率
			for (level = safeLevel; level <= maxLevel; level++) {
				rowData += '<td>' + (parseInt(nextRates[level] * 1000000) / 10000).toFixed(2) + ' %</td>';
			}

			rowData += '</tr>';

			tbody.append(rowData);
		}

		// 移し替え
		currentRates = nextRates;
	}
}
