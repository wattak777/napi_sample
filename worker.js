const { parentPort } = require('worker_threads') ;
const addon = require('bindings')('addon') ;
const myAddOn = new addon.CAddOn() ;

parentPort.on('message', async msg => {
	const { action, args } = msg ;
	if ( action === 'start' ) {
		// 開始時刻を取得
		const start = new Date()
		const msg_start = 'start : ' + getStringFromDate(start) ;
		const addon = args[1] ;

		// 呼び出し元へ通知
		parentPort.postMessage({ action : 'progress', message : msg_start }) ;

		// アドオン関数コール
		result = await myAddOn.call_fib(args[0]) ;

		// 終了時刻を取得
		const end = new Date()
		const msg_end = 'end : ' + getStringFromDate(end) + '\n' + `result : ${result}` + '\n' + `lap time : ${end - start} msec.`;

		// 呼び出し元へ通知
		parentPort.postMessage({ action : 'finish', message : msg_end }) ;
	} else {
		throw new Error('Unknown action.') ;
	}
	process.exit() ;
}) ;

//日付から文字列に変換
function getStringFromDate(date)
{
	var year_str = date.getFullYear();
	var month_str = 1 + date.getMonth();
	var day_str = date.getDate();
	var hour_str = date.getHours();
	var minute_str = date.getMinutes();
	var second_str = date.getSeconds();

	month_str = ('0' + month_str).slice(-2);
	day_str = ('0' + day_str).slice(-2);
	hour_str = ('0' + hour_str).slice(-2);
	minute_str = ('0' + minute_str).slice(-2);
	second_str = ('0' + second_str).slice(-2);

	format_str = 'YYYY-MM-DD hh:mm:ss';
	format_str = format_str.replace(/YYYY/g, year_str);
	format_str = format_str.replace(/MM/g, month_str);
	format_str = format_str.replace(/DD/g, day_str);
	format_str = format_str.replace(/hh/g, hour_str);
	format_str = format_str.replace(/mm/g, minute_str);
	format_str = format_str.replace(/ss/g, second_str);

	return format_str;
};

