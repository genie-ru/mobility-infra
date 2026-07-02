# notebook = JupyterLab（dev 専用）。prod compose には載せない。
FROM python:3.13-slim AS base
ENV PIP_NO_CACHE_DIR=1 PIP_DISABLE_PIP_VERSION_CHECK=1 PYTHONUNBUFFERED=1
RUN python -m venv /venv
ENV PATH="/venv/bin:$PATH"
COPY services/notebook/requirements.txt /tmp/requirements.txt
RUN pip install -r /tmp/requirements.txt
# 日本語フォント（matplotlib のグラフで日本語を表示。無いと □□□ に文字化け）
# hadolint ignore=DL3008
RUN apt-get update && apt-get install -y --no-install-recommends fonts-ipaexfont \
    && rm -rf /var/lib/apt/lists/*
# 全カーネル起動時に日本語フォントを自動設定
COPY services/notebook/ipython_startup.py /root/.ipython/profile_default/startup/00-japanize.py
# matplotlib のフォントキャッシュを事前生成（初回描画を速く）
RUN python -c "import matplotlib.pyplot as plt"
# JupyterLab をダークテーマ既定に
COPY services/notebook/jupyter-theme.jupyterlab-settings \
     /root/.jupyter/lab/user-settings/@jupyterlab/apputils-extension/themes.jupyterlab-settings
WORKDIR /work
EXPOSE 8888
# dev 専用：トークン/パスワード無効（ホストの localhost 限定で公開する前提）
CMD ["jupyter", "lab", "--ip=0.0.0.0", "--port=8888", "--no-browser", "--allow-root", \
     "--ServerApp.token=", "--ServerApp.password=", "--ServerApp.root_dir=/work"]
