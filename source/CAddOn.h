#ifndef __CADD_ON_H
#define	__CADD_ON_H

#include <napi.h>

// アドオンクラス
class CAddOn : public Napi::ObjectWrap<CAddOn>
{
private:
	// JavaScript コンストラクタインスタンス
	static Napi::FunctionReference s_constructor;
	// JavaScript からコールされる関数
	Napi::Value _call_fib( const Napi::CallbackInfo& info ) ;

public:
	// コンストラクタ・デストラクタ
	CAddOn(const Napi::CallbackInfo& info) ;
	virtual ~CAddOn() {}
	// 初期化関数
	static Napi::Object _init( const Napi::Env env, Napi::Object exports ) ;
} ;

#endif

