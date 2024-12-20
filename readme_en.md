# img2webp-cli

A command-line tool for converting all images in the current directory to WebP format, featuring recursive subdirectory processing and quality selection options, using WASM for processing.

[English](./readme_en.md)
[中文](./readme.md)

## Installation

npm:
```bash
npm install -g img2webp-cli
```

yarn:
```bash
yarn global add img2webp-cli
```

## Usage

* Quick use:

Execute in the image directory:

```bash
cp2webp
```

* Custom use:

```bash
cp2webp -i <input_directory> -o <output_directory> -q <quality> -r <recursive> -a <alpha>
```

### Command Line Options

- `-i, --input <path>`: Specify input directory, defaults to current directory `./`
- `-o, --output <path>`: Specify output directory, defaults to `./output`
- `-q, --quality <number>`: Specify compression quality, range 1-100, defaults to 60
- `-r, --recursive <number>`: Whether to process subdirectories recursively, defaults to 0 (no recursion)
- `-a, --alpha <number>`: Whether to preserve alpha channel, 1 to preserve, 0 to discard, defaults to 1
- `-h, --help`: Display help information

## Example

To convert images in `/path/to/input` directory to WebP format and output to `/path/to/output` directory:
1. Navigate to the image directory
```bash
cd /path/to/input
```
2. Execute command
```bash
cp2webp
```
or

Execute from any directory
```bash
cp2webp -i /path/to/input -o /path/to/output -q 60 -r 1 -a 1
```

## Notes

- Supported image formats include JPG, PNG, TGA, BMP, PSD, GIF, HDR, PIC, and other common formats (for specific supported formats, please check [stb_image](https://github.com/nothings/stb))
- By default, the output directory will create a subdirectory named `output` under the specified output path
- Maximum recursive processing depth is limited to 5 levels to avoid excessive recursion and unexpected issues

## Acknowledgments

- [stb_image](https://github.com/nothings/stb)
- [libwebp](https://chromium.googlesource.com/webm/libwebp)
WASM packages include [stb_image](https://github.com/nothings/stb) and [libwebp](https://chromium.googlesource.com/webm/libwebp). Thanks to the authors and teams.

## License

MIT

Translated by Claude-3.5-sonnet-20241220