# img2webp-cli

用于将当前目录下所有图像转换为 WebP 格式的命令行工具，带有递归处理子目录与压缩质量选择的功能，使用 WASM 进行处理。


[English](./readme_en.md)
[中文](./readme.md)

## 安装

npm:
```bash
npm install -g img2webp-cli
```

yarn:
```bash
yarn global add img2webp-cli
```

## 使用

* 快捷使用：

在图片目录下执行：

```bash
cp2webp
```

* 自定义使用：

```bash
cp2webp -i <input_directory> -o <output_directory> -q <quality> -r <recursive> -a <alpha>
```

### 命令行选项

- `-i, --input <path>`: 指定输入目录，默认为当前目录 `./`
- `-o, --output <path>`: 指定输出目录，默认为 `./output`
- `-q, --quality <number>`: 指定压缩质量，范围为 1-100，默认为 60
- `-r, --recursive <number>`: 是否递归处理子目录，默认为 0（不递归）
- `-a, --alpha <number>`: 是否保留透明通道，1 表示保留，0 表示不保留，默认为 1
- `-h, --help`: 显示帮助信息

## 示例

将 `/path/to/input` 目录中的图像转换为 WebP 格式，并将结果输出到 `/path/to/output` 目录：
1. 进入图片目录
```bash
cd /path/to/input
```
2. 执行命令
```bash
cp2webp
```
or

任意目录下执行
```bash
cp2webp -i /path/to/input -o /path/to/output -q 60 -r 1 -a 1
```

## 注意事项

- 该工具支持的图像格式包括 JPG, PNG, TGA, BMP, PSD, GIF, HDR, PIC 等常见图片格式(具体支持格式请查看[stb_image](https://github.com/nothings/stb))
- 默认情况下，输出目录会在指定的输出路径下创建一个名为 `output` 的子目录。
- 递归处理的最大深度限制为 5 层，避免递归过深，出现意外。

## 感谢

- [stb_image](https://github.com/nothings/stb)
- [libwebp](https://chromium.googlesource.com/webm/libwebp)
wasm打包了[stb_image](https://github.com/nothings/stb)与[libwebp](https://chromium.googlesource.com/webm/libwebp)，感谢作者与团队。

## 许可证

MIT