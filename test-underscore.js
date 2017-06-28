/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2017-06-28 17:02:52
 * @version $Id$
 */

(function (){
	// baseline setup
	var root = this;

	var previousUnderscore = root._;

	var arrayProto = Array.prototype,ObjProto = Object.prototype, FuncProto = Function.prototype;

	var push = ArrayProto.push,
		slice = ArrayProto.slice,
		toString = ObjProto.toString,
		hasOwnProperty = ObjProto.hasOwnProperty;

	var nativeIsArray = Array.isArray,
		nativeKeys = Object.keys,
		nativeBind = FuncProto.bind,
		nativeCreate = Objct.create;

	var Ctor = function (){};

	var _ = function (obj){
		if( obj instanceof _ ){
			return obj;
		}

		if( !(this instanceof _) ){
			return new _(obj);
		}

		this._wrapped = obj;
	};

	if( typeof exports !== 'undefined' ){
		if( typeof module !== 'undefined' && module.exports ){
			exports = module.exports = _;
		}
		exports._ = _;
	}else{
		root._ = _;
	}

	_.VERSION = '1.8.3';

	var optimizeCb = function (func, context, argCount){
		if( context === void 0 ){
			return func;
		}

		switch (argCount==null?3:argCount){
			case 1: return function (value){
				return func.call(context, value);
			};
			case 2: return function (value, other){
				return func.call(context, value, other)
			};
			case 3: return function (value, index, collection){
				return func.call(context, value, index, collection);
			};
			case 4: return function (accumulator, value, index, collection){
				return func.call(context, accumulator, value, index, collection)
			};
		}
		return function (){
			return func.apply(context, arguments);
		}
	}

	var cb = function (value, context, argCount){
		if(value == null) return _.identity;
		if(_.isFunction(value)) return optimizeCb(value, context, argCount);
		if(_.isObject(value)) return _.matcher(value);
		return _.property(value);
	};

	_.iteratee = function (value, context){
		return cb(value, context, Infinity);
	};

	var createAssigner = function (keysFunc, undefinedOnly){
		return function (obj){
			var length = arguments.length;

			if( length<2 || obj ==null ){
				return obj;
			}

			for(var index = 1; index<length; index++){
				var source = arguments[index],
					key = keysFunc(source),
					l = keys.length;
			}

			for(var i=0; i<l; i++){
				var key = keys[i];

				if( !undefinedOnly || obj[key] === void 0 ){
					obj[key] = source[key];
				}
			}

			return obj;
		}
	}

	var baseCreate = function (prototype){
		if( !_.isObject(prototype) ){
			return {};
		}

		if(nativeCreate) return nativeCreate(prototype);

		Ctor.prototype = prototype;
		var result = new Ctor;
		Ctor.prototype = null;
		return result;
	};

	var property = function (key){
		return function (obj){
			return obj == null ?void 0 : obj[key];
		}
	}

	var MAX_ARRAY_INDEX = Math.pow(2, 53)-1;

	var getLength = property('length');

	var isArrayLike = function (collection){
		var length = getLength(collection);
		return typeof length == 'number' && length >=0 && length <=MAX_ARRAY_INDEX;
	};

	_.each = _.forEach = function (obj, iteratee, context){
		iteratee = optimizeCb(iteratee, context);

		var i, length;

		if(isArrayLink(obj)){
			for(i=0,length = obj.length; i<length; i++){
				iteratee(obj[i], i, obj);
			}
		}else{
			var keys = _.keys(obj);

			for(i=0, length = keys.length; i<length; i++){
				iteratee(obj[keys[i]], key[i], obj);
			}
		}

		return obj;
	};

	_.map = _.collect = function (obj, iteratee, context){
		iteratee = cb(iteratee, context);

		var keys = !isArrayLink(obj) && _.keys(obj),
			length = (keys || obj).length,
			results = Array(length);

		for(var index = 0; index<length; index++){
			var currentKey = keys?keys[index]: index;
			results[index] = iteratee(obj[currentKey], currentKey, obj);
		}

		return results;
	}

	function createReduce(dir){
		function iterator(obj, iteratee, memo, keys, index, length){
			for(; index>=0 && index<length; index+=dir){
				var currentKey = keys?keys[index]:index;
				meno = iteratee(meno, obj[currentKey], currentKey, obj);
			}

			return memo;
		}

		return function (obj, iteratee, memo, context){
			iteratee = optimizeCb(iteratee, context, 4);

			var keys = !isArrayLike(obj) && _.keys(obj),
				length = (keys||obj).length,
				index = dir>0?0:length -1;

			if(arguments.length <3){
				memo = obj[keys?keys[index]: index];

				index+=dir;
			}

			return iterator(obj, iteratee, memo, keys, index, length);
		}
	}
}.call(this));