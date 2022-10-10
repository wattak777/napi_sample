const express = require('express') ;
const app = express() ;
const url = require('url') ;

const { Worker } = require('worker_threads') ;

app.get('/start', (req, res) =>
{
	console.log('start API.') ;
	var url_parse = url.parse(req.url, true) ;
	var worker = new Worker('./worker.js') ;
	var msg_start = '' ;
	var msg_end = '' ;

	// ワーカースレッドとの I/F
	worker.on('message', msg => {
		const { action, message } = msg ;
		// 経過アクション
		if ( action === 'progress' ) {
			msg_start = message ;
			console.log(msg_start) ;
		// 完了アクション
		} else if ( action === 'finish' ) {
			// 終了時刻を取得
			msg_end = message ;
			console.log(msg_end) ;

			// クライアントへ送る
			const msg = msg_start + '\n' + msg_end + '\n' ;
			res.send(msg) ;
			res.end() ;
		}
	}) ;
	// ワーカースレッド起動
	worker.postMessage({ action : 'start', args : [Number(url_parse.query.number)] }) ;
}) ;

// listen
app.listen(55555, () => {
	console.log('Start. port on 55555.') ;
}) ;
