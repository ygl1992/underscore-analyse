/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2017-06-28 17:02:52
 * @version $Id$
 */

(function (){
	//基本设置、配置
	// 将this赋值给局部变量root
	var root = this;

	// 将原来全局环境中的变量‘_’赋值给变量previousUnderscore进行缓存
	// 在后面的noConflict方法中有用到
	var previousUnderscore = root._;

	// 缓存变量，便于压缩代码
	// 此处【压缩】指的是压缩到min.js版本
	var ArrayProto = Array.prototype,
		ObjProto = Object.prototype,
		FuncProto = Function.prototype;

	// 缓存变量，便于压缩代码
	// 同时可减少在原型链中的查找次数（提高效率）
	var push = ArrayProto.push,
		slice = ArrayProto.slice,
		toString = ObjProto.toString,
		hasOwnProperty = ObjProto.hasOwnProperty;

	// ES5原生方法，如果浏览器支持，则underscore中优先使用
	var nativeIsArray = Array.isArray,
		nativeKeys = Object.keys,
		nativeBind = FuncProto.bind,
		nativeCreate = Object.create;

	var Ctor = function(){};

	

}.call(this));