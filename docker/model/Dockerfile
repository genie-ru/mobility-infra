# builder: 依存を venv に隔離（/app の外＝bind マウントと干渉しない）
FROM python:3.13-slim AS builder
ENV PIP_NO_CACHE_DIR=1 PIP_DISABLE_PIP_VERSION_CHECK=1
RUN python -m venv /venv
ENV PATH="/venv/bin:$PATH"
COPY services/model/requirements.txt /tmp/requirements.txt
RUN pip install -r /tmp/requirements.txt

# dev: ホットリロード（ソースは compose の bind マウントで /app に入る）
FROM python:3.13-slim AS dev
ENV PATH="/venv/bin:$PATH" PYTHONUNBUFFERED=1
WORKDIR /app
COPY --from=builder /venv /venv
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

# prod: 非root・リロードなし・複数ワーカー
FROM python:3.13-slim AS prod
ENV PATH="/venv/bin:$PATH" PYTHONUNBUFFERED=1 PYTHONDONTWRITEBYTECODE=1
WORKDIR /app
COPY --from=builder /venv /venv
COPY services/model/ ./
USER 65532:65532
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"]
