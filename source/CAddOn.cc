#include <iostream>
#include <napi.h>
#include "CAddOn.h"

// JavaScript のコンストラクタインスタンス
// static 宣言しているため実体の定義が必要
Napi::FunctionReference CAddOn::s_constructor;

extern "C" {
// n番目のフィボナッチ数を求める関数
uint64_t fib(int32_t n)
{
	if (n <= 1) {
		return n ;
	} else {
		return fib(n - 1) + fib(n - 2) ;
	}
}
} ;

// コンストラクタ
CAddOn::CAddOn(const Napi::CallbackInfo& info) : Napi::ObjectWrap<CAddOn>(info)
{
	std::cout << "CAddOn::constructor" << std::endl ;
}

// 初期化関数（JavaScript で new するとコールされる）
Napi::Object CAddOn::_init(const Napi::Env env, Napi::Object exports)
{
	std::cout << "_init" << std::endl ;

	// JavaScript からコールできるよう、関数を定義
	// 「addon.call_fib()」といった形で実装することでコール可能
	Napi::Function func = DefineClass(env, "CAddOn", {
		InstanceMethod("call_fib", &CAddOn::_call_fib),
	}) ;
	s_constructor = Napi::Persistent(func) ;
	s_constructor.SuppressDestruct();
	exports.Set("CAddOn", func) ;

	return exports ;
}

// _init で定義した関数の実体
Napi::Value CAddOn::_call_fib(const Napi::CallbackInfo& info)
{
	std::cout << "_call_fib" << std::endl ;

	// 引数（数値32bit）を定義
	int32_t _arg = info[0].As<Napi::Number>().Int32Value() ;

	// 関数コール
	uint64_t ret = fib(_arg) ;

	// 戻り値を JavaScript の数値で渡せるよう変換
	Napi::Number answer = Napi::Number::New(info.Env(), ret) ;

	return answer ;
}

// アドオンモジュールの初期化
Napi::Object Init(Napi::Env env, Napi::Object exports)
{
	std::cout << "Init." << std::endl ;
	return CAddOn::_init(env, exports) ;
}
// 初期化関数を登録
// ※クラスメンバ関数を直接渡せないのでグローバル関数⇒クラスの static 関数の順で呼ぶ
NODE_API_MODULE(addon, Init)

