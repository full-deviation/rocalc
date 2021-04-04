///////////////////////////////////////////////////////////
// ROツール - クエスト集計 - まじぽたさんすう
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
var localStorageKey = "ROQuestTable";

/** 入力パラメータ */
var params = {
	characterSlots: 15, // キャラクタースロット数
};

/** 最大キャラクタースロット数 */
var maxCharacterSlots = 15 * 12; // 12アカウントでPT組んでいる人を見たことがあるのでそれ×15スロットまで

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
		// キャラクタースロット数が減っている場合、キャラクタースロット数を超える分を削除
		for (i = 1; i <= maxCharacterSlots; i++) {
			var key = 'Character' + i;
			if ((key in params) && (i > params['characterSlots'])) {
				delete params[key];
			}
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

		$('#p_CharacterSlots').val(params['characterSlots']);
		recreateCharacterSlotRelatedControls(params['characterSlots']);
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
	initializeQuestTableControls(true);

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

		// キャラクタースロット数
		$('#p_CharacterSlots').spinner({
			min: 1,
			max: maxCharacterSlots,
			change: function() {
				params['characterSlots'] = $(this).val();
				// コントロールの再構築
				recreateCharacterSlotRelatedControls(params['characterSlots']);
			},
		});
		$('#p_CharacterSlots').val(params['characterSlots']);

		// 入力先
		$('#p_InputTarget').selectmenu();

		// 取込ボタン
		$('#storeButton').button().on('click', function() {
			// パラメータに格納
			var index = parseInt($('#p_InputTarget').val());
			var key = (index == 0 ? 'AllQuests' : 'Character' + index);
			params[key] = cutoutValidLines($('#p_InputContent').val());

			// 次の入力のためにクリア
			$('#p_InputContent').val('');

			// 反映
			initializeQuestTableControls();
		});

		// クリアボタン
		$('#clearButton').button().on('click', function() {
			$('#p_InputContent').val('');
		});
	}
}

/**
 * キャラクタースロット数に影響を受けるコントロールの再構築。
 * @param {number} characterSlots キャラクタースロット数。
 */
function recreateCharacterSlotRelatedControls(characterSlots) {

	// 入力先
	var inputTargetSelect = $('#p_InputTarget');

	// 全要素の削除
	inputTargetSelect.find('option').remove();

	// すべて
	inputTargetSelect.append('<option value="0" selected="selected">全て/ストーリー/イベント タブ</option>');

	// キャラクタースロット
	for (i = 1; i <= characterSlots; i++) {
		inputTargetSelect.append('<option value="' + i + '">キャラクター ' + i + ' の完了タブ</option>');
	}

	// 設定が終わったらリフレッシュ
	inputTargetSelect.selectmenu('refresh');

	// クリア人数フィルタ
	var filterContent = '';
	var filterHeader = '', filterData = '';
	for (i = 1; i <= characterSlots; i++) {
		// 1, 14, 27 ... 行の開始を追加
		if ((i % 15) == 1) {
			filterHeader = '<tr>';
			filterData = '<tr>';
		}

		filterHeader += '<th>' + i + '名</th>';
		filterData += '<td><input type="checkbox" name="p_ClearRateFilters[]" checked="checked" value="' + i + '" /></td>';

		// 15, 30, 45 ... 行の終了を追加後、本体に合流
		if ((i % 15) == 0) {
			filterHeader += '</tr>';
			filterData += '</tr>';
			filterContent += filterHeader + filterData;

			// 空にする
			filterHeader = '';
			filterData = '';
		}
	}
	// フィルタのテーブル内容が空でない場合、テーブルの終了を追加
	if (filterHeader != '') {
		filterHeader += '</thead></tr>';
		filterData += '</tbody></tr>';
		filterContent += filterHeader + filterData;
	}
	// 
	$('#p_ClearRateFilterTable').find('tr').remove();
	$('#p_ClearRateFilterTable').append(filterContent);

	// クリア状況
	var questHeader = '<th>クエスト名</th><th>クリア人数</th>';
	for (i = 1; i <= characterSlots; i++) {
		questHeader += '<th>' + i + '</th>';
	}
	$('#p_QuestHeader').find('th').remove();
	$('#p_QuestHeader').append(questHeader);

	// クエスト一覧の更新
	initializeQuestTableControls();
}

/**
 * 有効な内容を持つ行の一覧を配列として取得する。
 * @param {string} text 入力内容のテキスト。
 * @param {boolean} distinct 重複を排除する場合はtrue。重複も含める場合はfalse。
 * @returns {Array} 有効な内容を持つ行の一覧。
 */
function cutoutValidLines(text, distinct = true) {
	var lines = text.split(/(\r\n|\r|\n)/);

	// 空でない行のうち重複していないもののみ抜き出す
	var validLines = [];
	$.each(lines, function(index, line) {
		var trimedLine = line.replace(/^\s+|\s+$/g, '');
		if ((trimedLine !== '') && ((validLines.indexOf(trimedLine) === -1) || (!distinct))) {
			validLines.push(trimedLine);
		}
	});

	return validLines;
}

///////////////////////////////////////////////////////////
// クエスト表
///////////////////////////////////////////////////////////

/** クリア人数フィルタ処理中 */
var clearRateFilterChanging = false;

/**
 * チャットログ タブのコントロールを初期化する。
 * @param {boolean} initial 初回の場合はtrue。それ以外の場合はfalse。
 */
function initializeQuestTableControls(initial = false) {

	// 初回の場合、コントロールを初期化
	if (initial) {
		// クリア人数フィルタ: すべて
		$('#p_ClearRateFilter_All').change(function() {
			// 変更中でない場合のみ
			if (!clearRateFilterChanging) {
				clearRateFilterChanging = true;
				try {
					// 個別のチェックボックスをすべて合わせる
					$('input[name="p_ClearRateFilters[]"]').prop('checked', $(this).prop('checked') ? true : false);
				}
				finally {
					clearRateFilterChanging = false;
				}
			}

			// 表示内容を更新
			initializeQuestTableControls();
		});

		// クリア人数フィルタ: 人数別
		$(document).on('change', 'input[name="p_ClearRateFilters[]"]', function() {
			// 変更中でない場合のみ
			if (!clearRateFilterChanging) {
				clearRateFilterChanging = true;
				try {
					var allStatus = true;
					// 個別のチェックボックスにチェックされていないものが存在する場合、すべてをfalseにする
					$('input[name="p_ClearRateFilters[]"]').each(function() {
						if (!$(this).prop('checked')) {
							allStatus = false;
						}
					});
					$('#p_ClearRateFilter_All').prop('checked', allStatus);
				}
				finally {
					clearRateFilterChanging = false;
				}
			}

			// 表示内容を更新
			initializeQuestTableControls();
		});

		// CSV出力
		$('#csvButton').button().on('click', function() { outputCsv(); });
	}

	// フィルタ取得
	var filters = [];
	$('input[name="p_ClearRateFilters[]"]:checked').each(function() {
		filters.push(parseInt($(this).val()));
	});

	// Allが存在する場合はAll、それ以外の場合はすべてのキャラクターに1つ以上は含まれる完了を取り出す
	var allQuests;
	if ('AllQuests' in params) {
		allQuests = params['AllQuests'];
	}
	else {
		allQuests = [];
		$.each(params, function(key, clearedQuests) {
			if (key.match(/^Character\d+/g))
			$.each(clearedQuests, function(index, quest) {
				if (allQuests.indexOf(quest) === -1) {
					allQuests.push(quest);
				}
			});
		});
	}

	// クリア表の中身をクリアする
	var tbody = $('#p_TableBody');
	tbody.find('tr').remove();

	// クリア表を構築する
	$.each(allQuests, function(index, quest) {
		var clearedFlags = [];
		var clearedCount = 0;

		// キャラクター01～15のクリア状況を確認
		for (i = 0; i < params['characterSlots']; i++) {
			clearedFlags[i] = false;
			var characterKey = 'Character' + (i + 1);
			if (characterKey in params) {
				var clearedQuests = params[characterKey];
				if (clearedQuests.indexOf(quest) !== -1) {
					clearedFlags[i] = true;
					clearedCount++;
				}
			}
		}

		// クリア人数がフィルタに一致する場合は行を構築
		if (filters.indexOf(clearedCount) != -1) {
			var rowData = '<tr>';

			// クエスト名
			rowData += '<th class="identify">' + quest + '</th>';

			// クリア人数
			rowData += '<td class="numeric">' + clearedCount + '</td>';

			// クリア一覧
			$.each(clearedFlags, function(index, flag) {
				rowData += '<td>' + (flag ? '○' : '×') + '</td>';
			});

			rowData += '</tr>';

			tbody.append(rowData);
		}
	});
}

/**
 * CSVファイル出力を行う。
 */
function outputCsv() {

	// フィルタ取得
	var filters = [];
	$('input[name="p_ClearRateFilters[]"]:checked').each(function() {
		filters.push(parseInt($(this).val()));
	});

	// Allが存在する場合はAll、それ以外の場合はすべてのキャラクターに1つ以上は含まれる完了を取り出す
	var allQuests;
	if ('AllQuests' in params) {
		allQuests = params['AllQuests'];
	}
	else {
		allQuests = [];
		$.each(params, function(key, clearedQuests) {
			if (key.match(/^Character\d+/g))
			$.each(clearedQuests, function(index, quest) {
				if (allQuests.indexOf(quest) === -1) {
					allQuests.push(quest);
				}
			});
		});
	}

	// CSV作成開始
	var csvLines = 'クエスト名,クリア人数';
	for (i = 0; i < params['characterSlots']; i++) {
		csvLines += ',スロット' + (i + 1);
	}
	csvLines += nl;

	// クリア表を構築する
	$.each(allQuests, function(index, quest) {
		var clearedFlags = [];
		var clearedCount = 0;

		// キャラクター01～15のクリア状況を確認
		for (i = 0; i < params['characterSlots']; i++) {
			clearedFlags[i] = false;
			var characterKey = 'Character' + (i + 1);
			if (characterKey in params) {
				var clearedQuests = params[characterKey];
				if (clearedQuests.indexOf(quest) !== -1) {
					clearedFlags[i] = true;
					clearedCount++;
				}
			}
		}

		// クリア人数がフィルタに一致する場合は行を構築
		if (filters.indexOf(clearedCount) != -1) {
			// クエスト名,クリア人数
			csvLines += '"' + quest + '",' + clearedCount;

			// クリア一覧
			$.each(clearedFlags, function(index, flag) {
				csvLines += ',' + (flag ? '○' : '×');
			});

			csvLines += nl;
		}
	});

	// BOM
	var bom = new Uint8Array([0xef, 0xbb, 0xbf]);

	// BLOBオブジェクト
	var blob = new Blob([bom, csvLines], { type: 'text/csv' });

	// URLオブジェクト
	var url = (window.URL || window.webkitURL).createObjectURL(blob);

	// 隠しリンクタグを編集してクリックしたことにする
	var anchor = $('#downloader');
	anchor.attr('download', localStorageKey + '_' + getYYYYMMDD() + '.csv');
	anchor.attr('href', url);
	anchor[0].click();
}