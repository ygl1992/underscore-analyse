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

	_.reduce = _.fold1 = _.inject = createReduce(1);

	_.reduceRight = _.foldr = createReduce(-1);

	_.find = _.detect = function (obj, predicate, context){
		var key;

		if( isArrayLike(obj) ){
			key = _.findIndex(obj, predicate, context);
		}else{
			key = _.findKey(obj, predicate, context);
		}

		if(key!==void 0 && key!= -1) return obj[key];
	}

	_.filter = _.select = function (obj, predicate, context){
		var results = [];

		predicate = cb(predicate, context);

		_.each(obj, function (value, index, list){
			if( predicate(value, index, list) ){
				results.push(value);
			}
		})

		return results;
	}

	_.reject = function (obj, predicate, context){
		return _.filter(obj, _.negate(cb(predicate), context));
	}

	_.every = _.all = function (obj, predicate, context){
		predicate = cb(predicate, context);

		var keys = !isArrayLike(obj) && _.keys(obj),
			length = (keys||obj).length;

		for(var index = 0; index<length; index++){
			var currentKey = keys ? keys[index]:index;

			if(!predicate(obj[currentKey], currentKey, obj))
				return false;
		}

		return true;
	}

	_.some = _.any = function (obj, predicate, context){
		predicate = cb(predicate, context);

		var keys = !isArrayLike(obj)&&_.keys(obj),
			length = (keys||obj).length;

		for(var index=0; index<length; index++){
			var currentKey = keys?keys[index]:index;

			if( predicate(obj[currentKey], currentKey, obj) ){
				return true;
			}
		}
		return false;
	}

	_.contains = _.includes = _.include = function (obj, item, fromIndex, guard){
		if( !isArrayLike(obj) ){
			obj = _.values(obj);
		}

		if(typeof fromIndex != 'number' || guard)
			fromIndex = 0;

		return _.indexOf(obj, item, fromindex)>=0;
	}

	_.invoke = function (obj, method){
		var args = slice.call(arguments, 2);

		var isFunc = _.isFunction(method);

		return _.map(obj, function (value){
			var func = isFunc?method:value[method];
			return func == null?func:func.apply(value, args);
		})
	}

	_.pluck = function (obj, key){
		return _.map(obj, _.property(key));
	}

	_.where = function (obj, attrs){
		return _.filter(obj, _.matcher(attrs));
	}

	_.max = function (obj, iteratee, context){
		var result = -Infinity, lastComputed = -Infinity,value, computed;

		if(iteratee == null && obj != null){
			obj = isArrayLike(obj)?obj: _.values(obj);

			for(var i = 0, length = obj.length; i<length; i++){
				value = obj[i];
				if( value > result ){
					result = value;
				}
			}
		}else{
			iteratee = cb(iteratee, context);

			_.each(obj, function (value, index, list){
				computed = iteratee(value, index, list);

				if( computed > lastComputed || computed === -Infinity && result === -Infinity ){
					result = value;
					lastComputed = computed;
				}
			})
		}

		return result;
	}

	_min = function (obj, iteratee, context){
		var result = Infinity, lastComputed = Infinity, value, computed;

		if( iteratee == null && obj!=null ){
			obj = isArrayLike(obj)?obj:_.values(obj);
			for(var i=0, length=obj.length; i<length; i++){
				value = obj[i];
				if( value<result ){
					result = value;
				}
			}
		}else{
			iteratee = cb(iteratee, context);

			_.each(obj, function (value, index, list){
				computed = iteratee(value, index, list);
				if(computed<lastComputed || computed===Infinity&&result===Infinity){
					result = value;
					lastComputed = computed;
				}
			})
		}

		return result;
	}

	_.shuffle = function (obj){
		var set = isArrayLike(obj)?obj:_.values(obj);
		var length = set.length;

		var shuffled = Array(length);

		for(var index =0, rand; index<length; index++){
			rand = _.random(0, index);
			if(rand!==index) shuffled[index]=shuffled[rand];
			shuffled[rand] = set[index];
		}

		return shuffled;
	}

	_.sample = function (obj, n, guard){
		if(n==null || guard){
			if(!isArrayLike(obj)) obj = _.values(obj);
			return obj[_.random(obj.length-1)];
		}

		return _.shuffle(obj).slice(0, Math.max(0,n));
	};

	_.sortBy = function (obj, iteratee, context){
		iteratee = cb(iteratee, context);

		return _.pluck(
			_.map(obj, function (value, index, list){
				return {
					value: value,
					index: index,
					criteria: iteratee(value, index, list)
				}
			}).sort(function (left, right){
				var a = left.criteria;
				var b = right.criteria;

				if(a!==b){
					if(a>b||a===void 0) return 1;
					if(a<b||b===void 0) return -1;
				}
				return left.index - right.index;
			}), 'value'
		);
	}

	var group = function (behavior){
		return function (obj, iteratee, context){
			var result = {};

			iteratee = cb(iteratee, context);

			_.each(obj, function (value, index){
				var key = iteratee(value, index, obj);

				behavior(result, value, key);
			})

			return result;
		}
	};

	_.groupBy = group(function (result, value, key){
		if(_.has(result, key))
			result[key].push(value);
		else{
			result[key] = [value];
		}
	})

	_.indexBy = group(function (result, value, key){
		result[key] = value;
	})

	_.countBy = group(function (result, value, key){
		if(_.has(result,key)){
			result[key]++;
		}else{
			result[key] = 1;
		}
	});

	_.toArray = function (obj){
		if(!obj) return [];

		if(_.isArray(obj)) return slice.call(obj);

		if(isArrayLike(obj)) return _.map(obj, _.identity);

		return _.values(obj);
	}

	_.size = function (obj){
		if(obj==null) return 0;
		return isArrayLike(obj)?obj.length:_.keys(obj).length;
	};

	_.partition = function (obj, predicate, context){
		predicate = cb(predicate, context);
		var pass = [], fail = [];

		_.each(obj, function (value, key, obj){
			(predicate(value, key, obj)?pass:fail).push(value);
		})

		return [pass, fail];
	}

	_.first = _.head = _.take = function (array, n, guard){
		if(array == null){
			return void 0;
		}

		if(n==null||guard){
			return array[0];
		}

		return _.initial(array,array.length -n);
	};

	_.initial = function (array, n, guard){
		return slice.call(array, 0, Math.max(0, array.length-(n==null||guard?1:n)));
	}

	_.last = function (array, n, guard){
		if( array == null ){
			return void 0;
		}

		if(n==null||guard){
			return array[array.length-1];
		}

		return _.rest(array, Math.max(0, array.length-n));
	}

	_.rest = _.tail = _.drop = function (array, n, guard){
		return slice.call(array, n==null||guard?1:n);
	}

	_.compact = function (array){
		return _.filter(array, _.identity);
	}



























	_.each(['concat', 'join', 'slice'], function (name){
		var method = ArrayProto[name];
		_.prototype[name] = function (){
			return result(this, method.apply(this._wrapped, arguments));
		}
	})

	_.prototype.value = function (){
		return this._wrapped;
	}

	_.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

	_.prototype.toString = function (){
		return ''+this._wrapped;
	}

	if(typeof define === 'function'&&define.amd){
		define('underscore', [], function (){
			return _;
		})
	}
}.call(this));