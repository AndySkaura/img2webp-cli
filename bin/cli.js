#!/usr/bin/env node

import { processImages } from '../index.js';
import { program } from 'commander'; // 引入 commander
import path from 'path';
// 添加命令行参数
program
    //中文
    // .option('-i, --input <path>', '指定输入目录', './')
    // .option('-o, --output <path>', '指定输出目录', './output')
    // .option('-q, --quality <number>', '指定压缩质量 1-100', 60) // 默认质量为60
    // .option('-r, --recursive <number>', '是否递归处理子目录，递归几层', 0)
    // .option('-a, --alpha <number>', '是否保留透明通道', 1)
    // .option('-h, --help', '显示帮助信息')
    // .parse(process.argv);
    //english
    .option('-i, --input <path>', 'Specify the input directory', './')
    .option('-o, --output <path>', 'Specify the output directory', './')
    .option('-q, --quality <number>', 'Specify the compression quality 1-100', 60) // 默认质量为60
    .option('-r, --recursive <number>', 'Whether to recursively process subdirectories, how many layers to recurse', 0)
    .option('-a, --alpha <number>', 'Whether to keep the transparent channel', 1)
    .option('-h, --help', 'Display help information')
    .parse(process.argv);

const options = program.opts(); // 获取命令行选项
if (options.help) {
    program.help();
}
//判断参数是否正确
if (options.quality < 1 || options.quality > 100) {
    console.error('Quality parameter must be between 1 and 100');
    process.exit(1);
}
if (options.recursive < 0) {
    console.error('Recursive parameter must be greater than 0');
    process.exit(1);
}
if (options.input === '') {
    options.input = './';
}
if (options.output === '') {
    options.output = './output';
}
if (options.alpha === '') {
    options.alpha = 1;
}
if (options.recursive === '') {
    options.recursive = 0;
}
//recursive最深3层 避免递归过深 出现意外
if (options.recursive > 5) {
    options.recursive = 5;
    console.error('depth of recursive is too deep, automatically set to 5');
}
if (options.alpha != 1 && options.alpha != 0) {
    options.alpha = 1;
    console.error('alpha parameter error, automatically set to 1, keep alpha');
}
// 输出目录 加上output
options.output = path.join(options.output, 'output');
processImages(options); 