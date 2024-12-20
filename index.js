import { readdir, existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const wasmImports = {
    /** @export */
    __assert_fail: (condition, filename, line, func) => { console.log(condition, filename, line, func) },
    /** @export */
    emscripten_resize_heap: (size, old_size) => { console.log(size, old_size) },
    /** @export */
    fd_close: (fd) => { console.log(fd) },
    /** @export */
    fd_seek: (fd, offset, whence) => { console.log(fd, offset, whence) },
    /** @export */
    fd_write: (fd, buf, len, pos) => { console.log(fd, buf, len, pos) },
    emscripten_memcpy_js: (dest, src, len) => { Module.HEAPU8.copyWithin(dest, src, src + len); },
}
var Module;
// 初始化 WASM 模块
async function initWasm() {
    if (Module) {
        return;
    }
    const wasmBinary = readFileSync(join(__dirname, './wasm/convert_image_to_webp.wasm'));
    const info = {
        'env': wasmImports,
        'wasi_snapshot_preview1': wasmImports,
    };
    await WebAssembly.instantiate(wasmBinary, info).then(result => {
        // console.log('wasmModule ok');
        Module = {
            ...result.instance.exports,
            HEAPU8: new Uint8Array(result.instance.exports.memory.buffer),
            getValue: (ptr) => { return Module.HEAPU8[ptr] },
        };
        // processImages();
    });


}

export function processImages(options) {
    initWasm().then(async () => {
        convertCount = 0;
        failCount = 0;
        await processDirectory(options.input, options.output, options);
        //打印结束
        console.log('Compression completed.');
        console.log(`Converted: ${convertCount} Failed: ${failCount}`);
    });
}
//转换个数
let convertCount = 0;   
//失败个数
let failCount = 0;
// 新增处理目录的递归函数
function processDirectory(inputDir, outputDir, options, currentDepth = 0) {
    return new Promise((resolve, reject) => {
        readdir(inputDir, { withFileTypes: true }, async (err, entries) => {
            if (err) {
                console.log('Failed to scan directory: ' + err);
                reject(err);
                return;
            }

            try {
                // 处理子目录
                if (options.recursive && currentDepth < options.recursive) {
                    const dirPromises = entries
                        .filter(entry => entry.isDirectory())
                        .map(entry => {
                            const newInputPath = join(inputDir, entry.name);
                            if (resolve(newInputPath) === resolve(options.output)) {
                                return Promise.resolve();
                            }
                            const newOutputPath = join(outputDir, entry.name);
                            return processDirectory(newInputPath, newOutputPath, options, currentDepth + 1);
                        });
                    await Promise.all(dirPromises);
                }

                // 处理图片文件
                const imageFiles = entries
                    .filter(entry => entry.isFile() && /\.(jpg|jpeg|png|gif|tga|bmp|psd|gif|hdr|pic)$/i.test(entry.name))
                    .map(entry => entry.name);

                let completedFiles = 0;
                let totalFiles = imageFiles.length;

                // 压缩图片文件
                imageFiles.forEach(file => {
                    const inputPath = join(inputDir, file);
                    const outputPath = join(outputDir, `${file.split('.')[0]}.webp`);

                    try {
                        // 读取图片文件
                        const inputBuffer = readFileSync(inputPath);

                        // 转换为 Uint8Array
                        const inputData = new Uint8Array(inputBuffer);

                        // 分配内存
                        const outputSizePtr = Module.malloc(4);
                        const inputDataPtr = Module.malloc(inputData.length);
                        Module.HEAPU8.set(inputData, inputDataPtr);

                        // 调用 WASM 函数进行转换（使用命令行指定的质量）
                        const webpPtr = Module.convert_image_to_webp(
                            inputDataPtr,
                            inputData.length,
                            0,
                            0,
                            options.quality, // 使用命令行指定的质量
                            outputSizePtr,
                            options.alpha ? 1 : 0
                        );

                        // 获取输出大小
                        const outputSize = Module.HEAPU8[outputSizePtr] |
                            (Module.HEAPU8[outputSizePtr + 1] << 8) |
                            (Module.HEAPU8[outputSizePtr + 2] << 16) |
                            (Module.HEAPU8[outputSizePtr + 3] << 24);;

                        // 获取 WebP 数据
                        const webpData = Buffer.from(
                            Module.HEAPU8.subarray(webpPtr, webpPtr + outputSize)
                        );

                        // 释放内存
                        Module.free(outputSizePtr);
                        Module.free(webpPtr);
                        Module.free(inputDataPtr);

                        // 保存文件
                        if (!existsSync(outputDir)) {
                            mkdirSync(outputDir, { recursive: true });
                        }
                        writeFileSync(outputPath, webpData);

                        // 更新进度
                        completedFiles++;
                        const originalSize = (inputBuffer.length / 1024).toFixed(2);
                        const compressedSize = (outputSize / 1024).toFixed(2);
                        console.log(`Compressed: ${file} ( - ${completedFiles}/${totalFiles})`);
                        console.log(`Compression ratio: ${originalSize}KB => ${compressedSize}KB =>${((compressedSize / originalSize) * 100).toFixed(2)}%`);
                        convertCount++;
                    } catch (error) {
                        console.error(`Error processing file ${file}:`, error);
                        failCount++;
                    }
                });

                resolve();
            } catch (error) {
                reject(error);
            }
        });
    });
}
