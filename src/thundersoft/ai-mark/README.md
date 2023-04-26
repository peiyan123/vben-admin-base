# ImageMark-实现方案（TypeScrip SDK） 

> SDK 开发语言：typeScript 

- /core   // 实现类
- /api    // 外部使用场景
- /exmaple  // 示例     
- - / Classification
- - / Detection
- - / Segmentation
- - / KeyPoint

当前目录可以放在     node_modules/ 里面 import { ClassificationScene } from '@thundersoft/ai-mark';
当前目录也也可以放在  src/         里面 import { ClassificationScene } from '@/thundersoft/ai-mark';

# 依赖
    rxjs 异步流处理库
        github
            https://github.com/ReactiveX/rxjs

        官网
            https://rxjs.dev/
            中文官网比较滞后，以 https://rxjs.dev/ 为主
            https://cn.rx.js.org/

        安装
            npm install rxjs
            npm install rxjs --save
            npm install rxjs -S

        协议
            Apache License 2.0

        版本
            ^7.0.1

    polybool.js 图形库


    
