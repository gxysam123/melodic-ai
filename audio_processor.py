#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
妙音AI 音频处理引擎
基于 Facebook Demucs 模型实现音频分离和降噪
"""

import os
import torch
import torchaudio
import numpy as np
from pathlib import Path
from typing import Dict, List, Optional, Tuple
import logging
import subprocess
import shutil

# 设置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class AudioProcessor:
    """
    音频处理引擎
    支持：人声分离、多音轨分离、降噪、批量处理
    """

    def __init__(self, device: str = 'auto', model_name: str = 'htdemucs'):
        """
        初始化音频处理器

        Args:
            device: 'auto', 'cuda', 'cpu'
            model_name: 'htdemucs', 'htdemucs_ft', 'mdx_extra'
        """
        # 自动检测设备
        if device == 'auto':
            self.device = 'cuda' if torch.cuda.is_available() else 'cpu'
        else:
            self.device = device

        self.model_name = model_name

        logger.info(f"音频处理器初始化")
        logger.info(f"设备: {self.device}")
        logger.info(f"模型: {self.model_name}")

        if self.device == 'cuda':
            gpu_name = torch.cuda.get_device_name(0)
            gpu_memory = torch.cuda.get_device_properties(0).total_memory / 1024**3
            logger.info(f"GPU: {gpu_name}")
            logger.info(f"显存: {gpu_memory:.2f} GB")

    def check_demucs_installed(self) -> bool:
        """检查Demucs是否安装"""
        try:
            result = subprocess.run(['demucs', '--help'],
                                  capture_output=True,
                                  text=True,
                                  timeout=5)
            return result.returncode == 0
        except (FileNotFoundError, subprocess.TimeoutExpired):
            return False

    def separate_vocals(self,
                       input_file: str,
                       output_file: str,
                       model_type: str = 'htdemucs') -> Dict:
        """
        人声分离 - 只输出纯净人声

        Args:
            input_file: 输入音频/视频文件路径
            output_file: 输出纯人声文件路径
            model_type: 模型类型 ('htdemucs', 'htdemucs_ft', 'mdx_extra')

        Returns:
            处理结果字典
        """
        logger.info(f"开始人声分离: {input_file}")

        try:
            # 创建临时输出目录
            temp_output_dir = Path(output_file).parent / 'temp_separated'
            temp_output_dir.mkdir(exist_ok=True)

            # 构建demucs命令
            cmd = [
                'demucs',
                '--two-stems', 'vocals',  # 只分离人声和伴奏
                '-n', model_type,
                '--out', str(temp_output_dir),
                str(input_file)
            ]

            # 如果有GPU，使用GPU加速
            if self.device == 'cuda':
                cmd.insert(1, '--device')
                cmd.insert(2, 'cuda')

            logger.info(f"执行命令: {' '.join(cmd)}")

            # 执行demucs分离
            result = subprocess.run(cmd,
                                  capture_output=True,
                                  text=True,
                                  timeout=300)

            if result.returncode != 0:
                raise Exception(f"Demucs处理失败: {result.stderr}")

            # 查找分离后的人声文件
            input_stem = Path(input_file).stem
            vocals_path = temp_output_dir / model_type / input_stem / 'vocals.wav'

            if not vocals_path.exists():
                raise FileNotFoundError(f"未找到人声文件: {vocals_path}")

            # 移动人声文件到目标位置
            shutil.move(str(vocals_path), output_file)

            # 清理临时文件
            shutil.rmtree(temp_output_dir, ignore_errors=True)

            logger.info(f"人声分离完成: {output_file}")

            return {
                'status': 'success',
                'output_file': output_file,
                'vocals_only': True
            }

        except Exception as e:
            logger.error(f"人声分离失败: {str(e)}")
            raise

    def separate_tracks(self,
                       input_file: str,
                       output_dir: str,
                       model: str = 'htdemucs',
                       stems: List[str] = None) -> Dict[str, str]:
        """
        多音轨分离 - 完整分离所有音轨

        Args:
            input_file: 输入音频/视频文件
            output_dir: 输出目录
            model: 模型名称
            stems: 要分离的音轨列表，None表示全部

        Returns:
            分离后的音轨文件路径字典
        """
        logger.info(f"开始多音轨分离: {input_file}")

        try:
            output_path = Path(output_dir)
            output_path.mkdir(parents=True, exist_ok=True)

            # 构建demucs命令
            cmd = [
                'demucs',
                '-n', model,
                '--out', str(output_path),
                str(input_file)
            ]

            # 指定要分离的音轨
            if stems:
                cmd.insert(1, '--two-stems')
                cmd.insert(2, ','.join(stems))

            # GPU加速
            if self.device == 'cuda':
                cmd.insert(1, '--device')
                cmd.insert(2, 'cuda')

            logger.info(f"执行命令: {' '.join(cmd)}")

            # 执行分离
            result = subprocess.run(cmd,
                                  capture_output=True,
                                  text=True,
                                  timeout=600)

            if result.returncode != 0:
                raise Exception(f"多音轨分离失败: {result.stderr}")

            # 收集所有分离的音轨文件
            input_stem = Path(input_file).stem
            separated_dir = output_path / model / input_stem

            track_files = {}
            for track_file in separated_dir.glob('*.wav'):
                track_name = track_file.stem
                track_files[track_name] = str(track_file)

            logger.info(f"多音轨分离完成，共 {len(track_files)} 个音轨")

            return track_files

        except Exception as e:
            logger.error(f"多音轨分离失败: {str(e)}")
            raise

    def remove_noise(self,
                    input_file: str,
                    output_file: str,
                    intensity: float = 0.85,
                    preserve_reverb: bool = True) -> Dict:
        """
        智能降噪 - 基于人声分离的降噪方法

        Args:
            input_file: 输入文件
            output_file: 输出文件
            intensity: 降噪强度 (0-1)
            preserve_reverb: 是否保留混响

        Returns:
            处理结果
        """
        logger.info(f"开始降噪处理: {input_file}")

        try:
            # 方法：先分离人声，人声即为降噪后的结果
            result = self.separate_vocals(
                input_file=input_file,
                output_file=output_file,
                model_type='htdemucs'
            )

            logger.info(f"降噪完成: {output_file}")

            return {
                'status': 'success',
                'output_file': output_file,
                'method': 'vocal_separation',
                'intensity': intensity
            }

        except Exception as e:
            logger.error(f"降噪失败: {str(e)}")
            raise

    def batch_process(self,
                     input_files: List[str],
                     output_dir: str,
                     mode: str = 'vocals',
                     model: str = 'htdemucs') -> List[Dict]:
        """
        批量处理多个文件

        Args:
            input_files: 输入文件列表
            output_dir: 输出目录
            mode: 'vocals' (只提取人声) 或 'full' (完整分离)
            model: 模型名称

        Returns:
            处理结果列表
        """
        logger.info(f"开始批量处理，共 {len(input_files)} 个文件")

        results = []
        output_path = Path(output_dir)
        output_path.mkdir(parents=True, exist_ok=True)

        for i, input_file in enumerate(input_files, 1):
            try:
                logger.info(f"处理进度: {i}/{len(input_files)}")

                file_stem = Path(input_file).stem

                if mode == 'vocals':
                    # 只提取人声
                    output_file = output_path / f"{file_stem}_vocals.wav"
                    result = self.separate_vocals(
                        input_file=input_file,
                        output_file=str(output_file),
                        model_type=model
                    )
                else:
                    # 完整分离
                    result = self.separate_tracks(
                        input_file=input_file,
                        output_dir=str(output_path / file_stem),
                        model=model
                    )

                results.append({
                    'input_file': input_file,
                    'status': 'success',
                    'result': result
                })

            except Exception as e:
                logger.error(f"处理失败 {input_file}: {str(e)}")
                results.append({
                    'input_file': input_file,
                    'status': 'error',
                    'error': str(e)
                })

        success_count = sum(1 for r in results if r['status'] == 'success')
        logger.info(f"批量处理完成: {success_count}/{len(input_files)} 成功")

        return results

    def extract_audio_from_video(self,
                                video_file: str,
                                audio_file: str,
                                format: str = 'wav') -> str:
        """
        从视频中提取音频

        Args:
            video_file: 视频文件路径
            audio_file: 输出音频文件路径
            format: 音频格式 ('wav', 'mp3')

        Returns:
            输出音频文件路径
        """
        logger.info(f"从视频提取音频: {video_file}")

        try:
            cmd = [
                'ffmpeg',
                '-i', video_file,
                '-vn',  # 不要视频
                '-acodec', 'pcm_s16le' if format == 'wav' else 'libmp3lame',
                '-ar', '44100',  # 采样率
                '-ac', '2',  # 立体声
                '-y',  # 覆盖输出
                audio_file
            ]

            result = subprocess.run(cmd,
                                  capture_output=True,
                                  text=True,
                                  timeout=300)

            if result.returncode != 0:
                raise Exception(f"音频提取失败: {result.stderr}")

            logger.info(f"音频提取完成: {audio_file}")
            return audio_file

        except Exception as e:
            logger.error(f"音频提取失败: {str(e)}")
            raise


def main():
    """测试函数"""
    import argparse

    parser = argparse.ArgumentParser(description='妙音AI 音频处理引擎')
    parser.add_argument('input', help='输入音频/视频文件')
    parser.add_argument('-o', '--output', help='输出文件/目录')
    parser.add_argument('-m', '--mode',
                       choices=['vocals', 'denoise', 'tracks'],
                       default='vocals',
                       help='处理模式')
    parser.add_argument('--model',
                       default='htdemucs',
                       help='模型名称')
    parser.add_argument('--device',
                       choices=['auto', 'cuda', 'cpu'],
                       default='auto',
                       help='计算设备')

    args = parser.parse_args()

    # 初始化处理器
    processor = AudioProcessor(device=args.device, model_name=args.model)

    # 检查Demucs是否安装
    if not processor.check_demucs_installed():
        logger.error("Demucs未安装！请运行: pip install demucs")
        return

    # 设置输出路径
    if not args.output:
        input_path = Path(args.input)
        if args.mode == 'tracks':
            args.output = str(input_path.parent / f"{input_path.stem}_separated")
        else:
            args.output = str(input_path.parent / f"{input_path.stem}_{args.mode}.wav")

    # 执行处理
    try:
        if args.mode == 'vocals':
            result = processor.separate_vocals(args.input, args.output)
            print(f"\n✅ 人声分离完成!")
            print(f"输出文件: {result['output_file']}")

        elif args.mode == 'denoise':
            result = processor.remove_noise(args.input, args.output)
            print(f"\n✅ 降噪完成!")
            print(f"输出文件: {result['output_file']}")

        elif args.mode == 'tracks':
            result = processor.separate_tracks(args.input, args.output)
            print(f"\n✅ 多音轨分离完成!")
            print(f"输出目录: {args.output}")
            print(f"音轨列表:")
            for name, path in result.items():
                print(f"  - {name}: {path}")

    except Exception as e:
        logger.error(f"处理失败: {str(e)}")
        return 1

    return 0


if __name__ == '__main__':
    exit(main())
