背景

1. 创建一个插件函数
2. 分析最基本的实现
   - 根据 options.persist boolean 类型 缓存整个 store
3. 功能拓展
   - options.persiste 支持传入对象类型
     - key
     - storage
     - paths
     - serializer
     - beforeRestore
     - afterRestore
     - debug
   - options.persiste 传入对象数组类型(暂不考虑)
4. 默认全局参数支持
5. 总结
