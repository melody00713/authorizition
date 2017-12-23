const Common = {
  hasOwn () {
    return Common.class2type.hasOwnProperty
  },
  class2type: {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Object]': 'object'
  },
  // extend () {
  //   var options
  //   var name
  //   var src
  //   var copy
  //   var copyIsArray
  //   var clone
  //   var target = arguments[ 0 ] || {}
  //   var i = 1
  //   var length = arguments.length
  //   var deep = true
  //   // Handle a deep copy situation
  //   if (typeof target === 'boolean') {
  //     deep = target
  //     // Skip the boolean and the target
  //     target = arguments[ i ] || {}
  //     i++
  //   }
  //   // Handle case when target is a string or something (possible in deep copy)
  //   if (typeof target !== 'object') {
  //     target = {}
  //   }
  //   // Extend jQuery itself if only one argument is passed
  //   if (i === length) {
  //     target = this
  //     i--
  //   }
  //   for (; i < length; i++) {
  //     // Only deal with non-null/undefined values
  //     if ((options = arguments[ i ]) != null) {
  //       // Extend the base object
  //       for (name in options) {
  //         src = target[ name ]
  //         copy = options[ name ]
  //         // Prevent never-ending loop
  //         if (target === copy) {
  //           continue
  //         }
  //         // Recurse if we're merging plain objects or arrays
  //         if (deep && copy && (Common.isPlainObject(copy) || (copyIsArray = Common.isArray(copy)))) {
  //           if (copyIsArray) {
  //             copyIsArray = false
  //             clone = src && Common.isArray(src) ? src : []
  //           } else {
  //             clone = src && Common.isPlainObject(src) ? src : {}
  //           }
  //           // Never move original objects, clone them
  //           target[ name ] = Common.extend(deep, clone, copy)
  //         } else if (copy !== undefined) {
  //           target[ name ] = copy
  //         }
  //       }
  //     }
  //   }
  //   // Return the modified object
  //   return target
  // },
  extend (target, options) {
    let copyIsArray
    let toString = Object.prototype.toString
    let hasOwn = Object.prototype.hasOwnProperty
    var type = function (obj) {
      return obj == null ? String(obj) : Common.class2type[toString.call(obj)] || 'object'
    }
    var isWindow = function (obj) {
      return obj && typeof obj === 'object' && 'setInterval' in obj
    }
    var isArray = Array.isArray || function (obj) {
      return type(obj) === 'array'
    }
    var isPlainObject = function (obj) {
      if (!obj || type(obj) !== 'object' || obj.nodeType || isWindow(obj)) {
        return false
      }
      if (obj.constructor && !hasOwn.call(obj, 'constructor') && !hasOwn.call(obj.constructor.prototype, 'isPrototypeOf')) {
        return false
      }
      var key
      for (key in obj) {
      }
      return key === undefined || hasOwn.call(obj, key)
    }
    var src
    var copy
    var clone
    var deep = true
    // 循环IE9会报错  待后续跟踪
    // for (var i = 0; i < arguments.length; i++) {
    //   if (arguments[i] !== null) {
    //     options = arguments[i]
    for (var name in options) {
      src = target[name]
      copy = options[name]
      if (target === copy) {
        continue
      }
      if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
        if (copyIsArray) {
          copyIsArray = false
          clone = src && isArray(src) ? src : []
        } else {
          clone = src && isPlainObject(src) ? src : {}
        }
        target[name] = Common.extend(clone, copy)
      } else if (copy !== undefined) {
        target[name] = copy
      }
    }
      // }
    // }
    return target
  },
  getContainerHeight () {
    return document.documentElement.clientHeight - 34
  },
  getContainerWidth () {
    return document.documentElement.clientWidth - 145
  },
  getDetailHeight () {
    return document.documentElement.clientHeight - 148
  },
  getDetailWidth () {
    return document.documentElement.clientWidth / 2 - 20
  },
  getTablePageSize () {
    var height = document.documentElement.clientHeight - 262
    return Math.floor(height / 35)
  },
  getPersissions (localStorage) {
    var persissons = {}
    if (localStorage.permissions) {
      for (let k in JSON.parse(localStorage.permissions)) {
        let childObj = {}
        JSON.parse(localStorage.permissions)[k].forEach(v => {
          if (v.permissionName !== 'visible') {
            childObj[v.permissionName] = true
          }
        })
        persissons[k] = childObj
      }
    }
    return persissons
  },
  statusCN (value) {
    var CN = {
      'Up': '运行',
      'Down': '停止',
      'Paused': '暂停',
      'Unassigned': '未分派',
      'PoweringUp': '开机中',
      'PoweringDown': '关机中',
      'MigratingFrom': '开始迁移',
      'MigratingTo': '迁移中',
      'Unknown': '未知',
      'NotResponding': '无响应',
      'WaitForLaunch': '等待开机',
      'RebootInProgress': '重启中',
      'SavingState': '正在保存',
      'RestoringState': '恢复中',
      'Suspended': '休眠',
      'ImageIllegal': '不合法',
      'ImageLocked': '磁盘锁定中',
      'Waiting': '等待中'
    }
    return CN[value]
  },
  formatterTime (value) {
    var date = new Date(value)
    var Y = date.getFullYear()
    var m = date.getMonth() + 1
    var d = date.getDate()
    var H = date.getHours()
    var i = date.getMinutes()
    var s = date.getSeconds()
    if (m < 10) {
      m = '0' + m
    }
    if (d < 10) {
      d = '0' + d
    }
    if (H < 10) {
      H = '0' + H
    }
    if (i < 10) {
      i = '0' + i
    }
    if (s < 10) {
      s = '0' + s
    }
    var t = Y + '-' + m + '-' + d + ' ' + H + ':' + i + ':' + s
    return t
  }
}
export {Common}
