#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
妙音AI 后端服务器
Flask API 连接 React 前端和 Python 音频处理引擎
"""

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import tempfile
import uuid
from pathlib import Path
import logging
from werkzeug.utils import secure_filename

# 导入音频处理模块
try:
    from audio_processor import AudioProcessor
    PROCESSOR_AVAILABLE = True
except ImportError:
    PROCESSOR_AVAILABLE = False
    print("警告: audio_processor 模块未找到，将使用模拟模式")

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 初始化 Flask 应用
app = Flask(__name__)
CORS(app)  # 允许跨域请求

# 配置
UPLOAD_FOLDER = Path(tempfile.gettempdir()) / 'miaoyin_uploads'
OUTPUT_FOLDER = Path(tempfile.gettempdir()) / 'miaoyin_outputs'
UPLOAD_FOLDER.mkdir(exist_ok=True)
OUTPUT_FOLDER.mkdir(exist_ok=True)

ALLOWED_EXTENSIONS = {'mp3', 'wav', 'flac', 'ogg', 'm4a', 'mp4', 'avi', 'mov'}
MAX_FILE_SIZE = 500 * 1024 * 1024  # 500MB

# 初始化音频处理器
if PROCESSOR_AVAILABLE:
    audio_processor = AudioProcessor()
else:
    audio_processor = None

# 任务存储（实际生产环境应使用 Redis 或数据库）
tasks = {}


def allowed_file(filename):
    """检查文件扩展名是否允许"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/api/health', methods=['GET'])
def health_check():
    """健康检查端点"""
    return jsonify({
        'status': 'healthy',
        'processor_available': PROCESSOR_AVAILABLE,
        'version': 'v2.4.0-CYBER'
    })


@app.route('/api/upload', methods=['POST'])
def upload_file():
    """
    上传音频文件
    """
    if 'file' not in request.files:
        return jsonify({'error': '未找到文件'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': '文件名为空'}), 400

    if not allowed_file(file.filename):
        return jsonify({'error': f'不支持的文件格式，请使用: {", ".join(ALLOWED_EXTENSIONS)}'}), 400

    try:
        # 生成唯一任务ID
        task_id = str(uuid.uuid4())

        # 保存文件
        filename = secure_filename(file.filename)
        file_path = UPLOAD_FOLDER / f"{task_id}_{filename}"
        file.save(str(file_path))

        file_size = file_path.stat().st_size

        # 创建任务记录
        tasks[task_id] = {
            'id': task_id,
            'filename': filename,
            'file_path': str(file_path),
            'file_size': file_size,
            'status': 'uploaded',
            'progress': 0
        }

        logger.info(f"文件上传成功: {filename} ({file_size} bytes) - Task ID: {task_id}")

        return jsonify({
            'task_id': task_id,
            'filename': filename,
            'size': file_size,
            'message': '文件上传成功'
        })

    except Exception as e:
        logger.error(f"文件上传失败: {str(e)}")
        return jsonify({'error': f'上传失败: {str(e)}'}), 500


@app.route('/api/process/denoise', methods=['POST'])
def process_denoise():
    """
    智能降噪处理
    """
    data = request.json
    task_id = data.get('task_id')
    settings = data.get('settings', {})

    if not task_id or task_id not in tasks:
        return jsonify({'error': '无效的任务ID'}), 400

    task = tasks[task_id]
    input_file = task['file_path']

    # 更新任务状态
    task['status'] = 'processing'
    task['progress'] = 0

    try:
        # 生成输出文件路径
        output_filename = f"{task_id}_denoised.wav"
        output_path = OUTPUT_FOLDER / output_filename

        intensity = settings.get('intensity', 85)
        preserve_reverb = settings.get('preserveReverb', True)
        voice_recovery = settings.get('voiceRecovery', False)

        logger.info(f"开始降噪处理: {input_file}")
        logger.info(f"参数: intensity={intensity}, reverb={preserve_reverb}, recovery={voice_recovery}")

        if PROCESSOR_AVAILABLE and audio_processor:
            # 调用实际的音频处理
            result = audio_processor.remove_noise(
                input_file=input_file,
                output_file=str(output_path),
                intensity=intensity / 100.0,  # 转换为0-1范围
                preserve_reverb=preserve_reverb
            )

            task['status'] = 'completed'
            task['progress'] = 100
            task['output_path'] = str(output_path)
            task['output_filename'] = output_filename

            return jsonify({
                'task_id': task_id,
                'status': 'completed',
                'output_url': f'/api/download/{task_id}',
                'message': '降噪处理完成'
            })
        else:
            # 模拟处理（开发模式）
            import shutil
            import time
            time.sleep(2)  # 模拟处理时间
            shutil.copy(input_file, output_path)

            task['status'] = 'completed'
            task['progress'] = 100
            task['output_path'] = str(output_path)
            task['output_filename'] = output_filename

            return jsonify({
                'task_id': task_id,
                'status': 'completed',
                'output_url': f'/api/download/{task_id}',
                'message': '降噪处理完成（模拟模式）'
            })

    except Exception as e:
        logger.error(f"降噪处理失败: {str(e)}")
        task['status'] = 'error'
        task['error'] = str(e)
        return jsonify({'error': f'处理失败: {str(e)}'}), 500


@app.route('/api/process/vocal-separation', methods=['POST'])
def process_vocal_separation():
    """
    人声分离处理
    """
    data = request.json
    task_id = data.get('task_id')
    settings = data.get('settings', {})

    if not task_id or task_id not in tasks:
        return jsonify({'error': '无效的任务ID'}), 400

    task = tasks[task_id]
    input_file = task['file_path']

    task['status'] = 'processing'
    task['progress'] = 0

    try:
        output_filename = f"{task_id}_vocal_separated.wav"
        output_path = OUTPUT_FOLDER / output_filename

        sensitivity = settings.get('sensitivity', 75)
        focus_voice = settings.get('focusVoice', 'main')

        logger.info(f"开始人声分离: {input_file}")
        logger.info(f"参数: sensitivity={sensitivity}, focus={focus_voice}")

        if PROCESSOR_AVAILABLE and audio_processor:
            result = audio_processor.separate_vocals(
                input_file=input_file,
                output_file=str(output_path),
                model_type='htdemucs'
            )

            task['status'] = 'completed'
            task['progress'] = 100
            task['output_path'] = str(output_path)
            task['output_filename'] = output_filename

            return jsonify({
                'task_id': task_id,
                'status': 'completed',
                'output_url': f'/api/download/{task_id}',
                'message': '人声分离完成'
            })
        else:
            # 模拟处理
            import shutil
            import time
            time.sleep(2)
            shutil.copy(input_file, output_path)

            task['status'] = 'completed'
            task['progress'] = 100
            task['output_path'] = str(output_path)
            task['output_filename'] = output_filename

            return jsonify({
                'task_id': task_id,
                'status': 'completed',
                'output_url': f'/api/download/{task_id}',
                'message': '人声分离完成（模拟模式）'
            })

    except Exception as e:
        logger.error(f"人声分离失败: {str(e)}")
        task['status'] = 'error'
        task['error'] = str(e)
        return jsonify({'error': f'处理失败: {str(e)}'}), 500


@app.route('/api/process/track-separation', methods=['POST'])
def process_track_separation():
    """
    多音轨分离处理
    """
    data = request.json
    task_id = data.get('task_id')
    settings = data.get('settings', {})

    if not task_id or task_id not in tasks:
        return jsonify({'error': '无效的任务ID'}), 400

    task = tasks[task_id]
    input_file = task['file_path']

    task['status'] = 'processing'
    task['progress'] = 0

    try:
        output_filename = f"{task_id}_track_separated.wav"
        output_path = OUTPUT_FOLDER / output_filename

        logger.info(f"开始多音轨分离: {input_file}")
        logger.info(f"参数: {settings}")

        if PROCESSOR_AVAILABLE and audio_processor:
            result = audio_processor.separate_tracks(
                input_file=input_file,
                output_dir=str(OUTPUT_FOLDER / task_id),
                model='htdemucs'
            )

            task['status'] = 'completed'
            task['progress'] = 100
            task['output_path'] = str(output_path)
            task['output_filename'] = output_filename
            task['separated_tracks'] = result

            return jsonify({
                'task_id': task_id,
                'status': 'completed',
                'output_url': f'/api/download/{task_id}',
                'tracks': result,
                'message': '多音轨分离完成'
            })
        else:
            # 模拟处理
            import shutil
            import time
            time.sleep(3)
            shutil.copy(input_file, output_path)

            task['status'] = 'completed'
            task['progress'] = 100
            task['output_path'] = str(output_path)
            task['output_filename'] = output_filename

            return jsonify({
                'task_id': task_id,
                'status': 'completed',
                'output_url': f'/api/download/{task_id}',
                'message': '多音轨分离完成（模拟模式）'
            })

    except Exception as e:
        logger.error(f"多音轨分离失败: {str(e)}")
        task['status'] = 'error'
        task['error'] = str(e)
        return jsonify({'error': f'处理失败: {str(e)}'}), 500


@app.route('/api/task/<task_id>', methods=['GET'])
def get_task_status(task_id):
    """
    获取任务状态
    """
    if task_id not in tasks:
        return jsonify({'error': '任务不存在'}), 404

    task = tasks[task_id]
    return jsonify({
        'task_id': task_id,
        'status': task['status'],
        'progress': task.get('progress', 0),
        'filename': task.get('filename'),
        'output_filename': task.get('output_filename'),
        'error': task.get('error')
    })


@app.route('/api/download/<task_id>', methods=['GET'])
def download_file(task_id):
    """
    下载处理后的文件
    """
    if task_id not in tasks:
        return jsonify({'error': '任务不存在'}), 404

    task = tasks[task_id]

    if task['status'] != 'completed':
        return jsonify({'error': '文件未准备好'}), 400

    output_path = task.get('output_path')
    if not output_path or not os.path.exists(output_path):
        return jsonify({'error': '输出文件不存在'}), 404

    return send_file(
        output_path,
        as_attachment=True,
        download_name=task['output_filename']
    )


@app.route('/api/download-track/<task_id>', methods=['GET'])
def download_track(task_id):
    """
    下载分离后的单个音轨
    """
    if task_id not in tasks:
        return jsonify({'error': '任务不存在'}), 404

    task = tasks[task_id]

    if task['status'] != 'completed':
        return jsonify({'error': '文件未准备好'}), 400

    # 获取要下载的音轨名称
    track_name = request.args.get('track')
    if not track_name:
        return jsonify({'error': '未指定音轨名称'}), 400

    # 从separated_tracks中获取音轨路径
    separated_tracks = task.get('separated_tracks', {})
    if track_name not in separated_tracks:
        return jsonify({'error': f'音轨 {track_name} 不存在'}), 404

    track_path = separated_tracks[track_name]
    if not os.path.exists(track_path):
        return jsonify({'error': '音轨文件不存在'}), 404

    # 获取文件名
    filename = os.path.basename(track_path)

    return send_file(
        track_path,
        as_attachment=True,
        download_name=filename
    )


@app.route('/api/cleanup/<task_id>', methods=['DELETE'])
def cleanup_task(task_id):
    """
    清理任务文件
    """
    if task_id not in tasks:
        return jsonify({'error': '任务不存在'}), 404

    task = tasks[task_id]

    try:
        # 删除输入文件
        if os.path.exists(task['file_path']):
            os.remove(task['file_path'])

        # 删除输出文件
        if 'output_path' in task and os.path.exists(task['output_path']):
            os.remove(task['output_path'])

        # 从任务列表中移除
        del tasks[task_id]

        return jsonify({'message': '任务已清理'})

    except Exception as e:
        logger.error(f"清理任务失败: {str(e)}")
        return jsonify({'error': f'清理失败: {str(e)}'}), 500


if __name__ == '__main__':
    logger.info("=" * 60)
    logger.info("妙音AI 后端服务器启动")
    logger.info(f"音频处理器状态: {'可用' if PROCESSOR_AVAILABLE else '模拟模式'}")
    logger.info(f"上传目录: {UPLOAD_FOLDER}")
    logger.info(f"输出目录: {OUTPUT_FOLDER}")
    logger.info("服务地址: http://localhost:5001")
    logger.info("API地址: http://localhost:5001/api")
    logger.info("=" * 60)

    app.run(
        host='0.0.0.0',
        port=5001,
        debug=True,
        threaded=True
    )
