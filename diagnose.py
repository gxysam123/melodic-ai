#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
妙音AI 系统诊断工具
检查所有依赖和配置是否正确
"""

import sys
import subprocess
from pathlib import Path

def print_header(text):
    print(f"\n{'='*60}")
    print(f"  {text}")
    print(f"{'='*60}")

def check_python():
    """检查Python版本"""
    print_header("检查Python版本")
    version = sys.version_info
    print(f"✅ Python {version.major}.{version.minor}.{version.micro}")

    if version.major < 3 or (version.major == 3 and version.minor < 9):
        print("⚠️  警告: Python版本过低，推荐3.9或更高")
        return False
    return True

def check_module(name):
    """检查Python模块"""
    try:
        __import__(name)
        return True
    except ImportError:
        return False

def check_dependencies():
    """检查所有依赖"""
    print_header("检查Python依赖")

    deps = {
        'flask': 'Flask Web框架',
        'flask_cors': 'Flask CORS支持',
        'torch': 'PyTorch深度学习框架',
        'torchaudio': 'PyTorch音频处理',
        'demucs': 'Demucs音频分离模型'
    }

    missing = []
    for module, desc in deps.items():
        if check_module(module):
            print(f"✅ {desc:30} ({module})")
        else:
            print(f"❌ {desc:30} ({module})")
            missing.append(module)

    return len(missing) == 0, missing

def check_gpu():
    """检查GPU"""
    print_header("检查GPU加速")

    try:
        import torch

        if torch.cuda.is_available():
            gpu_name = torch.cuda.get_device_name(0)
            gpu_memory = torch.cuda.get_device_properties(0).total_memory / (1024**3)
            print(f"✅ GPU: {gpu_name}")
            print(f"✅ 显存: {gpu_memory:.2f} GB")
            print(f"✅ CUDA版本: {torch.version.cuda}")
            return True
        else:
            print("ℹ️  GPU不可用，将使用CPU模式")
            print("   提示: 安装CUDA版PyTorch可启用GPU加速")
            return False
    except Exception as e:
        print(f"❌ 检查失败: {str(e)}")
        return False

def check_ffmpeg():
    """检查ffmpeg"""
    print_header("检查ffmpeg (可选)")

    try:
        result = subprocess.run(['ffmpeg', '-version'],
                              capture_output=True,
                              text=True,
                              timeout=5)
        if result.returncode == 0:
            version_line = result.stdout.split('\n')[0]
            print(f"✅ {version_line}")
            return True
        else:
            print("❌ ffmpeg未正确安装")
            return False
    except FileNotFoundError:
        print("ℹ️  ffmpeg未安装（处理视频文件时需要）")
        print("   安装: macOS: brew install ffmpeg")
        print("        Ubuntu: sudo apt-get install ffmpeg")
        return False
    except Exception as e:
        print(f"❌ 检查失败: {str(e)}")
        return False

def check_demucs():
    """检查Demucs命令"""
    print_header("检查Demucs命令")

    try:
        result = subprocess.run(['demucs', '--help'],
                              capture_output=True,
                              text=True,
                              timeout=5)
        if result.returncode == 0:
            print("✅ Demucs命令行工具可用")
            return True
        else:
            print("⚠️  Demucs命令不可用，但Python模块可用")
            return False
    except FileNotFoundError:
        print("⚠️  Demucs命令不可用，但Python模块可用")
        return False

def check_ports():
    """检查端口"""
    print_header("检查端口")

    try:
        result = subprocess.run(['lsof', '-i', ':5000'],
                              capture_output=True,
                              text=True,
                              timeout=2)
        if result.returncode == 0 and result.stdout:
            print("⚠️  端口5000已被占用:")
            print(result.stdout)
        else:
            print("✅ 端口5000可用")
    except:
        print("ℹ️  无法检查端口状态")

def check_directories():
    """检查目录"""
    print_header("检查工作目录")

    from pathlib import Path
    import tempfile

    upload_dir = Path(tempfile.gettempdir()) / 'miaoyin_uploads'
    output_dir = Path(tempfile.gettempdir()) / 'miaoyin_outputs'

    for dir_path in [upload_dir, output_dir]:
        dir_path.mkdir(exist_ok=True)
        if dir_path.exists():
            print(f"✅ {dir_path}")
        else:
            print(f"❌ 无法创建: {dir_path}")

def install_instructions(missing_modules):
    """显示安装说明"""
    print_header("安装说明")

    if missing_modules:
        print("\n缺少以下依赖，请运行:")
        print("\n# 方法1: 使用requirements.txt")
        print("pip3 install -r requirements.txt")

        print("\n# 方法2: 单独安装")
        for module in missing_modules:
            if module == 'flask_cors':
                print("pip3 install flask-cors")
            else:
                print(f"pip3 install {module}")

    print("\n如需GPU加速，安装CUDA版PyTorch:")
    print("pip3 uninstall torch torchaudio")
    print("pip3 install torch torchaudio --index-url https://download.pytorch.org/whl/cu118")

def main():
    print("""
╔════════════════════════════════════════════════════════════╗
║               妙音AI - 系统诊断工具                         ║
║                  System Diagnostic Tool                    ║
╚════════════════════════════════════════════════════════════╝
""")

    # 运行所有检查
    py_ok = check_python()
    deps_ok, missing = check_dependencies()
    gpu_ok = check_gpu()
    ffmpeg_ok = check_ffmpeg()
    demucs_ok = check_demucs()
    check_ports()
    check_directories()

    # 总结
    print_header("诊断总结")

    if py_ok and deps_ok:
        print("\n✅ 所有核心依赖已安装，可以启动服务!")
        print("\n启动命令:")
        print("  后端: python3 backend_server.py")
        print("  前端: npm run dev")

        if gpu_ok:
            print("\n🚀 GPU加速已启用，处理速度将大幅提升!")
        else:
            print("\nℹ️  使用CPU模式，处理速度较慢")
            print("   提示: 安装CUDA版PyTorch可启用GPU加速")

        if not ffmpeg_ok:
            print("\n⚠️  ffmpeg未安装，无法处理视频文件")
            print("   安装: brew install ffmpeg (macOS)")

    else:
        print("\n❌ 系统未就绪，请先安装缺少的依赖")
        install_instructions(missing)

    print("\n" + "="*60)

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n操作已取消")
    except Exception as e:
        print(f"\n❌ 诊断过程出错: {str(e)}")
        sys.exit(1)
